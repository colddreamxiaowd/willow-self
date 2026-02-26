import React, { useState, useEffect, useMemo, useCallback } from 'react';

function InheritanceTrigger({ policy, onConfirm, onSkip }) {
  const [bestNormalChain, setBestNormalChain] = useState(null);

  const eliteChain = useMemo(() => {
    return policy?.eliteChain || {
      id: 'elite_chain_01',
      nodeCount: 0,
      state: 'collapsed'
    };
  }, [policy]);

  const normalChains = useMemo(() => {
    return policy?.normalChains || [];
  }, [policy]);

  useEffect(() => {
    const sortedChains = [...normalChains]
      .filter(c => c.state !== 'collapsed')
      .sort((a, b) => (b.nodeCount || 0) - (a.nodeCount || 0));
    
    if (sortedChains.length > 0) {
      setBestNormalChain(sortedChains[0]);
    } else {
      setBestNormalChain(null);
    }
  }, [normalChains]);

  const handleConfirm = useCallback(() => {
    if (bestNormalChain) {
      onConfirm({
        collapsedChain: eliteChain.id,
        inheritedChain: bestNormalChain.id,
        reason: '精锐链崩塌，自动继承',
        timestamp: new Date().toISOString()
      });
    }
  }, [bestNormalChain, eliteChain, onConfirm]);

  return (
    <div className="inheritance-trigger">
      <div className="collapse-warning">
        <span className="warning-icon">警告</span>
        <h4>精锐链已崩塌</h4>
        <p>节点数: #{eliteChain.nodeCount || 0} 已清零</p>
      </div>

      {bestNormalChain ? (
        <div className="inheritance-candidate">
          <div className="candidate-header">
            <span className="candidate-icon">皇冠</span>
            <h4>储君继承</h4>
          </div>
          <p className="candidate-description">
            节点数最多的普通链将继承大位
          </p>

          <div className="candidate-info">
            <div className="info-card">
              <div className="info-label">继承链</div>
              <div className="info-value">普通链 #{bestNormalChain.nodeCount || 0}</div>
            </div>
            <div className="info-card">
              <div className="info-label">节点数</div>
              <div className="info-value">{bestNormalChain.nodeCount || 0}</div>
            </div>
          </div>

          <div className="inheritance-implication">
            <h5>继承后果：</h5>
            <ul>
              <li>普通链 #{bestNormalChain.nodeCount} 升级为精锐链</li>
              <li>原精锐链降级为普通链，节点清零</li>
              <li>避免崩塌后的摆烂倾向</li>
              <li>记录到继承历史</li>
            </ul>
          </div>

          <div className="inheritance-actions">
            <button 
              className="confirm-btn primary-btn"
              onClick={handleConfirm}
            >
              确认继承
            </button>
            <button 
              className="skip-btn"
              onClick={onSkip}
            >
              跳过（保持崩溃状态）
            </button>
          </div>
        </div>
      ) : (
        <div className="no-candidate">
          <span className="empty-icon">列表</span>
          <p>没有可用的普通链</p>
          <p className="empty-hint">
            精锐链将保持崩溃状态，直到你重新激活
          </p>
          <button 
            className="skip-btn"
            onClick={onSkip}
          >
            关闭
          </button>
        </div>
      )}

      <div className="inheritance-history">
        <h5>继承机制说明：</h5>
        <p>
          当精锐链崩溃时，系统自动寻找节点数最多的普通链作为"储君"，
          继承精锐链的位置。这样可以避免崩塌后的摆烂倾向，
          让你始终有一个可以继续的目标。
        </p>
      </div>
    </div>
  );
}

export default InheritanceTrigger;

// 最后更新时间: 2026-02-24 11:50
// 编辑人: Trae AI
