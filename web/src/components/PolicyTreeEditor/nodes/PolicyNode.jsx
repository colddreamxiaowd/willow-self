// 最后更新时间: 2026-02-26 15:45
// 编辑人: Trae AI
// 更新内容: 移除 redundant dragHandle ref 以修复 ReactFlow 拖拽行为
import React, { memo, useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { getEnhancementEffect, generateAutoPreview } from '../utils/enhancementUtils';
import { useDebouncedCallback } from '../hooks/useDebounce';
import { STEADY_STATE_COLORS, STEADY_STATE_LABELS } from '../../../utils/steadyStateAnalysis';
import ConfirmDeactivateModal from './ConfirmDeactivateModal';
import ConfirmActivateModal from './ConfirmActivateModal';
import '../styles/nodes.css';

const DIRECTION_OPTIONS = [
  { value: 'none', label: '不变', icon: '➡️' },
  { value: 'increase', label: '增加', icon: '📈' },
  { value: 'decrease', label: '减少', icon: '📉' },
  { value: 'custom', label: '自定义', icon: '✏️' }
];

const CHAIN_TYPE_OPTIONS = [
  { value: 'elite', label: '精锐链', icon: '👑', description: '状态最佳时使用，失败会崩溃' },
  { value: 'normal', label: '普通链', icon: '📋', description: '任何状态可用，失败只清零当前链' }
];

const PolicyNode = memo(function PolicyNode({ data, id, selected, dragging }) {
  const [localName, setLocalName] = useState(data.editData?.name || data.name || '');
  const [localDescription, setLocalDescription] = useState(data.editData?.description || data.description || '');
  const [localDirection, setLocalDirection] = useState(
    data.editData?.enhancementConfig?.direction ||
    data.enhancementConfig?.direction ||
    'none'
  );
  const [localBaseValue, setLocalBaseValue] = useState(
    data.editData?.enhancementConfig?.autoConfig?.baseValue ||
    data.enhancementConfig?.autoConfig?.baseValue ||
    '1'
  );
  const [localStep, setLocalStep] = useState(
    Math.abs(data.editData?.enhancementConfig?.autoConfig?.step ||
    data.enhancementConfig?.autoConfig?.step || 1)
  );
  const [localFormat, setLocalFormat] = useState(
    data.editData?.enhancementConfig?.autoConfig?.format ||
    data.enhancementConfig?.autoConfig?.format ||
    '效果{value}'
  );
  const [localCustomEffects, setLocalCustomEffects] = useState(
    data.editData?.enhancementConfig?.customEffects ||
    data.enhancementConfig?.customEffects ||
    [
      { level: 0, description: '效果描述' },
      { level: 1, description: '效果描述' },
      { level: 2, description: '效果描述' }
    ]
  );
  const [localChainType, setLocalChainType] = useState(
    data.editData?.chainType ||
    data.chainType ||
    'elite'
  );

  // 确认熄灭模态框状态
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);

  // 确认激活模态框状态
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [pendingActivateStatus, setPendingActivateStatus] = useState(null);

  useEffect(() => {
    if (data.isEditing && data.editData) {
      setLocalName(data.editData.name || '');
      setLocalDescription(data.editData.description || '');
      setLocalDirection(data.editData.enhancementConfig?.direction || 'none');
      setLocalBaseValue(data.editData.enhancementConfig?.autoConfig?.baseValue || '1');
      setLocalStep(Math.abs(data.editData.enhancementConfig?.autoConfig?.step || 1));
      setLocalFormat(data.editData.enhancementConfig?.autoConfig?.format || '效果{value}');
      setLocalCustomEffects(data.editData.enhancementConfig?.customEffects || [
        { level: 0, description: '效果描述' },
        { level: 1, description: '效果描述' },
        { level: 2, description: '效果描述' }
      ]);
      setLocalChainType(data.editData.chainType || 'elite');
    }
  }, [data.isEditing, data.editData]);

  const getStatusClass = () => {
    switch (data.status) {
      case 'active': return 'active';
      case 'extinguished': return 'extinguished';
      default: return 'inactive';
    }
  };

  const debouncedUpdateName = useDebouncedCallback((value) => {
    if (data.updateEditData) data.updateEditData('name', value);
  }, 300);

  const debouncedUpdateDescription = useDebouncedCallback((value) => {
    if (data.updateEditData) data.updateEditData('description', value);
  }, 300);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setLocalName(value);
    debouncedUpdateName(value);
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setLocalDescription(value);
    debouncedUpdateDescription(value);
  };

  const handleDirectionChange = (direction) => {
    setLocalDirection(direction);
    updateEnhancementConfig(direction, localBaseValue, localStep, localFormat, localCustomEffects);
  };

  const handleBaseValueChange = (e) => {
    const value = e.target.value;
    setLocalBaseValue(value);
    updateEnhancementConfig(localDirection, value, localStep, localFormat, localCustomEffects);
  };

  const handleStepChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setLocalStep(value);
    updateEnhancementConfig(localDirection, localBaseValue, value, localFormat, localCustomEffects);
  };

  const handleFormatChange = (e) => {
    const value = e.target.value;
    setLocalFormat(value);
    updateEnhancementConfig(localDirection, localBaseValue, localStep, value, localCustomEffects);
  };

  const handleCustomEffectChange = (level, description) => {
    const newEffects = localCustomEffects.map(e => 
      e.level === level ? { ...e, description } : e
    );
    setLocalCustomEffects(newEffects);
    updateEnhancementConfig(localDirection, localBaseValue, localStep, localFormat, newEffects);
  };

  const updateEnhancementConfig = (direction, baseValue, step, format, customEffects) => {
    if (!data.updateEditData) return;
    
    let config;
    if (direction === 'custom') {
      config = {
        mode: 'custom',
        direction: 'custom',
        customEffects: customEffects
      };
    } else {
      const actualStep = direction === 'increase' ? step : 
                         direction === 'decrease' ? -step : 0;
      config = {
        mode: 'auto',
        direction: direction,
        autoConfig: {
          baseValue: baseValue,
          step: actualStep,
          unit: '',
          format: format
        }
      };
    }
    data.updateEditData('enhancementConfig', config);
  };

  const enhancementEffect = getEnhancementEffect(
    data.enhancementConfig,
    data.enhancement || 0
  );

  const handleClick = (e) => {
    if (e.target.closest('.edit-area')) return;
    if (data.isEditing) return;

    // 如果点击的是锁定状态的节点，显示提示
    if (!data.canActivate && data.status === 'inactive') {
      data.toast?.warning('请先点亮父国策');
      return;
    }

    // 单击切换激活/熄灭状态（直接切换，无弹窗）
    if (data.onStatusChange) {
      const newStatus = data.status === 'active' ? 'inactive' : 'active';
      // 直接切换状态，不显示确认弹窗
      data.onStatusChange(id, newStatus);
    }
  };

  // 处理确认熄灭
  const handleConfirmDeactivate = () => {
    if (pendingStatusChange && data.onStatusChange) {
      data.onStatusChange(id, pendingStatusChange);
    }
    setShowDeactivateModal(false);
    setPendingStatusChange(null);
  };

  // 处理取消熄灭
  const handleCancelDeactivate = () => {
    setShowDeactivateModal(false);
    setPendingStatusChange(null);
  };

  // 处理确认激活
  const handleConfirmActivate = () => {
    if (pendingActivateStatus && data.onStatusChange) {
      data.onStatusChange(id, pendingActivateStatus);
    }
    setShowActivateModal(false);
    setPendingActivateStatus(null);
  };

  // 处理取消激活
  const handleCancelActivate = () => {
    setShowActivateModal(false);
    setPendingActivateStatus(null);
  };

  const renderEffectPreview = () => {
    if (localDirection === 'custom') {
      return localCustomEffects.slice(0, 3).map(e => (
        <div key={e.level} className="effect-preview-item">
          Lv{e.level}: {e.description}
        </div>
      ));
    }
    
    const previewConfig = {
      mode: 'auto',
      autoConfig: {
        baseValue: localBaseValue,
        step: localDirection === 'increase' ? localStep : 
              localDirection === 'decrease' ? -localStep : 0,
        format: localFormat
      }
    };
    const preview = generateAutoPreview(previewConfig.autoConfig, 2);
    return preview.map(e => (
      <div key={e.level} className="effect-preview-item">
        Lv{e.level}: {e.description}
      </div>
    ));
  };

  if (data.isEditing) {
    return (
      <div 
        className={`policy-node editing ${getStatusClass()}`}
        data-node-id={id}
        style={{ minWidth: '280px' }}
      >
        <Handle type="target" position={Position.Top} />
        
        <div className="edit-area" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={localName}
            onChange={handleNameChange}
            className="edit-input"
            placeholder="国策名称"
            autoFocus
          />
          <textarea
            value={localDescription}
            onChange={handleDescriptionChange}
            className="edit-textarea"
            placeholder="描述"
            rows={2}
          />
          
          <div className="edit-divider" />
          
          <div className="effect-direction-section">
            <label className="edit-label">效果方向</label>
            <div className="direction-buttons">
              {DIRECTION_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`direction-btn ${localDirection === opt.value ? 'active' : ''}`}
                  onClick={() => handleDirectionChange(opt.value)}
                  title={opt.label}
                >
                  {opt.icon}
                </button>
              ))}
            </div>
          </div>
          
          {localDirection !== 'custom' && (
            <div className="auto-config-section">
              <div className="config-row">
                <label className="edit-label-small">基础值</label>
                <input
                  type="text"
                  value={localBaseValue}
                  onChange={handleBaseValueChange}
                  className="edit-input-small"
                  placeholder="基础值"
                />
              </div>
              {localDirection !== 'none' && (
                <div className="config-row">
                  <label className="edit-label-small">每级变化</label>
                  <input
                    type="number"
                    value={localStep}
                    onChange={handleStepChange}
                    className="edit-input-small"
                    min="1"
                    placeholder="变化量"
                  />
                </div>
              )}
              <div className="config-row">
                <label className="edit-label-small">格式</label>
                <input
                  type="text"
                  value={localFormat}
                  onChange={handleFormatChange}
                  className="edit-input-small"
                  placeholder="效果{value}"
                />
              </div>
            </div>
          )}
          
          {localDirection === 'custom' && (
            <div className="custom-effects-section">
              <label className="edit-label">自定义效果</label>
              {localCustomEffects.map((effect, idx) => (
                <div key={effect.level} className="custom-effect-row">
                  <span className="level-label">Lv{effect.level}</span>
                  <input
                    type="text"
                    value={effect.description}
                    onChange={(e) => handleCustomEffectChange(effect.level, e.target.value)}
                    className="edit-input-small"
                    placeholder="效果描述"
                  />
                </div>
              ))}
            </div>
          )}
          
          <div className="effect-preview">
            <label className="edit-label-small">效果预览</label>
            <div className="preview-list">
              {renderEffectPreview()}
            </div>
          </div>
          
          <div className="edit-divider" />
          
          <div className="chain-type-section">
            <label className="edit-label">链类型</label>
            <div className="chain-type-buttons">
              {CHAIN_TYPE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`chain-type-btn ${localChainType === opt.value ? 'active' : ''}`}
                  onClick={() => {
                    setLocalChainType(opt.value);
                    if (data.updateEditData) data.updateEditData('chainType', opt.value);
                  }}
                  title={opt.description}
                >
                  <span className="chain-icon">{opt.icon}</span>
                  <span className="chain-label">{opt.label}</span>
                </button>
              ))}
            </div>
            <div className="chain-type-hint">
              {CHAIN_TYPE_OPTIONS.find(o => o.value === localChainType)?.description}
            </div>
          </div>
          
          <div className="edit-actions">
            <button 
              onClick={() => data.saveEditing && data.saveEditing()} 
              className="save-btn"
            >
              保存
            </button>
            <button 
              onClick={() => data.cancelEditing && data.cancelEditing()} 
              className="cancel-btn"
            >
              取消
            </button>
          </div>
        </div>
        
        <Handle type="source" position={Position.Bottom} />
      </div>
    );
  }

  return (
    <div
      className={`policy-node ${getStatusClass()} ${selected ? 'selected' : ''} ${!data.canActivate && data.status === 'inactive' ? 'locked' : ''} ${dragging ? 'dragging' : ''}`}
      onClick={handleClick}
      data-node-id={id}
    >
      <Handle type="target" position={Position.Top} />

      {!data.canActivate && data.status === 'inactive' && (
        <div className="lock-icon">🔒</div>
      )}

      {/* 今日打卡状态指示器 */}
      {data.status === 'active' && data.todayCheckIn && (
        <div className={`checkin-indicator checkin-${data.todayCheckIn}`}>
          {data.todayCheckIn === 'completed' ? '✓' :
           data.todayCheckIn === 'partial' ? '◐' :
           data.todayCheckIn === 'failed' ? '✗' : ''}
        </div>
      )}

      {data.steadyState && (
        <div className="steady-state-indicator">
          <div
            className="steady-state-dot"
            style={{ backgroundColor: STEADY_STATE_COLORS[data.steadyState.state] }}
          />
          <div className="steady-state-tooltip">
            <div className="tooltip-header">
              <span 
                className="tooltip-state-badge"
                style={{ backgroundColor: STEADY_STATE_COLORS[data.steadyState.state] }}
              >
                {STEADY_STATE_LABELS[data.steadyState.state]}
              </span>
            </div>
            <div className="tooltip-content">
              <div className="tooltip-row">
                <span className="tooltip-label">近期执行率</span>
                <span className="tooltip-value">
                  {data.steadyState.recentRate !== undefined 
                    ? `${(data.steadyState.recentRate * 100).toFixed(0)}%` 
                    : '-'}
                </span>
              </div>
              {data.steadyState.volatility !== undefined && (
                <div className="tooltip-row">
                  <span className="tooltip-label">波动性</span>
                  <span className="tooltip-value">
                    {(data.steadyState.volatility * 100).toFixed(0)}%
                  </span>
                </div>
              )}
              {data.steadyState.confidence !== undefined && (
                <div className="tooltip-row">
                  <span className="tooltip-label">置信度</span>
                  <span className="tooltip-value">
                    {(data.steadyState.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              )}
              {data.steadyState.message && (
                <div className="tooltip-message">
                  {data.steadyState.message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="node-header">
        <span className="node-tier">T{data.tier || 0}</span>
        {data.chainType && (
          <span className={`chain-type-badge ${data.chainType}`}>
            {data.chainType === 'elite' ? '👑' : '📋'}
          </span>
        )}
      </div>
      
      <h3 className="node-name">{data.name || '未命名国策'}</h3>
      
      <div className="node-divider"></div>
      
      <p className="node-description">
        {data.description || '暂无描述'}
      </p>
      
      <div className="node-divider"></div>
      
      <div className="node-enhancement-section">
        <span className="node-enhancement-badge">+{data.enhancement || 0}</span>
        <span className="node-enhancement-effect">
          {enhancementEffect || '无强化效果'}
        </span>
      </div>
      
      <Handle type="source" position={Position.Bottom} />

      {/* 确认熄灭模态框 - 已禁用 */}
      {/* <ConfirmDeactivateModal
        isOpen={showDeactivateModal}
        onClose={handleCancelDeactivate}
        onConfirm={handleConfirmDeactivate}
        policyName={data.name || '未命名国策'}
        childCount={data.childCount || 0}
      /> */}

      {/* 确认激活模态框 - 已禁用 */}
      {/* <ConfirmActivateModal
        isOpen={showActivateModal}
        onClose={handleCancelActivate}
        onConfirm={handleConfirmActivate}
        policyName={data.name || '未命名国策'}
        parentName={data.parentName || null}
      /> */}
    </div>
  );
});

export default PolicyNode;
