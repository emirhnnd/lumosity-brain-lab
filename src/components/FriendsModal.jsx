import React, { useState } from 'react';
import { Users, UserPlus, X, Swords, Trash2, Flame, Brain, Check } from 'lucide-react';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';

export default function FriendsModal({ userData, setUserData, onStartPvPWithFriend, onClose }) {
  const [newFriendName, setNewFriendName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👩‍🔬');

  const avatars = ['👩‍🔬', '👨‍💻', '⚡', '🛸', '🦅', '🤖', '👑', '🔥'];

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;

    soundService.success();
    const updated = storageService.addFriend(newFriendName.trim(), selectedAvatar);
    setUserData(updated);
    setNewFriendName('');
  };

  const handleRemoveFriend = (id) => {
    soundService.click();
    const updated = storageService.removeFriend(id);
    setUserData(updated);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content anim-pop" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users size={28} color="var(--accent-light)" />
            <div>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Arkadaş & Sosyal Hub</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Arkadaşlarını ekle, skorlarını kıyasla ve düelloya davet et</p>
            </div>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '0.4rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Add Friend Form */}
        <form onSubmit={handleAddFriend} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={18} color="var(--accent-light)" /> Yeni Arkadaş Ekle
          </h3>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {avatars.map(a => (
              <button
                type="button"
                key={a}
                onClick={() => setSelectedAvatar(a)}
                style={{
                  fontSize: '1.4rem',
                  padding: '0.4rem',
                  borderRadius: 'var(--radius-sm)',
                  background: selectedAvatar === a ? 'var(--accent-light)' : 'rgba(255,255,255,0.08)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {a}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder="Arkadaşının adı..."
              value={newFriendName}
              onChange={e => setNewFriendName(e.target.value)}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem'
              }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
              Ekle
            </button>
          </div>
        </form>

        {/* Friends List */}
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Arkadaşlarım ({userData.friends.length})</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {userData.friends.map(friend => (
            <div
              key={friend.id}
              className="glass-card"
              style={{
                padding: '1rem 1.25rem',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ position: 'relative', fontSize: '2rem' }}>
                  {friend.avatar}
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: friend.status === 'online' ? '#10b981' : '#64748b',
                    border: '2px solid var(--bg-card)'
                  }} />
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '1rem' }}>{friend.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '0.8rem', marginTop: '2px' }}>
                    <span>Beyin Yaşı: {friend.brainAge}</span>
                    <span>•</span>
                    <span style={{ color: 'var(--warning)', fontWeight: '700' }}>🏆 {friend.trophies} Kupa</span>
                    <span>•</span>
                    <span style={{ color: '#10b981', fontWeight: '700' }}>🔥 {friend.streak} Gün Seri</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn-primary"
                  onClick={() => onStartPvPWithFriend(friend)}
                  style={{
                    padding: '0.5rem 0.9rem',
                    fontSize: '0.8rem',
                    background: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)'
                  }}
                >
                  <Swords size={14} /> Düelloya Davet Et
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => handleRemoveFriend(friend.id)}
                  style={{ padding: '0.5rem' }}
                >
                  <Trash2 size={16} color="var(--danger)" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
