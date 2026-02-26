import React, { useState, useEffect } from 'react';
import ActivationAnimation from './ActivationAnimation';
import { playActivationSound } from '../../utils/soundEffects';
import './ActivationRitual.css';

function ActivationRitualModal({ isOpen, onClose, policy, onConfirm }) {
  const [commitment, setCommitment] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCommitment('');
      setShowAnimation(false);
      setAnimationComplete(false);
    }
  }, [isOpen]);

  const handleActivate = () => {
    setShowAnimation(true);
    // 播放激活动画音效
    playActivationSound();
    
    // 动画结束后确认激活
    setTimeout(() => {
      setAnimationComplete(true);
      onConfirm(policy.id, commitment.trim() || null);
    }, 2500);
  };

  const handleAnimationComplete = () => {
    onClose();
  };

  if (!isOpen || !policy) return null;

  return (
    <div className={`ritual-modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="ritual-modal">
        {showAnimation ? (
          <ActivationAnimation 
            policyName={policy.name}
            onComplete={handleAnimationComplete}
            complete={animationComplete}
          />
        ) : (
          <div className="ritual-content">
            <div className="ritual-header">
              <div className="ritual-icon">🔥</div>
              <h2>点亮国策</h2>
              <p className="ritual-subtitle">每一个承诺，都是改变的开始</p>
            </div>
            
            <div className="policy-preview">
              <div className="policy-tier-badge">T{policy.tier || 0}</div>
              <h3 className="policy-name">{policy.name || '未命名国策'}</h3>
              <p className="policy-description">{policy.description || '暂无描述'}</p>
            </div>
            
            <div className="commitment-section">
              <label className="commitment-label">
                <span className="label-icon">✍️</span>
                你的承诺
                <span className="optional-tag">（可选）</span>
              </label>
              <textarea
                className="commitment-input"
                placeholder="例如：我承诺每天至少投入30分钟，坚持完成这个目标..."
                value={commitment}
                onChange={(e) => setCommitment(e.target.value)}
                maxLength={200}
              />
              <div className="char-count">{commitment.length}/200</div>
            </div>
            
            <div className="ritual-warning">
              <span className="warning-icon">⚠️</span>
              <p className="warning-text">
                激活后，该国策将纳入每日打卡。如果连续失败，国策可能会被熄灭。
                请确保你准备好承担这份责任。
              </p>
            </div>
            
            <div className="ritual-actions">
              <button className="cancel-btn" onClick={onClose}>
                <span className="btn-icon">💭</span>
                再想想
              </button>
              <button className="activate-btn" onClick={handleActivate}>
                <span className="btn-icon">✨</span>
                郑重激活
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivationRitualModal;

// 最后更新时间: 2026-02-23 12:45
// 编辑人: Trae AI
