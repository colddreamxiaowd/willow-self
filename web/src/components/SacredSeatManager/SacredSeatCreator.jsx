// web/src/components/SacredSeatManager/SacredSeatCreator.js

import React, { useState, useCallback } from 'react';
import './SacredSeatManager.css';

const TRIGGER_TYPES = [
  { value: 'time', label: '时间节点', icon: '🕐', description: '特定时间段' },
  { value: 'location', label: '物理空间', icon: '📍', description: '特定地点' },
  { value: 'activity', label: '活动情境', icon: '🎯', description: '特定活动前后' }
];

const TIME_SLOTS = [
  { value: 'morning', label: '早晨 (6:00-9:00)', icon: '🌅' },
  { value: 'forenoon', label: '上午 (9:00-12:00)', icon: '☀️' },
  { value: 'noon', label: '中午 (12:00-14:00)', icon: '🍱' },
  { value: 'afternoon', label: '下午 (14:00-18:00)', icon: '🌤️' },
  { value: 'evening', label: '傍晚 (18:00-21:00)', icon: '🌆' },
  { value: 'night', label: '夜间 (21:00-24:00)', icon: '🌙' }
];

const LOCATION_PRESETS = [
  { value: 'desk', label: '书桌前', icon: '🪑' },
  { value: 'bed', label: '床上', icon: '🛏️' },
  { value: 'library', label: '图书馆', icon: '📚' },
  { value: 'cafe', label: '咖啡厅', icon: '☕' },
  { value: 'gym', label: '健身房', icon: '🏋️' },
  { value: 'custom', label: '自定义', icon: '✏️' }
];

const ACTIVITY_PRESETS = [
  { value: 'after_wake', label: '起床后', icon: '⏰' },
  { value: 'before_meal', label: '饭前', icon: '🍽️' },
  { value: 'after_meal', label: '饭后', icon: '🥢' },
  { value: 'before_sleep', label: '睡前', icon: '😴' },
  { value: 'after_work', label: '下班后', icon: '🏠' },
  { value: 'custom', label: '自定义', icon: '✏️' }
];

function SacredSeatCreator({ policies, onCreate, onCancel }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    policyId: '',
    triggerType: 'time',
    triggerValue: '',
    triggerLabel: '',
    commitment: '',
    notes: ''
  });
  const [customValue, setCustomValue] = useState('');

  const activePolicies = policies.filter(p => p.data?.status === 'active');

  const handlePolicySelect = useCallback((policyId) => {
    setFormData(prev => ({ ...prev, policyId }));
  }, []);

  const handleTriggerTypeSelect = useCallback((type) => {
    setFormData(prev => ({ 
      ...prev, 
      triggerType: type,
      triggerValue: '',
      triggerLabel: ''
    }));
  }, []);

  const handleTriggerValueSelect = useCallback((value, label) => {
    setFormData(prev => ({ 
      ...prev, 
      triggerValue: value,
      triggerLabel: label
    }));
  }, []);

  const handleCommitmentChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, commitment: e.target.value }));
  }, []);

  const handleNotesChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, notes: e.target.value }));
  }, []);

  const handleCustomValueChange = useCallback((e) => {
    setCustomValue(e.target.value);
  }, []);

  const handleConfirmCustomValue = useCallback(() => {
    if (customValue.trim()) {
      setFormData(prev => ({
        ...prev,
        triggerValue: 'custom',
        triggerLabel: customValue.trim()
      }));
    }
  }, [customValue]);

  const canProceed = useCallback(() => {
    switch (step) {
      case 1:
        return formData.policyId !== '';
      case 2:
        return formData.triggerValue !== '' && formData.triggerLabel !== '';
      case 3:
        return formData.commitment.trim().length >= 5;
      default:
        return false;
    }
  }, [step, formData]);

  const handleNext = useCallback(() => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onCreate({
        ...formData,
        createdAt: new Date().toISOString()
      });
    }
  }, [step, formData, onCreate]);

  const handleBack = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
    }
  }, [step]);

  const renderTriggerOptions = () => {
    switch (formData.triggerType) {
      case 'time':
        return (
          <div className="trigger-options">
            <h4>选择时间段</h4>
            <div className="options-grid">
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot.value}
                  className={`option-btn ${formData.triggerValue === slot.value ? 'selected' : ''}`}
                  onClick={() => handleTriggerValueSelect(slot.value, slot.label)}
                >
                  <span className="option-icon">{slot.icon}</span>
                  <span className="option-label">{slot.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'location':
        return (
          <div className="trigger-options">
            <h4>选择地点</h4>
            <div className="options-grid">
              {LOCATION_PRESETS.map(loc => (
                <button
                  key={loc.value}
                  className={`option-btn ${formData.triggerValue === loc.value ? 'selected' : ''}`}
                  onClick={() => {
                    if (loc.value === 'custom') {
                      handleTriggerValueSelect('custom', '');
                    } else {
                      handleTriggerValueSelect(loc.value, loc.label);
                    }
                  }}
                >
                  <span className="option-icon">{loc.icon}</span>
                  <span className="option-label">{loc.label}</span>
                </button>
              ))}
            </div>
            {formData.triggerValue === 'custom' && (
              <div className="custom-input-section">
                <input
                  type="text"
                  value={customValue}
                  onChange={handleCustomValueChange}
                  placeholder="输入自定义地点"
                  className="custom-input"
                />
                <button 
                  className="confirm-custom-btn"
                  onClick={handleConfirmCustomValue}
                  disabled={!customValue.trim()}
                >
                  确认
                </button>
              </div>
            )}
          </div>
        );
      case 'activity':
        return (
          <div className="trigger-options">
            <h4>选择活动情境</h4>
            <div className="options-grid">
              {ACTIVITY_PRESETS.map(act => (
                <button
                  key={act.value}
                  className={`option-btn ${formData.triggerValue === act.value ? 'selected' : ''}`}
                  onClick={() => {
                    if (act.value === 'custom') {
                      handleTriggerValueSelect('custom', '');
                    } else {
                      handleTriggerValueSelect(act.value, act.label);
                    }
                  }}
                >
                  <span className="option-icon">{act.icon}</span>
                  <span className="option-label">{act.label}</span>
                </button>
              ))}
            </div>
            {formData.triggerValue === 'custom' && (
              <div className="custom-input-section">
                <input
                  type="text"
                  value={customValue}
                  onChange={handleCustomValueChange}
                  placeholder="输入自定义活动情境"
                  className="custom-input"
                />
                <button 
                  className="confirm-custom-btn"
                  onClick={handleConfirmCustomValue}
                  disabled={!customValue.trim()}
                >
                  确认
                </button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const selectedPolicy = activePolicies.find(p => p.id === formData.policyId);

  return (
    <div className="sacred-seat-creator-overlay">
      <div className="sacred-seat-creator">
        <div className="creator-header">
          <h3>创建神圣座位</h3>
          <div className="step-indicator">
            <span className={step >= 1 ? 'active' : ''}>1. 选择国策</span>
            <span className={step >= 2 ? 'active' : ''}>2. 设定条件</span>
            <span className={step >= 3 ? 'active' : ''}>3. 写下承诺</span>
          </div>
        </div>

        <div className="creator-content">
          {step === 1 && (
            <div className="step-content">
              <h4>选择要绑定的国策</h4>
              <p className="step-desc">选择一个你想要在特定条件下执行的国策</p>
              
              {activePolicies.length === 0 ? (
                <div className="no-policies">
                  <p>没有激活的国策，请先激活一个国策</p>
                </div>
              ) : (
                <div className="policies-grid">
                  {activePolicies.map(policy => (
                    <button
                      key={policy.id}
                      className={`policy-select-btn ${formData.policyId === policy.id ? 'selected' : ''}`}
                      onClick={() => handlePolicySelect(policy.id)}
                    >
                      <span className="policy-name">{policy.data?.name}</span>
                      <span className="policy-desc">{policy.data?.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h4>设定触发条件</h4>
              <p className="step-desc">
                为"<strong>{selectedPolicy?.data?.name}</strong>"设定神圣座位的触发条件
              </p>

              <div className="trigger-type-section">
                <h5>条件类型</h5>
                <div className="trigger-types">
                  {TRIGGER_TYPES.map(type => (
                    <button
                      key={type.value}
                      className={`trigger-type-btn ${formData.triggerType === type.value ? 'selected' : ''}`}
                      onClick={() => handleTriggerTypeSelect(type.value)}
                    >
                      <span className="type-icon">{type.icon}</span>
                      <span className="type-label">{type.label}</span>
                      <span className="type-desc">{type.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {renderTriggerOptions()}
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h4>写下你的承诺</h4>
              <p className="step-desc">
                在<strong>{formData.triggerLabel}</strong>时，你承诺做什么？
              </p>

              <div className="commitment-section">
                <div className="commitment-preview">
                  <span className="preview-label">神圣座位：</span>
                  <p className="preview-text">
                    当<strong>{formData.triggerLabel}</strong>时，
                    我承诺<strong className="commitment-placeholder">
                      {formData.commitment || '写下你的承诺...'}
                    </strong>
                  </p>
                </div>

                <textarea
                  value={formData.commitment}
                  onChange={handleCommitmentChange}
                  placeholder="例如：只阅读学习相关内容，不做其他事情"
                  className="commitment-input"
                  rows={3}
                />

                <div className="notes-section">
                  <label>备注（可选）</label>
                  <textarea
                    value={formData.notes}
                    onChange={handleNotesChange}
                    placeholder="添加任何补充说明..."
                    className="notes-input"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="creator-actions">
          <button 
            className="action-btn secondary" 
            onClick={step === 1 ? onCancel : handleBack}
          >
            {step === 1 ? '取消' : '上一步'}
          </button>
          <button 
            className="action-btn primary"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {step === 3 ? '创建神圣座位' : '下一步'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SacredSeatCreator;

// 最后更新时间: 2026-02-23 14:00
// 编辑人: Trae AI
