import React, { useState, useEffect, useRef } from 'react';
import { Zap, Award, Play, Crown, AlertTriangle, Clock, Bot } from 'lucide-react';
import { soundService } from '../../services/soundService';

const PIECES = {
  wP:'♙',wR:'♖',wN:'♘',wB:'♗',wQ:'♕',wK:'♔',
  bP:'♟',bR:'♜',bN:'♞',bB:'♝',bQ:'♛',bK:'♚',
};
const PIECE_VALUES = { P:1,N:3,B:3,R:5,Q:9,K:100 };
const TURN_TIME = 35, TOTAL_TIME = 300;

const makeInitialBoard = () => [
  ['bR','bN','bB','bQ','bK','bB','bN','bR'],
  ['bP','bP','bP','bP','bP','bP','bP','bP'],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  ['wP','wP','wP','wP','wP','wP','wP','wP'],
  ['wR','wN','wB','wQ','wK','wB','wN','wR'],
];

function getPseudoMoves(r,c,pBoard,lastMove=null,activeRules={},playerColor='w'){
  const piece=pBoard[r][c]; if(!piece) return [];
  const color=piece[0],type=piece[1],moves=[];
  const push=(tr,tc)=>{
    if(tr<0||tr>=8||tc<0||tc>=8) return false;
    const t=pBoard[tr][tc];
    if(!t){moves.push([tr,tc]);return true;}
    if(t[0]!==color) moves.push([tr,tc]);
    return false;
  };
  if(type==='P'){
    const dir=color==='w'?-1:1,sr=color==='w'?6:1;
    if(r+dir>=0&&r+dir<8&&!pBoard[r+dir][c]){
      moves.push([r+dir,c]);
      if(r===sr&&!pBoard[r+2*dir][c]) moves.push([r+2*dir,c]);
    }
    for(const dc of[-1,1]){
      const tr=r+dir,tc=c+dc;
      if(tr>=0&&tr<8&&tc>=0&&tc<8){
        if(pBoard[tr][tc]&&pBoard[tr][tc][0]!==color) moves.push([tr,tc]);
        if(lastMove&&!pBoard[tr][tc]){
          const{fr:lfr,tr:ltr,tc:ltc}=lastMove;
          const lp=pBoard[ltr][ltc];
          if(lp&&lp[1]==='P'&&lp[0]!==color&&Math.abs(lfr-ltr)===2&&ltr===r&&ltc===tc)
            moves.push([tr,tc]);
        }
      }
    }
    // REVERSE_PAWN rule for player
    if(color===playerColor&&activeRules.REVERSE_PAWN>0){
      const rDir=-dir;
      if(r+rDir>=0&&r+rDir<8&&!pBoard[r+rDir][c]){
        moves.push([r+rDir,c]);
      }
      for(const dc of[-1,1]){
        const tr=r+rDir,tc=c+dc;
        if(tr>=0&&tr<8&&tc>=0&&tc<8&&pBoard[tr][tc]&&pBoard[tr][tc][0]!==color){
          moves.push([tr,tc]);
        }
      }
    }
  }
  if(type==='N') for(const[dr,dc]of[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) push(r+dr,c+dc);
  if(type==='R'||type==='Q') for(const[dr,dc]of[[-1,0],[1,0],[0,-1],[0,1]]){let s=1;while(push(r+dr*s,c+dc*s))s++;}
  if(type==='B'||type==='Q') for(const[dr,dc]of[[-1,-1],[-1,1],[1,-1],[1,1]]){let s=1;while(push(r+dr*s,c+dc*s))s++;}
  if(type==='K') for(const[dr,dc]of[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) push(r+dr,c+dc);
  // ROOK_JUMP rule for player
  if(type==='R'&&color===playerColor&&activeRules.ROOK_JUMP>0){
    for(const[dr,dc]of[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) push(r+dr,c+dc);
  }
  return moves;
}

function findKing(color,pBoard){
  for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(pBoard[r][c]===color+'K') return[r,c];
  return null;
}

function isInCheck(color,pBoard){
  const kPos=findKing(color,pBoard); if(!kPos) return false;
  const[kr,kc]=kPos,enemy=color==='w'?'b':'w';
  for(let r=0;r<8;r++) for(let c=0;c<8;c++)
    if(pBoard[r][c]&&pBoard[r][c][0]===enemy)
      if(getPseudoMoves(r,c,pBoard,null).some(([tr,tc])=>tr===kr&&tc===kc)) return true;
  return false;
}

function applyMove(fr,fc,tr,tc,pBoard){
  const nb=pBoard.map(row=>[...row]),piece=nb[fr][fc],type=piece?piece[1]:null;
  if(type==='P'&&Math.abs(fc-tc)===1&&!nb[tr][tc]) nb[fr][tc]=null;
  if(type==='K'&&Math.abs(fc-tc)===2){
    if(tc===6){nb[tr][5]=nb[tr][7];nb[tr][7]=null;}
    if(tc===2){nb[tr][3]=nb[tr][0];nb[tr][0]=null;}
  }
  nb[tr][tc]=nb[fr][fc];nb[fr][fc]=null;return nb;
}

function getLegalMoves(r,c,pBoard,lastMove,cr,frozenPieces={},activeRules={},playerColor='w'){
  const ck=`${r}-${c}`;
  if(frozenPieces&&frozenPieces[ck]>0) return [];
  const piece=pBoard[r][c]; if(!piece) return [];
  const color=piece[0];
  const moves=getPseudoMoves(r,c,pBoard,lastMove,activeRules,playerColor).filter(([tr,tc])=>!isInCheck(color,applyMove(r,c,tr,tc,pBoard)));
  if(piece[1]==='K'&&!isInCheck(color,pBoard)){
    const row=color==='w'?7:0;
    const[rk,rq]=color==='w'?[cr.wK,cr.wQ]:[cr.bK,cr.bQ];
    if(rk&&!pBoard[row][5]&&!pBoard[row][6]&&!isInCheck(color,applyMove(row,4,row,5,pBoard))&&!isInCheck(color,applyMove(row,4,row,6,pBoard))) moves.push([row,6]);
    if(rq&&!pBoard[row][1]&&!pBoard[row][2]&&!pBoard[row][3]&&!isInCheck(color,applyMove(row,4,row,3,pBoard))&&!isInCheck(color,applyMove(row,4,row,2,pBoard))) moves.push([row,2]);
  }
  return moves;
}

function hasAnyLegalMove(color,pBoard,lastMove,cr,frozenPieces={},activeRules={},playerColor='w'){
  for(let r=0;r<8;r++) for(let c=0;c<8;c++)
    if(pBoard[r][c]&&pBoard[r][c][0]===color&&getLegalMoves(r,c,pBoard,lastMove,cr,frozenPieces,activeRules,playerColor).length>0) return true;
  return false;
}

// Positional Piece-Square Tables (from Black perspective: row 0 is home, row 7 is enemy)
const PST = {
  P: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [0,  0,  0,  0,  0,  0,  0,  0]
  ],
  N: [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 20, 25, 25, 20,  0,-30],
    [-30,  5, 20, 25, 25, 20,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  B: [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  0, 10, 15, 15, 10,  0,-10],
    [-10,  5, 10, 15, 15, 10,  5,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  R: [
    [0,  0,  0,  5,  5,  0,  0,  0],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [5, 10, 10, 10, 10, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
  ],
  Q: [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
  ],
  K: [
    [20, 30, 10,  0,  0, 10, 30, 20],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30]
  ]
};

function evaluateAiMove(fr, fc, tr, tc, curBoard, cr, lastMove, shieldedSquares, frozenPieces, aiColor='b') {
  const oppColor = aiColor === 'w' ? 'b' : 'w';
  const mp = curBoard[fr][fc];
  const tp = curBoard[tr][tc];
  const mType = mp[1];
  const targetKey = `${tr}-${tc}`;
  const isTargetShielded = shieldedSquares && shieldedSquares.has(targetKey);

  const nextBoard = applyMove(fr, fc, tr, tc, curBoard);

  // 1. Checkmate = Instant Absolute Win
  if (!hasAnyLegalMove(oppColor, nextBoard, { fr, fc, tr, tc }, cr, frozenPieces) && isInCheck(oppColor, nextBoard)) {
    return 100000;
  }

  let score = 0;

  // 2. Material value of capture
  if (tp && !isTargetShielded) {
    const val = (PIECE_VALUES[tp[1]] || 1) * 100;
    const attackerVal = (PIECE_VALUES[mType] || 1) * 100;
    score += val * 1.6 - (attackerVal * 0.15);
  }

  // 3. Delivers check
  if (isInCheck(oppColor, nextBoard)) {
    score += 55;
  }

  // 4. Positional PST bonus (adjust row for White vs Black perspective)
  if (PST[mType]) {
    const trPst = aiColor === 'b' ? tr : 7 - tr;
    const frPst = aiColor === 'b' ? fr : 7 - fr;
    score += PST[mType][trPst][tc] - PST[mType][frPst][fc];
  }

  // 5. Center control (d4, e4, d5, e5)
  if ((tr === 3 || tr === 4) && (tc === 3 || tc === 4)) {
    score += 25;
  }

  // 6. Castling bonus
  if (mType === 'K' && Math.abs(fc - tc) === 2) {
    score += 85;
  }

  // 7. Tactical Safety (Blunder check):
  let isAttackedByOpp = false;
  let minAttackerValue = 9999;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const oppPiece = nextBoard[r][c];
      if (oppPiece && oppPiece[0] === oppColor) {
        const oppMoves = getPseudoMoves(r, c, nextBoard, null);
        if (oppMoves.some(([wr, wc]) => wr === tr && wc === tc)) {
          isAttackedByOpp = true;
          const aVal = (PIECE_VALUES[oppPiece[1]] || 1) * 100;
          if (aVal < minAttackerValue) minAttackerValue = aVal;
        }
      }
    }
  }

  const pieceVal = (PIECE_VALUES[mType] || 1) * 100;

  if (isAttackedByOpp) {
    let isDefendedByAi = false;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const bp = nextBoard[r][c];
        if (bp && bp[0] === aiColor && !(r === tr && c === tc)) {
          const testBoard = nextBoard.map(row => [...row]);
          testBoard[tr][tc] = oppColor + 'P';
          if (getPseudoMoves(r, c, testBoard, null).some(([br, bc]) => br === tr && bc === tc)) {
            isDefendedByAi = true;
            break;
          }
        }
      }
      if (isDefendedByAi) break;
    }

    if (isDefendedByAi) {
      if (minAttackerValue < pieceVal) {
        score -= (pieceVal - minAttackerValue) * 1.25;
      }
    } else {
      score -= pieceVal * 1.5; // Heavy blunder prevention
    }
  }

  // 8. Escape threatened piece
  let wasAttacked = false;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const oppPiece = curBoard[r][c];
      if (oppPiece && oppPiece[0] === oppColor) {
        if (getPseudoMoves(r, c, curBoard, null).some(([wr, wc]) => wr === fr && wc === fc)) {
          wasAttacked = true;
          break;
        }
      }
    }
    if (wasAttacked) break;
  }
  if (wasAttacked && !isAttackedByOpp) {
    score += pieceVal * 1.2;
  }

  // 9. Pawn push towards promotion
  if (mType === 'P') {
    if (aiColor === 'b' && tr >= 5) {
      score += (tr - 4) * 40;
    } else if (aiColor === 'w' && tr <= 2) {
      score += (3 - tr) * 40;
    }
  }

  return score;
}

function pickAiMove(pBoard, chaos, queenBanned, lastMove, cr, shieldedSquares = new Set(), frozenPieces = {}, aiColor = 'b') {
  const moves = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (pBoard[r][c] && pBoard[r][c][0] === aiColor) {
        if (queenBanned && pBoard[r][c] === aiColor + 'Q') continue;
        const ck = `${r}-${c}`;
        if (frozenPieces && frozenPieces[ck] > 0) continue;
        for (const [tr, tc] of getLegalMoves(r, c, pBoard, lastMove, cr, frozenPieces)) {
          const score = chaos
            ? Math.random() * 50
            : evaluateAiMove(r, c, tr, tc, pBoard, cr, lastMove, shieldedSquares, frozenPieces, aiColor);
          moves.push({ fromR: r, fromC: c, toR: tr, toC: tc, score });
        }
      }
    }
  }
  if (!moves.length) return null;
  if (chaos) return moves[Math.floor(Math.random() * moves.length)];
  moves.sort((a, b) => b.score - a.score);
  const bestScore = moves[0].score;
  const topCands = moves.filter(m => m.score >= bestScore - 15);
  return topCands[Math.floor(Math.random() * topCands.length)];
}

const RULE_OPTIONS=[
  {id:'REVERSE_PAWN',emoji:'⬇️',name:'Geri Piyon',desc:'Piyonların geri de gidebilir (3 tur)',turns:3},
  {id:'ROOK_JUMP',emoji:'🦘',name:'Kale Atlama',desc:'Kaleler at gibi atlayabilir (3 tur)',turns:3},
  {id:'DOUBLE_MOVE',emoji:'⚡',name:'Çift Hamle',desc:'Bu tur 2 hamle hakkın (1 tur)',turns:1},
  {id:'QUEEN_BAN',emoji:'🚫',name:'Vezir Yasağı',desc:'AI veziri 3 tur hareket edemez',turns:3},
  {id:'CHAOS_AI',emoji:'🎲',name:'Kaos Modu',desc:'AI 3 tur rastgele hamle yapar',turns:3},
];

const SPELLS=[
  {id:'ADD_TIME',label:'⏱️ +10sn',cost:1,color:'#22d3ee'},
  {id:'SHIELD',label:'🛡️ Kalkan',cost:1,color:'#10b981'},
  {id:'FREEZE',label:'❄️ Dondur',cost:1,color:'#818cf8'},
  {id:'TELEPORT',label:'🌀 Işınla',cost:2,color:'#38bdf8'},
  {id:'ASCEND',label:"♕ Vezir'e",cost:2,color:'#fbbf24'},
  {id:'RULE_CHANGE',label:'🔀 Kural',cost:2,color:'#f97316'},
  {id:'KING_ASCEND',label:'👑 2. Kral',cost:3,color:'#ef4444'},
  {id:'MIND_CONTROL',label:'🧠 Hipnoz',cost:3,color:'#d946ef'},
];

function fmt(s){const m=Math.floor(s/60);return `${m}:${String(s%60).padStart(2,'0')}`;}

export default function KuantumSatranc({onGameComplete}){
  const[board,setBoard]=useState(makeInitialBoard);
  const[selectedPos,setSelectedPos]=useState(null);
  const[validMoves,setValidMoves]=useState([]);
  const[playerColor,setPlayerColor]=useState('w'); // 'w' or 'b'
  const aiColor=playerColor==='w'?'b':'w';
  const[playerTurn,setPlayerTurn]=useState('b'); // Black always starts first!
  const[castlingRights,setCastlingRights]=useState({wK:true,wQ:true,bK:true,bQ:true});
  const[lastMove,setLastMove]=useState(null);
  const[captureProgress,setCaptureProgress]=useState(0);
  const[energyOrbs,setEnergyOrbs]=useState(0);
  const[aiCaptureProgress,setAiCaptureProgress]=useState(0);
  const[aiEnergyOrbs,setAiEnergyOrbs]=useState(1);
  const[frozenPieces,setFrozenPieces]=useState({});
  const[activeSpell,setActiveSpell]=useState(null);
  const[turnTimeLeft,setTurnTimeLeft]=useState(TURN_TIME);
  const[totalTimeLeft,setTotalTimeLeft]=useState(TOTAL_TIME);
  const timerRef=useRef(null);
  const[pendingPromotion,setPendingPromotion]=useState(null);
  const[isWhiteInCheck,setIsWhiteInCheck]=useState(false);
  const[isBlackInCheck,setIsBlackInCheck]=useState(false);
  const[shieldedSquares,setShieldedSquares]=useState(new Set());
  const[aiStunnedTurns,setAiStunnedTurns]=useState(0);
  const[activeRules,setActiveRules]=useState({});
  const[showRuleModal,setShowRuleModal]=useState(false);
  const[score,setScore]=useState(0);
  const[isPlaying,setIsPlaying]=useState(false);
  const[gameOver,setGameOver]=useState(false);
  const[winnerMessage,setWinnerMessage]=useState('');
  const[battleLogs,setBattleLogs]=useState(["⚔️ Kuantum Satranç'a hoş geldiniz!"]);

  const addLog=msg=>setBattleLogs(prev=>[msg,...prev.slice(0,7)]);
  const clearTimer=()=>{if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null;}};

  const startTimers=(turnSecs=TURN_TIME)=>{
    clearTimer();setTurnTimeLeft(turnSecs);
    timerRef.current=setInterval(()=>{
      setTurnTimeLeft(p=>{if(p<=1){clearTimer();return 0;}return p-1;});
      setTotalTimeLeft(p=>{if(p<=1){clearTimer();return 0;}return p-1;});
    },1000);
  };

  // Turn time out for player
  useEffect(()=>{
    if(!isPlaying||gameOver||playerTurn!==playerColor||pendingPromotion) return;
    if(turnTimeLeft===0){
      addLog('⏰ Tur süresi doldu!');
      setSelectedPos(null);
      setValidMoves([]);
      setPlayerTurn(aiColor);
      setTimeout(()=>triggerAiMove(board,captureProgress,energyOrbs,castlingRights,lastMove,shieldedSquares,frozenPieces,aiCaptureProgress,aiEnergyOrbs,aiColor,playerColor),500);
    }
  },[turnTimeLeft]); // eslint-disable-line

  // Overall time out for player
  useEffect(()=>{
    if(!isPlaying||gameOver||playerTurn!==playerColor||pendingPromotion) return;
    if(totalTimeLeft===0) endGame(false,'⌛ Toplam Süre Bitti! AI Kazandı!');
  },[totalTimeLeft]); // eslint-disable-line

  // Timer run loop when it's player's turn
  useEffect(()=>{
    if(isPlaying&&playerTurn===playerColor&&!gameOver&&!pendingPromotion) startTimers(TURN_TIME);
    else clearTimer();
    return clearTimer;
  },[playerTurn,isPlaying,gameOver,pendingPromotion,playerColor]); // eslint-disable-line

  const endGame=(isWin,msg)=>{
    clearTimer();setIsPlaying(false);setGameOver(true);setWinnerMessage(msg);
    if(isWin) soundService.levelUp?.(); else soundService.error?.();
    if(onGameComplete) onGameComplete('kuantum_satranc','mantik',score+(isWin?1500:0),5);
  };

  const startGame=()=>{
    clearTimer();
    const initialBoard = makeInitialBoard();
    const initialRights = {wK:true,wQ:true,bK:true,bQ:true};
    setBoard(initialBoard);setCastlingRights(initialRights);
    setSelectedPos(null);setValidMoves([]);setPendingPromotion(null);setLastMove(null);

    // 1. Random color assignment: 50% White ('w'), 50% Black ('b')
    const assignedPlayer = Math.random() < 0.5 ? 'w' : 'b';
    const assignedAi = assignedPlayer === 'w' ? 'b' : 'w';
    setPlayerColor(assignedPlayer);

    // 2. Black ALWAYS moves first!
    setPlayerTurn('b');

    setCaptureProgress(0);setEnergyOrbs(0);
    setAiCaptureProgress(0);setAiEnergyOrbs(1);
    setFrozenPieces({});
    setActiveSpell(null);
    setIsWhiteInCheck(false);setIsBlackInCheck(false);
    setShieldedSquares(new Set());setAiStunnedTurns(0);setActiveRules({});setShowRuleModal(false);
    setScore(0);setGameOver(false);setIsPlaying(true);
    setTurnTimeLeft(TURN_TIME);setTotalTimeLeft(TOTAL_TIME);

    if(assignedPlayer==='b'){
      // Player is Black: Black starts, so player moves first!
      addLog('🎲 Kura sonucu: SİYAH (♚) taşları aldınız!');
      addLog('⚔️ Siyahlar her zaman oyuna ilk başlar! Hamle sırası sizde.');
    } else {
      // Player is White: AI is Black, so AI moves first!
      addLog('🎲 Kura sonucu: BEYAZ (♔) taşları aldınız!');
      addLog('⚔️ Siyahlar her zaman oyuna ilk başlar! AI (Siyah) açılışı yapıyor...');
      setTimeout(()=>triggerAiMove(initialBoard,0,0,initialRights,null,new Set(),{},0,1,assignedAi,assignedPlayer),700);
    }
  };

  const updateRights=(fr,fc,tr,tc,mp,tp)=>{
    setCastlingRights(prev=>{
      const n={...prev};
      if(mp==='wK'){n.wK=false;n.wQ=false;}if(mp==='bK'){n.bK=false;n.bQ=false;}
      if(mp==='wR'){if(fr===7&&fc===0)n.wQ=false;if(fr===7&&fc===7)n.wK=false;}
      if(mp==='bR'){if(fr===0&&fc===0)n.bQ=false;if(fr===0&&fc===7)n.bK=false;}
      if(tp==='wR'){if(tr===7&&tc===0)n.wQ=false;if(tr===7&&tc===7)n.wK=false;}
      if(tp==='bR'){if(tr===0&&tc===0)n.bQ=false;if(tr===0&&tc===7)n.bK=false;}
      return n;
    });
  };

  const afterMoveChecks=(newBoard,moverColor,moveRec,cr)=>{
    const opp=moverColor==='w'?'b':'w';
    const wChk=isInCheck('w',newBoard),bChk=isInCheck('b',newBoard);
    setIsWhiteInCheck(wChk);setIsBlackInCheck(bChk);
    if(!hasAnyLegalMove(opp,newBoard,moveRec,cr,frozenPieces,activeRules,playerColor)){
      if(isInCheck(opp,newBoard)) endGame(moverColor===playerColor,moverColor===playerColor?'🎉 Şah Mat! Kazandın!':'💀 Şah Mat! AI Kazandı!');
      else endGame(false,'⚖️ Pat! Beraberlik.');
      return false;
    }
    return true;
  };

  const commitMove=(fr,fc,tr,tc,curBoard,curCap,curOrbs,cRights,lMove)=>{
    const tp=curBoard[tr][tc],mp=curBoard[fr][fc];
    const isEP=mp[1]==='P'&&Math.abs(fc-tc)===1&&!tp;
    const isCastle=mp[1]==='K'&&Math.abs(fc-tc)===2;
    const sk=`${fr}-${fc}`,tk=`${tr}-${tc}`;

    // Target piece is protected by enemy shield!
    if(shieldedSquares.has(tk) && tp && tp.startsWith(aiColor)){
      soundService.spellCast?.();
      addLog(`🛡️ Düşman Kalkanı darbeyi emdi ve kırıldı! ${PIECES[tp]} saldırıdan korundu!`);
      let nextShields = new Set(shieldedSquares);
      nextShields.delete(tk);
      setShieldedSquares(nextShields);
      setPlayerTurn(aiColor);
      setTimeout(()=>triggerAiMove(curBoard,curCap,curOrbs,cRights,lMove,nextShields,frozenPieces,aiCaptureProgress,aiEnergyOrbs,aiColor,playerColor),600);
      return;
    }

    const newBoard=applyMove(fr,fc,tr,tc,curBoard);
    updateRights(fr,fc,tr,tc,mp,tp);

    let nextShields = new Set(shieldedSquares);
    if(nextShields.has(sk)){
      nextShields.delete(sk);
      nextShields.add(tk);
    }
    if(tp && nextShields.has(tk)){
      nextShields.delete(tk);
    }
    setShieldedSquares(nextShields);
    const newMR={fr,fc,tr,tc};setLastMove(newMR);
    let np=curCap,no=curOrbs;
    if(tp||isEP){
      soundService.success?.();
      const val=tp?(PIECE_VALUES[tp[1]]||1):1;
      setScore(s=>s+(val*100));np=curCap+1;
      if(np>=3){np=0;no=Math.min(9,curOrbs+1);soundService.levelUp?.();addLog(`⚡ ENERJİ DOLDU! +1 Orb → Toplam: ${no}`);}
      else addLog(`💥 Taş Yendi${isEP?' (Geçerken Alma)':''}! Enerji: [${np}/3]`);
      if(tp===aiColor+'K'){endGame(true,'👑 Düşman Kralı Devrildi! Zafer!');return;}
    } else {soundService.click?.();if(isCastle) addLog('🏰 Rok Yapıldı!');}
    setCaptureProgress(np);setEnergyOrbs(no);setBoard(newBoard);

    // Unfreeze tick for AI pieces
    let nextFrozen = {};
    for (const [k, turns] of Object.entries(frozenPieces)) {
      const [pr, pc] = k.split('-').map(Number);
      const p = newBoard[pr]?.[pc];
      if (p && p[0] === aiColor) {
        if (turns - 1 > 0) nextFrozen[k] = turns - 1;
        else addLog(`❄️ ${aiColor==='b'?'Siyah':'Beyaz'} ${PIECES[p]} buzları eridi!`);
      } else if (p && p[0] === playerColor) {
        nextFrozen[k] = turns;
      }
    }
    setFrozenPieces(nextFrozen);

    // Check for player pawn promotion
    const isPromotion=(playerColor==='w'&&mp==='wP'&&tr===0)||(playerColor==='b'&&mp==='bP'&&tr===7);
    if(isPromotion){
      soundService.levelUp?.();
      setPendingPromotion({r:tr,c:tc,boardSnap:newBoard,moveRec:newMR});
      addLog('🌟 PİYON TERFİİ! Taş seçin!');
      return;
    }

    const ok=afterMoveChecks(newBoard,playerColor,newMR,castlingRights);if(!ok) return;
    if(isInCheck(aiColor,newBoard)) addLog(`⚠️ ${aiColor==='b'?'Siyah':'Beyaz'} Şah'a şah çekildi.`);

    // Double Move rule active?
    if(activeRules['DOUBLE_MOVE']>0){
      setActiveRules(prev=>({...prev,DOUBLE_MOVE:prev.DOUBLE_MOVE-1}));
      addLog('⚡ Çift Hamle devrede! Bir hamle hakkınız daha var!');
      return;
    }

    setPlayerTurn(aiColor);
    setTimeout(()=>triggerAiMove(newBoard,np,no,castlingRights,newMR,nextShields,nextFrozen,aiCaptureProgress,aiEnergyOrbs,aiColor,playerColor),600);
  };

  const handleSelectPromotion=(type)=>{
    if(!pendingPromotion) return;
    const{r,c,boardSnap,moveRec}=pendingPromotion;
    if(type==='K'&&energyOrbs<3) return;
    const nb=boardSnap.map(row=>[...row]);nb[r][c]=`${playerColor}${type}`;
    if(type==='K') setEnergyOrbs(o=>o-3);
    setBoard(nb);setPendingPromotion(null);
    soundService.success?.();addLog(`✨ Piyonunuz ${PIECES[playerColor+type]} oldu!`);
    const ok=afterMoveChecks(nb,playerColor,moveRec,castlingRights);if(!ok) return;
    setPlayerTurn(aiColor);
    setTimeout(()=>triggerAiMove(nb,captureProgress,energyOrbs,castlingRights,moveRec,shieldedSquares,frozenPieces,aiCaptureProgress,aiEnergyOrbs,aiColor,playerColor),600);
  };

  const triggerAiMove=(curBoard,captProg,eOrbs,cRights,lMove,curShields=shieldedSquares,curFrozen=frozenPieces,curAiCapt=aiCaptureProgress,curAiOrbs=aiEnergyOrbs,curAiColor=aiColor,curPlayerColor=playerColor)=>{
    setActiveRules(prev=>{
      const next={};
      for(const[k,v]of Object.entries(prev)){if(v-1>0)next[k]=v-1;else addLog(`🔀 ${RULE_OPTIONS.find(r=>r.id===k)?.name} kuralı sona erdi!`);}
      return next;
    });
    if(aiStunnedTurns>0){setAiStunnedTurns(t=>t-1);addLog('❄️ AI dondurulmuş, tur atladı!');setPlayerTurn(curPlayerColor);return;}

    let activeBoard = curBoard.map(row => [...row]);
    let activeShields = new Set(curShields);
    let activeFrozen = { ...curFrozen };
    let aiOrbs = curAiOrbs;
    let aiCapt = curAiCapt;

    // === AI QUANTUM SPELL CASTING (NEVER ON KINGS!) ===
    // 1. AI Shield (Cost: 1 Orb) - Target threatened high-value piece of AI (not King)
    if (aiOrbs >= 1) {
      const candidates = [curAiColor+'Q', curAiColor+'R', curAiColor+'B', curAiColor+'N', curAiColor+'P'];
      let targetToShield = null;
      for (const pType of candidates) {
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const p = activeBoard[r][c];
            const sk = `${r}-${c}`;
            if (p === pType && !activeShields.has(sk)) {
              let isAttacked = false;
              for (let wr = 0; wr < 8; wr++) {
                for (let wc = 0; wc < 8; wc++) {
                  if (activeBoard[wr][wc]?.startsWith(curPlayerColor)) {
                    if (getPseudoMoves(wr, wc, activeBoard, null).some(([tr, tc]) => tr === r && tc === c)) {
                      isAttacked = true;
                      break;
                    }
                  }
                }
                if (isAttacked) break;
              }
              if (isAttacked) {
                targetToShield = { r, c, sk, p };
                break;
              }
            }
          }
          if (targetToShield) break;
        }
        if (targetToShield) break;
      }
      if (targetToShield) {
        activeShields.add(targetToShield.sk);
        aiOrbs -= 1;
        setShieldedSquares(new Set(activeShields));
        setAiEnergyOrbs(aiOrbs);
        soundService.spellCast?.();
        addLog(`🛡️ AI Kalkan Büyüsü Kullandı! ${PIECES[targetToShield.p]} korundu!`);
      }
    }

    // 2. AI Freeze (Cost: 1 Orb) - Target player's active threat (not King)
    if (aiOrbs >= 1) {
      const threats = [curPlayerColor+'Q', curPlayerColor+'R', curPlayerColor+'B', curPlayerColor+'N'];
      let targetToFreeze = null;
      for (const pType of threats) {
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const wp = activeBoard[r][c];
            const fk = `${r}-${c}`;
            if (wp === pType && (!activeFrozen[fk] || activeFrozen[fk] <= 0)) {
              const isAdvanced = curPlayerColor === 'w' ? r <= 4 : r >= 3;
              if (isAdvanced || pType === curPlayerColor + 'Q') {
                targetToFreeze = { r, c, fk, wp };
                break;
              }
            }
          }
          if (targetToFreeze) break;
        }
        if (targetToFreeze) break;
      }
      if (targetToFreeze) {
        activeFrozen[targetToFreeze.fk] = 2;
        aiOrbs -= 1;
        setFrozenPieces({ ...activeFrozen });
        setAiEnergyOrbs(aiOrbs);
        soundService.spellCast?.();
        addLog(`❄️ AI Dondurma Kullandı! ${PIECES[targetToFreeze.wp]} 2 tur donduruldu!`);
      }
    }

    // 3. AI Ascend (Cost: 2 Orbs)
    if (aiOrbs >= 2) {
      let pawnToAscend = null;
      if (curAiColor === 'b') {
        for (let r = 6; r >= 4; r--) {
          for (let c = 0; c < 8; c++) {
            if (activeBoard[r][c] === 'bP') {
              pawnToAscend = { r, c };
              break;
            }
          }
          if (pawnToAscend) break;
        }
      } else {
        for (let r = 1; r <= 3; r++) {
          for (let c = 0; c < 8; c++) {
            if (activeBoard[r][c] === 'wP') {
              pawnToAscend = { r, c };
              break;
            }
          }
          if (pawnToAscend) break;
        }
      }
      if (pawnToAscend) {
        activeBoard[pawnToAscend.r][pawnToAscend.c] = curAiColor + 'Q';
        aiOrbs -= 2;
        setAiEnergyOrbs(aiOrbs);
        soundService.levelUp?.();
        addLog(`♕ AI Piyon Terfisi Büyüsü! AI piyonu Vezir'e dönüştü!`);
      }
    }

    const move=pickAiMove(activeBoard,activeRules['CHAOS_AI']>0,activeRules['QUEEN_BAN']>0,lMove,cRights,activeShields,activeFrozen,curAiColor);
    if(!move){setPlayerTurn(curPlayerColor);return;}
    const{fromR,fromC,toR,toC}=move,tp=activeBoard[toR][toC];
    const tk=`${toR}-${toC}`,moverPiece=activeBoard[fromR][fromC];
    const isEP=moverPiece===curAiColor+'P'&&Math.abs(fromC-toC)===1&&!tp,epk=`${fromR}-${toC}`;
    if(activeShields.has(tk)&&tp?.startsWith(curPlayerColor)){
      soundService.spellCast?.();addLog(`🛡️ AI saldırdı ama Kalkan ${PIECES[tp]} taşını korudu!`);
      activeShields.delete(tk);
      setShieldedSquares(new Set(activeShields));
      setPlayerTurn(curPlayerColor);
      return;
    }
    if(isEP&&activeShields.has(epk)){
      soundService.spellCast?.();addLog('🛡️ AI Geçerken Alma denedi ama Kalkan piyonu korudu!');
      activeShields.delete(epk);
      setShieldedSquares(new Set(activeShields));
      setPlayerTurn(curPlayerColor);
      return;
    }
    const newBoard=applyMove(fromR,fromC,toR,toC,activeBoard),newMR={fr:fromR,fc:fromC,tr:toR,tc:toC};
    updateRights(fromR,fromC,toR,toC,activeBoard[fromR][fromC],tp);setLastMove(newMR);

    const sk=`${fromR}-${fromC}`;
    if(activeShields.has(sk)){
      activeShields.delete(sk);
      activeShields.add(tk);
    }
    if(tp && activeShields.has(tk) && !activeShields.has(sk)){
      activeShields.delete(tk);
    }
    setShieldedSquares(new Set(activeShields));
    
    // AI Pawn auto-queen promotion upon reaching opposite end rank
    if(moverPiece==='bP'&&toR===7){newBoard[toR][toC]='bQ';addLog('♛ AI Piyonu Vezire terfi etti!');}
    else if(moverPiece==='wP'&&toR===0){newBoard[toR][toC]='wQ';addLog('♕ AI Piyonu Vezire terfi etti!');}

    if(tp||isEP){
      soundService.error?.();
      addLog(`💀 AI ${PIECES[moverPiece]} → Sizin Taşınızı Yedi!`);
      if(tp===curPlayerColor+'K'){endGame(false,'💀 Kralınız Devrildi! AI Kazandı!');return;}
      
      aiCapt += 1;
      if (aiCapt >= 3) {
        aiCapt = 0;
        aiOrbs = Math.min(9, aiOrbs + 1);
        soundService.levelUp?.();
        addLog(`⚡ AI 3 taş yedi ve +1 Orb kazandı! (AI: ${aiOrbs}⚡)`);
      }
      setAiCaptureProgress(aiCapt);
      setAiEnergyOrbs(aiOrbs);
    }
    else if(moverPiece[1]==='K'&&Math.abs(fromC-toC)===2) addLog('🏰 AI Rok Yaptı!');
    setBoard(newBoard);

    // Unfreeze tick for Player pieces
    setFrozenPieces(prev => {
      const next = {};
      for (const [k, turns] of Object.entries(prev)) {
        const [pr, pc] = k.split('-').map(Number);
        const p = newBoard[pr]?.[pc];
        if (p && p[0] === curPlayerColor) {
          if (turns - 1 > 0) next[k] = turns - 1;
          else addLog(`❄️ ${curPlayerColor==='w'?'Beyaz':'Siyah'} ${PIECES[p]} buzları eridi!`);
        } else if (p && p[0] === curAiColor) {
          next[k] = turns;
        }
      }
      return next;
    });

    const ok=afterMoveChecks(newBoard,curAiColor,newMR,cRights);if(!ok) return;
    if(isInCheck(curPlayerColor,newBoard)){addLog('⚠️ Şah çekildi.');}
    setPlayerTurn(curPlayerColor);
  };

  const consumeOrb=(cost)=>{setEnergyOrbs(o=>Math.max(0,o-cost));setActiveSpell(null);setSelectedPos(null);setValidMoves([]);};

  const handleSpellButton=(spellId)=>{
    if(spellId==='ADD_TIME'){
      if(energyOrbs<1) return;
      clearTimer();
      const nt=Math.min(turnTimeLeft+10,TURN_TIME+10),nto=Math.min(totalTimeLeft+10,TOTAL_TIME);
      setTurnTimeLeft(nt);setTotalTimeLeft(nto);
      timerRef.current=setInterval(()=>{
        setTurnTimeLeft(p=>{if(p<=1){clearTimer();return 0;}return p-1;});
        setTotalTimeLeft(p=>{if(p<=1){clearTimer();return 0;}return p-1;});
      },1000);
      soundService.spellCast?.();addLog(`⏱️ +10sn eklendi!`);setEnergyOrbs(o=>Math.max(0,o-1));return;
    }
    if(spellId==='RULE_CHANGE'){setShowRuleModal(true);return;}
    setActiveSpell(activeSpell===spellId?null:spellId);
  };

  const handleApplySpell=(r,c,key)=>{
    const piece=board[r][c];
    if(activeSpell==='TELEPORT'){
      if(!piece&&selectedPos){
        const[sr,sc]=selectedPos,p=board[sr][sc];
        if(!p?.startsWith(playerColor)){setActiveSpell(null);return;}
        if(p[1]==='K'){
          soundService.error?.();
          addLog('⚠️ Şah ışınlanamaz! Yalnızca diğer taşlar ışınlanabilir.');
          setActiveSpell(null);
          return;
        }
        const sk=`${sr}-${sc}`,tk=`${r}-${c}`;
        const nb=board.map(row=>[...row]);nb[r][c]=p;nb[sr][sc]=null;
        setBoard(nb);soundService.spellCast?.();addLog(`🌀 IŞINLANMA! ${PIECES[p]} → [${r},${c}]`);
        updateRights(sr,sc,r,c,p,null);
        if(shieldedSquares.has(sk)){setShieldedSquares(prev=>{const n=new Set(prev);n.delete(sk);n.add(tk);return n;});}
        consumeOrb(2);afterMoveChecks(nb,playerColor,lastMove,castlingRights);
      }
    } else if(activeSpell==='SHIELD'){
      if(!piece){setActiveSpell(null);return;}
      if(piece[1]==='K'){
        soundService.error?.();
        addLog('⚠️ Şaha kalkan takılamaz! Şah her zaman açıkta olmalıdır.');
        setActiveSpell(null);
        return;
      }
      if(piece.startsWith(playerColor)){
        setShieldedSquares(prev=>new Set(prev).add(key));
        soundService.spellCast?.();
        addLog(`🛡️ Kalkan ${PIECES[piece]} taşına uygulandı!`);
        consumeOrb(1);
        setTurnTimeLeft(TURN_TIME); // Tam düşünme süresi ver
      } else {
        addLog('⚠️ Yalnızca kendi taşlarınıza kalkan takabilirsiniz.');
      }
    } else if(activeSpell==='ASCEND'){
      if(piece===playerColor+'P'){const nb=board.map(row=>[...row]);nb[r][c]=playerColor+'Q';setBoard(nb);soundService.levelUp?.();addLog(`♕ Piyon → Vezir (${PIECES[playerColor+'Q']})!`);consumeOrb(2);setTurnTimeLeft(TURN_TIME);}
    } else if(activeSpell==='KING_ASCEND'){
      if(piece===playerColor+'P'&&energyOrbs>=3){const nb=board.map(row=>[...row]);nb[r][c]=playerColor+'K';setBoard(nb);soundService.levelUp?.();addLog(`👑 Piyon → İkinci Kral (${PIECES[playerColor+'K']})!`);consumeOrb(3);setTurnTimeLeft(TURN_TIME);}
    } else if(activeSpell==='MIND_CONTROL'){
      if(piece===aiColor+'P'&&energyOrbs>=3){const nb=board.map(row=>[...row]);nb[r][c]=playerColor+'P';setBoard(nb);soundService.spellCast?.();addLog('🧠 Hipnoz! Rakip piyon saf değiştirdi!');consumeOrb(3);afterMoveChecks(nb,playerColor,lastMove,castlingRights);setTurnTimeLeft(TURN_TIME);}
    } else if(activeSpell==='FREEZE'){
      if(!piece){setActiveSpell(null);return;}
      if(piece[1]==='K'){
        soundService.error?.();
        addLog('⚠️ Şah dondurulamaz! Başka bir taşı hedefleyin.');
        setActiveSpell(null);
        return;
      }
      if(piece.startsWith(aiColor)){
        setFrozenPieces(prev=>({...prev,[key]:2}));
        soundService.spellCast?.();
        addLog(`❄️ ${PIECES[piece]} 2 tur donduruldu!`);
        consumeOrb(1);
        setTurnTimeLeft(TURN_TIME);
      } else {
        addLog('⚠️ Yalnızca rakip taşları dondurabilirsiniz (Şah hariç).');
      }
    }
    setActiveSpell(null);
  };

  const applyRuleChange=(rule)=>{
    setActiveRules(prev=>({...prev,[rule.id]:rule.turns}));
    setShowRuleModal(false);soundService.spellCast?.();setEnergyOrbs(o=>Math.max(0,o-2));
    addLog(`🔀 KURAL: ${rule.emoji} ${rule.name} (${rule.turns} tur)!`);
    setTurnTimeLeft(TURN_TIME);
  };

  const handleSquareClick=(r,c)=>{
    if(!isPlaying||gameOver||playerTurn!==playerColor||pendingPromotion) return;
    const key=`${r}-${c}`,piece=board[r][c];
    if(activeSpell){handleApplySpell(r,c,key);return;}
    if(piece&&piece.startsWith(playerColor)&&frozenPieces[key]>0){
      soundService.error?.();
      addLog(`❄️ Bu ${PIECES[piece]} taşı ${frozenPieces[key]} tur dondurulmuştur, hareket edemez!`);
      return;
    }
    if(selectedPos){
      const[sr,sc]=selectedPos;
      if(sr===r&&sc===c){setSelectedPos(null);setValidMoves([]);return;}
      if(validMoves.some(([vr,vc])=>vr===r&&vc===c)){
        commitMove(sr,sc,r,c,board,captureProgress,energyOrbs,castlingRights,lastMove);
        setSelectedPos(null);setValidMoves([]);
      } else if(piece?.startsWith(playerColor)){
        setSelectedPos([r,c]);setValidMoves(getLegalMoves(r,c,board,lastMove,castlingRights,frozenPieces,activeRules,playerColor));soundService.click?.();
      } else {setSelectedPos(null);setValidMoves([]);}
    } else if(piece?.startsWith(playerColor)){
      setSelectedPos([r,c]);setValidMoves(getLegalMoves(r,c,board,lastMove,castlingRights,frozenPieces,activeRules,playerColor));soundService.click?.();
    }
  };

  const isPlayerInCheck=isInCheck(playerColor,board);
  const isAiInCheck=isInCheck(aiColor,board);
  const playerKingPos=findKing(playerColor,board);
  const playerKingKey=playerKingPos?`${playerKingPos[0]}-${playerKingPos[1]}`:'';

  const turnPct=turnTimeLeft/TURN_TIME,totalPct=totalTimeLeft/TOTAL_TIME;
  const turnColor=turnPct>0.5?'#10b981':turnPct>0.25?'#f59e0b':'#ef4444';
  const totalColor=totalPct>0.5?'#10b981':totalPct>0.3?'#f59e0b':'#ef4444';

  // Board display perspective: when player is Black, flip rows and columns
  const displayRows=playerColor==='b'?[7,6,5,4,3,2,1,0]:[0,1,2,3,4,5,6,7];
  const displayCols=playerColor==='b'?[7,6,5,4,3,2,1,0]:[0,1,2,3,4,5,6,7];

  return(
    <div className="glass-card game-container anim-pop" style={{maxWidth:'1050px',margin:'0 auto'}}>
      <div style={{marginBottom:'1rem',textAlign:'center'}}>
        <div className="badge badge-gold" style={{marginBottom:'0.4rem'}}><Crown size={13} fill="#fbbf24"/> Kuantum Büyülü Satranç</div>
        <h2 style={{fontSize:'1.8rem',color:'var(--accent-light)',margin:0}}>Kuantum Satranç</h2>
        <p style={{fontSize:'0.8rem',color:'var(--text-muted)',margin:'0.3rem 0 0'}}>
          Kura ile Renk Belirleme · <strong>Her Zaman Siyah Başlar!</strong> · Yüksek Kontrastlı Tahta
        </p>
      </div>

      {isPlaying&&isPlayerInCheck&&(
        <div style={{
          background: 'rgba(239, 68, 68, 0.18)',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          color: '#f87171',
          padding: '0.45rem 0.8rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '0.8rem',
          fontWeight: '700',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          justifyContent: 'center'
        }}>
          <AlertTriangle size={16} /> ⚠️ Şah çekildi! Şahınızı koruyun veya güvenli bir kareye kaçın.
        </div>
      )}

      {isPlaying?(
        <div style={{display:'flex',gap:'1.2rem',alignItems:'flex-start',flexWrap:'wrap',justifyContent:'center'}}>

          {/* SOL: Süre + Günlük */}
          <div style={{flex:'1 1 220px',maxWidth:'260px',display:'flex',flexDirection:'column',gap:'0.8rem'}}>
            <div style={{background:'rgba(0,0,0,0.35)',padding:'0.75rem',borderRadius:'var(--radius-lg)',border:`1.5px solid ${playerTurn===playerColor?turnColor:'rgba(255,255,255,0.1)'}`,transition:'border-color 0.4s'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.35rem'}}>
                <span style={{fontSize:'0.72rem',color:'var(--text-muted)',fontWeight:'700'}}>⏱ TUR SÜRESİ</span>
                <span style={{fontSize:'1.2rem',fontWeight:'900',color:turnColor}}>{turnTimeLeft}sn</span>
              </div>
              <div style={{height:'6px',background:'rgba(255,255,255,0.1)',borderRadius:'3px',overflow:'hidden'}}>
                <div style={{height:'100%',width:playerTurn===playerColor?`${turnPct*100}%`:'0%',background:turnColor,borderRadius:'3px',transition:'width 0.85s linear',boxShadow:`0 0 6px ${turnColor}`}}/>
              </div>
            </div>

            <div style={{background:'rgba(0,0,0,0.35)',padding:'0.75rem',borderRadius:'var(--radius-lg)',border:`1.5px solid ${totalTimeLeft<30?'#ef4444':'rgba(255,255,255,0.1)'}`,transition:'border-color 0.4s'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.35rem'}}>
                <span style={{fontSize:'0.72rem',color:'var(--text-muted)',fontWeight:'700'}}>⌛ TOPLAM BÜTÇE</span>
                <span style={{fontSize:'1.2rem',fontWeight:'900',color:totalColor}}>{fmt(totalTimeLeft)}</span>
              </div>
              <div style={{height:'6px',background:'rgba(255,255,255,0.1)',borderRadius:'3px',overflow:'hidden'}}>
                <div style={{height:'100%',width:`${totalPct*100}%`,background:totalColor,borderRadius:'3px',transition:'width 1s linear',boxShadow:`0 0 6px ${totalColor}`}}/>
              </div>
            </div>

            <div style={{background:'rgba(0,0,0,0.2)',padding:'0.8rem',borderRadius:'var(--radius-lg)',flexGrow:1,minHeight:'180px'}}>
              <strong style={{color:'var(--text-primary)',display:'flex',alignItems:'center',gap:'0.4rem',marginBottom:'0.6rem',fontSize:'0.85rem'}}>
                <Clock size={14}/> Savaş Günlüğü
              </strong>
              <div style={{display:'flex',flexDirection:'column',gap:'4px',fontSize:'0.75rem',color:'var(--text-muted)'}}>
                {battleLogs.map((log,i)=>(<div key={i} style={{opacity:1-i*0.13}}>{log}</div>))}
              </div>
            </div>
          </div>

          {/* ORTA: Tahta */}
          <div style={{flex:'0 0 auto',width:'100%',maxWidth:'460px'}}>
            
            {/* Renk ve Sıra Bilgilendirme Çubuğu */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.45rem 0.85rem',
              background: 'rgba(15, 23, 42, 0.7)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '0.55rem',
              fontSize: '0.8rem'
            }}>
              <span style={{color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem'}}>
                Taşınız: 
                <strong style={{
                  color: playerColor === 'w' ? '#fbbf24' : '#f5f5f4',
                  background: playerColor === 'w' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255, 255, 255, 0.12)',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  border: `1px solid ${playerColor === 'w' ? 'rgba(251, 191, 36, 0.4)' : 'rgba(255, 255, 255, 0.2)'}`
                }}>
                  {playerColor === 'w' ? '⚪ Beyaz (♔)' : '⚫ Siyah (♚)'}
                </strong>
              </span>
              <span style={{
                fontWeight: '800',
                color: playerTurn === playerColor ? '#16a34a' : '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                {playerTurn === playerColor ? '⚡ Sıra Sizde' : '⏳ AI Hamle Yapıyor...'}
              </span>
            </div>

            {/* YÜKSEK KONTRASTLI KLASİK CEVİZ & KREM SATRANÇ TAHTASI (MAVİ YOK) */}
            <div style={{
              display:'grid',
              gridTemplateColumns:'repeat(8,1fr)',
              gap:'2px',
              background:'#292524',
              padding:'8px',
              borderRadius:'var(--radius-lg)',
              border:isPlayerInCheck?'2px solid rgba(239,68,68,0.9)':'2px solid #57534e',
              marginBottom:'0.7rem',
              boxShadow:isPlayerInCheck?'0 0 20px rgba(239,68,68,0.4)':'0 12px 35px rgba(0,0,0,0.6)',
              transition:'border-color 0.3s'
            }}>
              {displayRows.map(r => displayCols.map(c => {
                const cell = board[r][c];
                const ck=`${r}-${c}`;
                // True chess square parity: (r + c) % 2 === 1 is dark square, 0 is light square
                const isDark=(r+c)%2===1;
                const isSel=selectedPos?.[0]===r&&selectedPos?.[1]===c;
                const isTarget=validMoves.some(([vr,vc])=>vr===r&&vc===c);
                const isShielded=Boolean(cell && shieldedSquares.has(ck));
                const isKingChk=ck===playerKingKey&&isPlayerInCheck;
                const isFrozen=Boolean(cell && frozenPieces[ck]&&frozenPieces[ck]>0);
                const isLast=lastMove&&((lastMove.fr===r&&lastMove.fc===c)||(lastMove.tr===r&&lastMove.tc===c));

                // Yüksek Kontrastlı Klasik Ahşap Paleti (Ceviz & Krem - MAVİ KESİNLİKLE YOK)
                let bg = isDark ? '#b58863' : '#f0d9b5';
                if(isKingChk) bg='#ef4444';
                else if(isFrozen) bg='rgba(255, 255, 255, 0.85)';
                else if(isSel) bg='#f59e0b';
                else if(isLast) bg=isDark ? '#9a6b47' : '#fde68a';

                // Taşlar için net okunabilir gölge ve kontur
                const isPieceWhite = cell && cell.startsWith('w');
                const pieceColor = isPieceWhite ? '#ffffff' : '#171717';
                const pieceShadow = isPieceWhite
                  ? '0 2px 5px rgba(0,0,0,0.95), 0 0 2px #000, 0 0 4px #000'
                  : '0 1px 2px rgba(255,255,255,0.95), 0 0 1px #fff, 0 0 3px #ffffff';

                return(
                  <div 
                    key={ck} 
                    onClick={()=>handleSquareClick(r,c)} 
                    style={{
                      aspectRatio:'1',
                      background:bg,
                      display:'flex',
                      alignItems:'center',
                      justifyContent:'center',
                      fontSize:'2.2rem',
                      cursor:'pointer',
                      borderRadius:'3px',
                      position:'relative',
                      userSelect:'none',
                      transition:'all 0.12s',
                      boxShadow:isKingChk?'0 0 12px #ef4444':isShielded?'0 0 12px rgba(234, 88, 12, 0.85)':isFrozen?'0 0 10px rgba(255, 255, 255, 0.8)':'none',
                      border:isShielded?'2.5px solid #ea580c':isFrozen?'2.5px solid #94a3b8':isSel?'2.5px solid #b45309':isLast?'2px solid #d97706':'1px solid rgba(0,0,0,0.08)'
                    }}
                  >
                    {isTarget&&(
                      <div style={{
                        position:'absolute',
                        width:cell?'90%':'28%',
                        height:cell?'90%':'28%',
                        borderRadius:cell?'4px':'50%',
                        background:cell?'rgba(220, 38, 38, 0.3)':'#16a34a',
                        border:cell?'3.5px solid #dc2626':'none',
                        boxShadow:cell?'0 0 10px rgba(220, 38, 38, 0.8)':'0 0 8px #16a34a',
                        pointerEvents:'none',
                        zIndex:1
                      }}/>
                    )}
                    <span style={{
                      position:'relative',
                      zIndex:2,
                      color:pieceColor,
                      textShadow:pieceShadow,
                      lineHeight:1
                    }}>
                      {cell&&PIECES[cell]}
                    </span>
                    {isShielded&&<div style={{position:'absolute',top:'1px',right:'2px',fontSize:'0.65rem',zIndex:3,filter:'drop-shadow(0 0 2px #ea580c)'}} title="Kalkan Koruma">🛡️</div>}
                    {isFrozen&&<div style={{position:'absolute',top:'1px',left:'2px',fontSize:'0.65rem',zIndex:3,filter:'drop-shadow(0 0 2px #94a3b8)'}} title="Donduruldu">❄️</div>}
                  </div>
                );
              }))}
            </div>

            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.55rem 0.9rem',background:'rgba(0,0,0,0.25)',borderRadius:'var(--radius-md)',fontSize:'0.82rem',fontWeight:'700'}}>
              <span style={{color:playerTurn===playerColor?'var(--accent-light)':'var(--text-muted)'}}>{playerTurn===playerColor?`${playerColor==='w'?'⚪':'⚫'} Sıra Sizde`:'⏳ AI Düşünüyor...'}</span>
              <span style={{color:'var(--warning)'}}>🏆 {score}</span>
              <span style={{color:isPlayerInCheck?'#f87171':isAiInCheck?'#f59e0b':'var(--success)'}}>{isPlayerInCheck?'⚠️ Şah Durumu':isAiInCheck?'⚔️ Şah Çektiniz!':'✅ Güvende'}</span>
            </div>
          </div>

          {/* SAĞ: Enerji + Büyüler */}
          <div style={{flex:'1 1 220px',maxWidth:'260px',display:'flex',flexDirection:'column',gap:'0.8rem'}}>
            <div style={{background:'rgba(0,0,0,0.28)',padding:'0.75rem',borderRadius:'var(--radius-lg)',border:'1px solid var(--border-color)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.45rem'}}>
                <span style={{display:'flex',alignItems:'center',gap:'0.35rem',color:'#fbbf24',fontWeight:'800',fontSize:'0.82rem'}}><Zap size={14} fill="#fbbf24"/> Senin Enerjin [{captureProgress}/3]</span>
                <span style={{color:'var(--accent-light)',fontWeight:'900',fontSize:'0.82rem'}}>⚡ {energyOrbs} Orb</span>
              </div>
              <div style={{display:'flex',gap:'4px',height:'8px'}}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{flex:1,borderRadius:'4px',background:i<captureProgress?'linear-gradient(90deg,#fbbf24,#f59e0b)':'rgba(255,255,255,0.1)',boxShadow:i<captureProgress?'0 0 8px #fbbf24':'none',transition:'all 0.3s'}}/>
                ))}
              </div>
            </div>

            {/* AI Enerji & Orb Göstergesi */}
            <div style={{background:'rgba(0,0,0,0.25)',padding:'0.65rem 0.75rem',borderRadius:'var(--radius-lg)',border:'1px solid rgba(239,68,68,0.25)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.35rem'}}>
                <span style={{display:'flex',alignItems:'center',gap:'0.35rem',color:'#f87171',fontWeight:'800',fontSize:'0.78rem'}}>
                  <Bot size={14} color="#f87171"/> AI Enerjisi [{aiCaptureProgress}/3]
                </span>
                <span style={{color:'#f87171',fontWeight:'900',fontSize:'0.78rem'}}>
                  ⚡ {aiEnergyOrbs} Orb
                </span>
              </div>
              <div style={{display:'flex',gap:'4px',height:'6px'}}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{flex:1,borderRadius:'3px',background:i<aiCaptureProgress?'linear-gradient(90deg,#ef4444,#f59e0b)':'rgba(255,255,255,0.08)',boxShadow:i<aiCaptureProgress?'0 0 6px #ef4444':'none',transition:'all 0.3s'}}/>
                ))}
              </div>
            </div>

            <div style={{background:'rgba(0,0,0,0.15)',padding:'0.8rem',borderRadius:'var(--radius-lg)',border:'1px solid rgba(255,255,255,0.05)'}}>
              <h4 style={{fontSize:'0.85rem',color:'var(--text-muted)',marginBottom:'0.65rem',marginTop:0}}>🪄 Büyüler</h4>
              <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
                {SPELLS.map(spell=>{
                  const active=activeSpell===spell.id,can=energyOrbs>=spell.cost;
                  return(
                    <button key={spell.id} onClick={()=>can&&handleSpellButton(spell.id)} disabled={!can} style={{flex:'1 1 44%',padding:'0.5rem 0.3rem',fontSize:'0.72rem',fontWeight:'700',borderRadius:'var(--radius-md)',border:`2px solid ${active?spell.color:'rgba(255,255,255,0.12)'}`,background:active?spell.color+'28':'rgba(255,255,255,0.04)',color:can?'#fff':'var(--text-muted)',cursor:can?'pointer':'not-allowed',opacity:can?1:0.35,transition:'all 0.2s',textAlign:'center'}}>
                      {spell.label}<br/><span style={{fontSize:'0.65rem',opacity:0.8}}>({spell.cost}⚡)</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {Object.keys(activeRules).length>0&&(
              <div style={{background:'rgba(249,115,22,0.1)',padding:'0.7rem',borderRadius:'var(--radius-lg)',border:'1px solid rgba(249,115,22,0.2)'}}>
                <h4 style={{fontSize:'0.78rem',color:'#f97316',marginBottom:'0.5rem',marginTop:0}}>🔀 Aktif Kurallar</h4>
                <div style={{display:'flex',gap:'0.35rem',flexWrap:'wrap'}}>
                  {Object.entries(activeRules).map(([rid,left])=>{
                    const rule=RULE_OPTIONS.find(r=>r.id===rid);
                    return<span key={rid} style={{background:'rgba(249,115,22,0.16)',border:'1px solid #f97316',borderRadius:'20px',padding:'0.15rem 0.5rem',fontSize:'0.7rem',fontWeight:'700',color:'#f97316'}}>{rule?.emoji} {rule?.name} ({left}🔄)</span>;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      ):(
        <div style={{padding:'2rem 0',textAlign:'center'}}>
          {gameOver?(
            <div style={{marginBottom:'1.5rem'}}>
              <Award size={50} color="var(--accent-light)" style={{marginBottom:'0.5rem'}}/>
              <h3 style={{fontSize:'1.4rem',marginBottom:'0.45rem'}}>{winnerMessage}</h3>
              <p style={{fontSize:'1.1rem',color:'var(--success)',fontWeight:'700'}}>Skor: {score}</p>
            </div>
          ):(
            <p style={{fontSize:'0.9rem',color:'var(--text-muted)',marginBottom:'1.5rem',lineHeight:1.65}}>
              Beyin jimnastiği satrancı — hızlı karar, büyülü güçler!<br/>
              <strong>Rastgele Renk · Siyah İlk Başlar · Yüksek Kontrastlı Kareler!</strong>
            </p>
          )}
          <button className="btn-primary" onClick={startGame} style={{width:'100%',maxWidth:'300px',padding:'0.9rem',fontSize:'1rem'}}>
            <Play size={19}/> {gameOver?'Yeniden Oyna':'Kuantum Satranç Başlat'}
          </button>
        </div>
      )}

      {showRuleModal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:'1rem'}}>
          <div style={{background:'linear-gradient(135deg,#1e293b,#0f172a)',border:'2px solid #f97316',borderRadius:'var(--radius-lg)',padding:'1.4rem',maxWidth:'390px',width:'100%',boxShadow:'0 0 40px rgba(249,115,22,0.4)'}}>
            <h3 style={{fontSize:'1.1rem',color:'#f97316',marginBottom:'0.25rem',textAlign:'center'}}>🔀 Kural Değiştir</h3>
            <p style={{fontSize:'0.75rem',color:'var(--text-muted)',textAlign:'center',marginBottom:'0.8rem'}}>2 Orb harcanır</p>
            <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
              {RULE_OPTIONS.map(rule=>(
                <button key={rule.id} onClick={()=>applyRuleChange(rule)} style={{background:'rgba(249,115,22,0.1)',border:'1.5px solid rgba(249,115,22,0.3)',borderRadius:'var(--radius-md)',padding:'0.6rem 0.85rem',textAlign:'left',cursor:'pointer',color:'#fff',transition:'all 0.2s'}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='#f97316'} onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(249,115,22,0.3)'}>
                  <div style={{fontWeight:'800',fontSize:'0.85rem'}}>{rule.emoji} {rule.name}</div>
                  <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginTop:'0.08rem'}}>{rule.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={()=>setShowRuleModal(false)} style={{width:'100%',marginTop:'0.7rem',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'var(--radius-md)',padding:'0.4rem',color:'var(--text-muted)',cursor:'pointer',fontSize:'0.8rem'}}>İptal</button>
          </div>
        </div>
      )}

      {pendingPromotion&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:'1rem'}}>
          <div style={{background:'linear-gradient(135deg,rgba(56,189,248,0.12),rgba(99,102,241,0.12))',border:'2px solid var(--accent-light)',padding:'1.2rem',borderRadius:'var(--radius-lg)',textAlign:'center',maxWidth:'380px'}}>
            <h3 style={{fontSize:'1.1rem',marginBottom:'0.75rem',color:'var(--accent-light)'}}>🌟 PİYON TERFİİ — Taşını Seç</h3>
            <div style={{display:'flex',gap:'0.5rem',justifyContent:'center',flexWrap:'wrap'}}>
              {[['Q',`♕ ${playerColor==='w'?'Beyaz':'Siyah'} Vezir`],['R',`♖ ${playerColor==='w'?'Beyaz':'Siyah'} Kale`],['B',`♗ ${playerColor==='w'?'Beyaz':'Siyah'} Fil`],['N',`♘ ${playerColor==='w'?'Beyaz':'Siyah'} At`]].map(([t,lbl])=>(
                <button key={t} className="btn-primary" onClick={()=>handleSelectPromotion(t)} style={{fontSize:'1.05rem',padding:'0.4rem 0.75rem'}}>{lbl}</button>
              ))}
              <button className="btn-primary" onClick={()=>handleSelectPromotion('K')} disabled={energyOrbs<3} style={{fontSize:'1.05rem',padding:'0.4rem 0.75rem',background:energyOrbs>=3?'linear-gradient(135deg,#ef4444,#fbbf24)':'rgba(255,255,255,0.05)',border:'none',opacity:energyOrbs>=3?1:0.4}}>♔ 2. Kral (3⚡)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}