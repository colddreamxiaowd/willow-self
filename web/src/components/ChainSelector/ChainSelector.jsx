import React, { useState, useCallback, useMemo } from 'react';

function ChainSelector({ policy, onSelectChain, onClose }) {
  const [selectedChainId, setSelectedChainId] = useState(null);

  const eliteChain = useMemo(() => {
    return policy?.eliteChain || {
      id: 'elite_chain_01',
      nodeCount: policy?.data?.nodeNumber || 0,
      state: 'active'
    };
  }, [policy]);

  const normalChains = useMemo(() => {
    return policy?.normalChains || [];
  }, [policy]);

  const allChains = useMemo(() => {
    return [
      { ...eliteChain, type: 'elite' },
      ...normalChains.map(c => ({ ...c, type: 'normal' }))
    ];
  }, [eliteChain, normalChains]);

  const handleSelect = useCallback((chain) => {
    setSelectedChainId(chain.id);
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedChainId) {
      const chain = allChains.find(c => c.id === selectedChainId);
      if (chain) {
        onSelectChain(chain.type, chain.id);
      }
    }
  }, [selectedChainId, allChains, onSelectChain]);

  const getChainStatus = (chain) => {
    if (chain.state === 'collapsed') return { label: '已崩溃', color: '#ff6b6b' };
    if (chain.state === 'inherited') return { label: '继承中', color: '#4ecdc4' };
    return { label: '活跃', color: '#4CAF50' };
  };

  return (
    <div className="chain-selector">
      <div className="selector-header">
        <h4>选择专注链</h4>
        <button className="close-btn" onClick={onClose}>x</button>
      </div>

      <div className="selector-intro">
        <p>
          根据当前状态选择合适的链。<strong>精锐链</strong>适合状态最佳时，
          <strong>普通链</strong>适合任何状态。
        </p>
      </div>

      <div className="policy-info">
        <span className="policy-label">当前国策:</span>
        <span className="policy-name">{policy?.data?.name || '未命名'}</span>
      </div>

      <div className="chains-list">
        <div 
          className={`chain-card elite ${selectedChainId === eliteChain.id ? 'selected' : ''} ${eliteChain.state === 'collapsed' ? 'disabled' : ''}`}
          onClick={() => eliteChain.state !== 'collapsed' && handleSelect(eliteChain)}
        >
          <div className="chain-header">
            <span className="chain-icon">皇冠</span>
            <h5>精锐链</h5>
            <span 
              className="chain-status"
              style={{ '--status-color': getChainStatus(eliteChain).color }}
            >
              {getChainStatus(eliteChain).label}
            </span>
          </div>
          
          <div className="chain-stats">
            <div className="stat-item">
              <span className="stat-label">节点数</span>
              <span className="stat-value">#{eliteChain.nodeCount || 0}</span>
            </div>
          </div>
          
          <div className="chain-usage">
            <p><strong>适用场景：</strong></p>
            <ul>
              <li>状态最佳</li>
              <li>环境友好</li>
              <li>动机强烈</li>
            </ul>
            {eliteChain.state === 'active' && (
              <p className="chain-warning">
                警告：失败将导致链崩溃
              </p>
            )}
            {eliteChain.state === 'collapsed' && (
              <p className="chain-error">
                链已崩溃，需要继承恢复
              </p>
            )}
          </div>
        </div>

        {normalChains.length > 0 && normalChains.map(chain => (
          <div 
            key={chain.id}
            className={`chain-card normal ${selectedChainId === chain.id ? 'selected' : ''}`}
            onClick={() => handleSelect(chain)}
          >
            <div className="chain-header">
              <span className="chain-icon">列表</span>
              <h5>普通链 #{chain.nodeCount || 0}</h5>
              <span 
                className="chain-status"
                style={{ '--status-color': getChainStatus(chain).color }}
              >
                {getChainStatus(chain).label}
              </span>
            </div>
            
            <div className="chain-stats">
              <div className="stat-item">
                <span className="stat-label">节点数</span>
                <span className="stat-value">#{chain.nodeCount || 0}</span>
              </div>
            </div>
            
            <div className="chain-usage">
              <p><strong>适用场景：</strong></p>
              <ul>
                <li>任何状态</li>
                <li>疲惫时</li>
                <li>碎片时间</li>
              </ul>
              <p className="chain-hint">
                提示：失败只清零当前链，不影响精锐链
              </p>
            </div>
          </div>
        ))}

        {normalChains.length === 0 && (
          <div className="no-normal-chains">
            <p>暂无普通链</p>
            <p className="hint">签到时会自动创建普通链</p>
          </div>
        )}
      </div>

      <div className="selector-actions">
        <button 
          className="confirm-btn"
          onClick={handleConfirm}
          disabled={!selectedChainId}
        >
          确认选择
        </button>
        <button 
          className="cancel-btn"
          onClick={onClose}
        >
          取消
        </button>
      </div>

      <div className="selector-tips">
        <h5>链切换规则：</h5>
        <ul>
          <li>精锐链失败会崩溃，需要储君继承</li>
          <li>普通链失败只清零当前链</li>
          <li>节点数最多的普通链成为储君</li>
          <li>精锐链崩溃时自动触发继承</li>
        </ul>
      </div>
    </div>
  );
}

export default ChainSelector;

// 最后更新时间: 2026-02-24 11:45
// 编辑人: Trae AI
