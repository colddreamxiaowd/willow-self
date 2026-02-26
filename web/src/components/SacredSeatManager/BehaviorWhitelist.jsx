import React, { useState, useMemo, useCallback } from 'react';

const CATEGORIES = {
  all: { label: '全部', icon: '📋', color: '#888' },
  physiological: { label: '生理需求', icon: '💧', color: '#4ecdc4' },
  social: { label: '社交', icon: '💬', color: '#667eea' },
  entertainment: { label: '娱乐', icon: '🎮', color: '#f5576c' },
  work: { label: '工作', icon: '💼', color: '#ffd93d' },
  other: { label: '其他', icon: '📝', color: '#aaa' }
};

function BehaviorWhitelist({ sacredSeat, onRemoveBehavior, onClose }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const allowedBehaviors = sacredSeat?.allowedBehaviors || [];

  const filteredBehaviors = useMemo(() => {
    let result = allowedBehaviors;
    
    if (filter !== 'all') {
      result = result.filter(b => b.category === filter);
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(b => 
        b.name.toLowerCase().includes(term) ||
        b.reason?.toLowerCase().includes(term)
      );
    }
    
    return result;
  }, [allowedBehaviors, filter, searchTerm]);

  const handleRemove = useCallback((behaviorId, behaviorName) => {
    if (window.confirm(`确定要从白名单中移除"${behaviorName}"吗？移除后该行为将重新被视为违规。`)) {
      onRemoveBehavior(sacredSeat.id, behaviorId);
    }
  }, [sacredSeat, onRemoveBehavior]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryInfo = (category) => {
    return CATEGORIES[category] || CATEGORIES.other;
  };

  return (
    <div className="behavior-whitelist">
      <div className="whitelist-header">
        <h4>行为白名单</h4>
        <span className="count-badge">
          {allowedBehaviors.length}个行为
        </span>
        <button className="close-btn" onClick={onClose}>x</button>
      </div>

      <div className="whitelist-intro">
        <p>
          白名单中的行为在神圣座位期间是被允许的。
          这些行为将不再触发"下必为例"决策。
        </p>
      </div>

      <div className="search-box">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜索行为..."
          className="search-input"
        />
      </div>

      <div className="filter-tabs">
        {Object.entries(CATEGORIES).map(([key, value]) => (
          <button
            key={key}
            className={`filter-tab ${filter === key ? 'active' : ''}`}
            style={{ '--tab-color': value.color }}
            onClick={() => setFilter(key)}
          >
            <span className="tab-icon">{value.icon}</span>
            <span className="tab-label">{value.label}</span>
          </button>
        ))}
      </div>

      {filteredBehaviors.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>
            {searchTerm || filter !== 'all' 
              ? '没有找到匹配的行为' 
              : '白名单为空'}
          </p>
          <p className="empty-hint">
            记录行为时选择"允许"可添加到白名单
          </p>
        </div>
      ) : (
        <div className="behaviors-list">
          {filteredBehaviors.map(behavior => {
            const categoryInfo = getCategoryInfo(behavior.category);
            return (
              <div key={behavior.id} className="behavior-card">
                <div className="behavior-header">
                  <span className="behavior-name">{behavior.name}</span>
                  <span 
                    className="behavior-category"
                    style={{ '--category-color': categoryInfo.color }}
                  >
                    {categoryInfo.label}
                  </span>
                </div>
                
                <div className="behavior-details">
                  <div className="detail-item">
                    <span className="detail-label">允许时间:</span>
                    <span className="detail-value">{formatDate(behavior.timestamp)}</span>
                  </div>
                  {behavior.reason && (
                    <div className="detail-item">
                      <span className="detail-label">原因:</span>
                      <span className="detail-value">{behavior.reason}</span>
                    </div>
                  )}
                </div>
                
                <button 
                  className="remove-btn"
                  onClick={() => handleRemove(behavior.id, behavior.name)}
                >
                  移除
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="whitelist-footer">
        <p className="footer-hint">
          白名单行为永久有效，直到你主动移除
        </p>
      </div>
    </div>
  );
}

export default BehaviorWhitelist;

// 最后更新时间: 2026-02-24 11:05
// 编辑人: Trae AI
