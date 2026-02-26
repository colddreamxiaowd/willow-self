import React, { useState, useCallback } from 'react';

const QUICK_BEHAVIORS = [
  { name: '查看手机', icon: '📱', category: 'social' },
  { name: '喝水', icon: '💧', category: 'physiological' },
  { name: '上厕所', icon: '🚽', category: 'physiological' },
  { name: '玩游戏', icon: '🎮', category: 'entertainment' },
  { name: '看视频', icon: '📺', category: 'entertainment' },
  { name: '聊天', icon: '💬', category: 'social' },
  { name: '吃零食', icon: '🍪', category: 'physiological' },
  { name: '发呆', icon: '😶', category: 'other' }
];

const CATEGORIES = {
  physiological: { label: '生理需求', color: '#4ecdc4' },
  social: { label: '社交', color: '#667eea' },
  entertainment: { label: '娱乐', color: '#f5576c' },
  work: { label: '工作', color: '#ffd93d' },
  other: { label: '其他', color: '#888' }
};

function ManualViolationRecorder({ sacredSeat, onRecordViolation, onAllowBehavior, onClose }) {
  const [behaviorName, setBehaviorName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('other');
  const [reason, setReason] = useState('');
  const [decision, setDecision] = useState(null);
  const [showDecision, setShowDecision] = useState(false);

  const handleQuickSelect = useCallback((behavior) => {
    setBehaviorName(behavior.name);
    setSelectedCategory(behavior.category);
    setShowDecision(true);
    setDecision(null);
  }, []);

  const handleCustomInput = useCallback((e) => {
    setBehaviorName(e.target.value);
    if (e.target.value.trim()) {
      setShowDecision(true);
    } else {
      setShowDecision(false);
    }
  }, []);

  const handleConfirmRecord = useCallback(() => {
    if (!behaviorName.trim()) return;

    const violationData = {
      behaviorName: behaviorName.trim(),
      category: selectedCategory,
      timestamp: new Date().toISOString(),
      reason: reason.trim() || '主动记录违规行为',
      decision: 'rejected'
    };

    onRecordViolation(sacredSeat.id, violationData);
    
    setBehaviorName('');
    setReason('');
    setDecision(null);
    setShowDecision(false);
  }, [behaviorName, selectedCategory, reason, sacredSeat, onRecordViolation]);

  const handleConfirmAllow = useCallback(() => {
    if (!behaviorName.trim()) return;

    const allowData = {
      behaviorName: behaviorName.trim(),
      category: selectedCategory,
      timestamp: new Date().toISOString(),
      reason: reason.trim() || '允许此行为'
    };

    onAllowBehavior(sacredSeat.id, allowData);
    
    setBehaviorName('');
    setReason('');
    setDecision(null);
    setShowDecision(false);
  }, [behaviorName, selectedCategory, reason, sacredSeat, onAllowBehavior]);

  const isAllowedBehavior = sacredSeat?.allowedBehaviors?.some(
    b => b.name.toLowerCase() === behaviorName.toLowerCase()
  );

  return (
    <div className="manual-violation-recorder">
      <div className="recorder-header">
        <h4>记录行为</h4>
        <button className="close-btn" onClick={onClose}>x</button>
      </div>

      <div className="recorder-intro">
        <p>
          如果你在神圣座位期间做了不符合承诺的事情，请主动记录。
          <strong>信任机制</strong>：这个系统完全依赖你的诚实。
        </p>
      </div>

      <div className="quick-behaviors">
        <h5>快速选择：</h5>
        <div className="behaviors-grid">
          {QUICK_BEHAVIORS.map(behavior => (
            <button
              key={behavior.name}
              className={`quick-behavior-btn ${behaviorName === behavior.name ? 'selected' : ''}`}
              onClick={() => handleQuickSelect(behavior)}
            >
              <span className="behavior-icon">{behavior.icon}</span>
              <span className="behavior-name">{behavior.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="custom-behavior">
        <h5>或自定义：</h5>
        <input
          type="text"
          value={behaviorName}
          onChange={handleCustomInput}
          placeholder="输入行为名称..."
          className="behavior-input"
        />
        
        {behaviorName.trim() && (
          <div className="category-selector">
            <label>行为分类：</label>
            <div className="category-options">
              {Object.entries(CATEGORIES).map(([key, value]) => (
                <button
                  key={key}
                  className={`category-btn ${selectedCategory === key ? 'selected' : ''}`}
                  style={{ '--category-color': value.color }}
                  onClick={() => setSelectedCategory(key)}
                >
                  {value.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isAllowedBehavior && (
        <div className="allowed-notice">
          <span className="notice-icon">+</span>
          <span>此行为已在白名单中，无需记录</span>
        </div>
      )}

      {showDecision && !isAllowedBehavior && (
        <div className="decision-section">
          <h5>决策：</h5>
          
          <div className="decision-options">
            <div 
              className={`decision-option reject ${decision === 'reject' ? 'selected' : ''}`}
              onClick={() => setDecision('reject')}
            >
              <div className="option-header">
                <span className="option-icon">x</span>
                <span className="option-label">记录违规</span>
              </div>
              <p className="option-desc">这是一个违规行为，记录下来</p>
            </div>
            
            <div 
              className={`decision-option allow ${decision === 'allow' ? 'selected' : ''}`}
              onClick={() => setDecision('allow')}
            >
              <div className="option-header">
                <span className="option-icon">+</span>
                <span className="option-label">允许此行为</span>
              </div>
              <p className="option-desc">将此行为加入白名单</p>
            </div>
          </div>

          <div className="reason-input">
            <label>备注（可选）：</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="记录你的想法或原因..."
              rows={2}
            />
          </div>

          <div className="action-buttons">
            {decision === 'reject' && (
              <button 
                className="confirm-btn reject-btn"
                onClick={handleConfirmRecord}
              >
                确认记录违规
              </button>
            )}
            {decision === 'allow' && (
              <button 
                className="confirm-btn allow-btn"
                onClick={handleConfirmAllow}
              >
                确认允许
              </button>
            )}
            {!decision && (
              <button 
                className="confirm-btn disabled"
                disabled
              >
                请先选择决策
              </button>
            )}
          </div>
        </div>
      )}

      <div className="trust-reminder">
        <span className="tip-icon">i</span>
        <p>
          <strong>信任机制：</strong>主动记录违规行为，有助于建立真正的自律意识。
          没有人会监督你，只有你自己知道真相。
        </p>
      </div>
    </div>
  );
}

export default ManualViolationRecorder;

// 最后更新时间: 2026-02-24 11:00
// 编辑人: Trae AI
