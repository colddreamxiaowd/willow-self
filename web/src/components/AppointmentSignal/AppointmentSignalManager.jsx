import React, { useState, useCallback, useEffect, useRef } from 'react';

const POLICY_TREE_STORAGE_KEY = 'policytree_editor_data';
const BUFFER_DURATION_SECONDS = 14.5 * 60; // 14分30秒

function AppointmentSignalManager({ policy, onTaskStart, onClose }) {
  const [signalStatus, setSignalStatus] = useState('idle');
  const [bufferTimeRemaining, setBufferTimeRemaining] = useState(null);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [activeSignal, setActiveSignal] = useState(null);
  const timerRef = useRef(null);
  const bufferEndTimeRef = useRef(null);

  useEffect(() => {
    loadActiveSignal();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const loadActiveSignal = useCallback(() => {
    try {
      const saved = localStorage.getItem(POLICY_TREE_STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.appointmentSignals?.activeSignal?.status === 'buffering') {
          const signal = data.appointmentSignals.activeSignal;
          const bufferEndTime = new Date(signal.bufferEndTime);
          const now = new Date();
          
          if (bufferEndTime > now) {
            setActiveSignal(signal);
            setSignalStatus('buffering');
            startBufferTimer(bufferEndTime);
          } else {
            handleBufferExpired(signal);
          }
        }
      }
    } catch (error) {
      console.error('加载预约信号失败:', error);
    }
  }, []);

  const startBufferTimer = useCallback((bufferEndTime) => {
    bufferEndTimeRef.current = bufferEndTime;
    
    const updateTimer = () => {
      const now = new Date();
      const remaining = Math.ceil((bufferEndTime - now) / 1000);
      
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setBufferTimeRemaining(0);
        setShowFailureModal(true);
      } else {
        setBufferTimeRemaining(remaining);
      }
    };
    
    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);
  }, []);

  const handleBufferExpired = useCallback((signal) => {
    setSignalStatus('expired');
    setShowFailureModal(true);
    setActiveSignal(signal);
  }, []);

  const generateId = () => {
    return `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const triggerSignal1 = useCallback(() => {
    if (!policy) {
      console.warn('没有选中的国策');
      return;
    }
    
    const now = new Date();
    const bufferEndTime = new Date(now.getTime() + BUFFER_DURATION_SECONDS * 1000);
    
    const signal = {
      id: generateId(),
      policyId: policy.id,
      policyName: policy.data?.name || '未命名国策',
      signal1TriggeredAt: now.toISOString(),
      signal2TriggeredAt: null,
      status: 'buffering',
      bufferEndTime: bufferEndTime.toISOString()
    };
    
    try {
      const saved = localStorage.getItem(POLICY_TREE_STORAGE_KEY);
      const data = saved ? JSON.parse(saved) : {};
      
      if (!data.appointmentSignals) {
        data.appointmentSignals = {
          activeSignal: null,
          history: [],
          whitelist: []
        };
      }
      
      data.appointmentSignals.activeSignal = signal;
      data.timestamp = now.toISOString();
      localStorage.setItem(POLICY_TREE_STORAGE_KEY, JSON.stringify(data));
      
      setActiveSignal(signal);
      setSignalStatus('buffering');
      startBufferTimer(bufferEndTime);
      
      console.log('预约启动信号已触发:', signal);
    } catch (error) {
      console.error('保存预约信号失败:', error);
    }
  }, [policy, startBufferTimer]);

  const triggerSignal2 = useCallback(() => {
    if (signalStatus !== 'buffering' || !activeSignal) return;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const now = new Date();
    
    try {
      const saved = localStorage.getItem(POLICY_TREE_STORAGE_KEY);
      const data = saved ? JSON.parse(saved) : {};
      
      if (data.appointmentSignals?.activeSignal) {
        data.appointmentSignals.activeSignal.signal2TriggeredAt = now.toISOString();
        data.appointmentSignals.activeSignal.status = 'active';
        data.appointmentSignals.activeSignal.taskStartedAt = now.toISOString();
        
        data.appointmentSignals.history.unshift({
          ...data.appointmentSignals.activeSignal,
          status: 'success'
        });
        
        data.appointmentSignals.activeSignal = null;
        data.timestamp = now.toISOString();
        localStorage.setItem(POLICY_TREE_STORAGE_KEY, JSON.stringify(data));
      }
      
      setSignalStatus('active');
      setBufferTimeRemaining(null);
      
      if (onTaskStart) {
        onTaskStart({
          policyId: activeSignal.policyId,
          startTime: now.toISOString()
        });
      }
      
      console.log('即时启动信号已触发，任务开始');
    } catch (error) {
      console.error('保存即时启动信号失败:', error);
    }
  }, [signalStatus, activeSignal, onTaskStart]);

  const handleFailureDecision = useCallback((decision) => {
    const now = new Date();
    
    try {
      const saved = localStorage.getItem(POLICY_TREE_STORAGE_KEY);
      const data = saved ? JSON.parse(saved) : {};
      
      if (decision.decision === 'acknowledge') {
        if (data.appointmentSignals?.activeSignal) {
          data.appointmentSignals.history.unshift({
            ...data.appointmentSignals.activeSignal,
            status: 'failed',
            failedAt: now.toISOString(),
            failureReason: decision.reason
          });
          data.appointmentSignals.activeSignal = null;
        }
      } else if (decision.decision === 'allow') {
        if (data.appointmentSignals?.activeSignal) {
          if (!data.appointmentSignals.whitelist) {
            data.appointmentSignals.whitelist = [];
          }
          data.appointmentSignals.whitelist.push({
            id: `whitelist_${Date.now()}`,
            situation: decision.situation || '未知情况',
            allowedAt: now.toISOString(),
            reason: decision.reason,
            chainId: activeSignal?.policyId
          });
          data.appointmentSignals.history.unshift({
            ...data.appointmentSignals.activeSignal,
            status: 'whitelisted',
            whitelistedAt: now.toISOString(),
            whitelistReason: decision.reason
          });
          data.appointmentSignals.activeSignal = null;
        }
      }
      
      data.timestamp = now.toISOString();
      localStorage.setItem(POLICY_TREE_STORAGE_KEY, JSON.stringify(data));
      
      setShowFailureModal(false);
      setSignalStatus('idle');
      setActiveSignal(null);
      setBufferTimeRemaining(null);
      
    } catch (error) {
      console.error('处理失败决策失败:', error);
    }
  }, [activeSignal]);

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (bufferTimeRemaining === null) return 100;
    return (bufferTimeRemaining / BUFFER_DURATION_SECONDS) * 100;
  };

  return (
    <div className="appointment-signal-manager">
      <div className="signal-header">
        <h4>预约信号管理器</h4>
        <button className="close-btn" onClick={onClose}>x</button>
      </div>
      
      {policy && (
        <div className="policy-info">
          <span className="policy-label">当前国策:</span>
          <span className="policy-name">{policy.data?.name || '未命名'}</span>
        </div>
      )}
      
      {signalStatus === 'idle' && (
        <div className="signal-idle">
          <div className="signal-info">
            <p className="main-text">点击下方按钮触发预约启动信号</p>
            <p className="hint">触发后，14分30秒内必须执行即时启动信号</p>
          </div>
          
          <div className="signal-explanation">
            <h5>工作原理:</h5>
            <ol>
              <li><strong>预约启动信号</strong> - 打一次响指，宣告即将开始</li>
              <li><strong>缓冲期</strong> - 14分30秒内完成准备工作</li>
              <li><strong>即时启动信号</strong> - 打三次响指，正式开始任务</li>
            </ol>
          </div>
          
          <button 
            className="signal-1-btn primary-btn"
            onClick={triggerSignal1}
            disabled={!policy}
          >
            <span className="signal-icon">👆</span>
            <span className="signal-label">预约启动信号</span>
            <span className="signal-action">打一次响指宣告开始</span>
          </button>
          
          {!policy && (
            <p className="warning-text">请先选择一个国策</p>
          )}
        </div>
      )}
      
      {signalStatus === 'buffering' && (
        <div className="signal-buffering">
          <div className="buffer-timer">
            <div className="timer-circle">
              <svg viewBox="0 0 100 100">
                <circle 
                  className="timer-bg" 
                  cx="50" cy="50" r="45"
                />
                <circle 
                  className="timer-progress" 
                  cx="50" cy="50" r="45"
                  style={{
                    strokeDasharray: `${getProgressPercentage() * 2.83} 283`
                  }}
                />
              </svg>
              <div className="timer-display">
                {formatTime(bufferTimeRemaining)}
              </div>
            </div>
            <div className="timer-label">剩余时间</div>
          </div>
          
          <div className="buffer-status">
            <span className="status-icon"></span>
            <span className="status-text">等待即时启动信号...</span>
          </div>
          
          <button 
            className="signal-2-btn primary-btn pulse"
            onClick={triggerSignal2}
          >
            <span className="signal-icon">🔥</span>
            <span className="signal-label">即时启动信号</span>
            <span className="signal-action">打三次响指正式开始</span>
          </button>
          
          <p className="buffer-hint">
            根据<strong>现有条件</strong>【尽快】开始任务
          </p>
        </div>
      )}
      
      {signalStatus === 'active' && (
        <div className="signal-active">
          <div className="active-indicator">
            <span className="success-icon"></span>
            <h4>任务已启动</h4>
          </div>
          <p className="active-time">
            启动时间: {new Date().toLocaleTimeString()}
          </p>
          <button 
            className="close-btn secondary-btn"
            onClick={onClose}
          >
            关闭
          </button>
        </div>
      )}
      
      {signalStatus === 'expired' && showFailureModal && (
        <AppointmentFailureModal
          onDecision={handleFailureDecision}
          onClose={() => {
            setShowFailureModal(false);
            setSignalStatus('idle');
          }}
        />
      )}
      
      {showFailureModal && signalStatus === 'buffering' && (
        <AppointmentFailureModal
          onDecision={handleFailureDecision}
          onClose={() => setShowFailureModal(false)}
        />
      )}
    </div>
  );
}

function AppointmentFailureModal({ onDecision, onClose }) {
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [reason, setReason] = useState('');
  const [situation, setSituation] = useState('');
  
  const handleConfirm = () => {
    if (selectedDecision) {
      onDecision({
        decision: selectedDecision,
        reason: reason || (selectedDecision === 'acknowledge' ? '承认预约失败' : '允许当前情况'),
        situation: situation
      });
    }
  };
  
  return (
    <div className="appointment-failure-overlay">
      <div className="appointment-failure-modal">
        <h3>预约失败</h3>
        
        <div className="failure-info">
          <p>预约启动信号已触发，但在14分30秒内未执行即时启动信号</p>
          <p className="failure-highlight">预约链已超时</p>
        </div>
        
        <div className="decision-options">
          <div 
            className={`decision-option acknowledge ${selectedDecision === 'acknowledge' ? 'selected' : ''}`}
            onClick={() => setSelectedDecision('acknowledge')}
          >
            <div className="option-header">
              <span className="option-icon">x</span>
              <h4>承认预约链失败</h4>
            </div>
            <div className="option-details">
              <p>清空预约链的所有记录</p>
              <p>下次预约从 #1 重新开始</p>
              <p className="option-warning">高风险，倒逼重视预约</p>
            </div>
          </div>
          
          <div 
            className={`decision-option allow ${selectedDecision === 'allow' ? 'selected' : ''}`}
            onClick={() => setSelectedDecision('allow')}
          >
            <div className="option-header">
              <span className="option-icon">+</span>
              <h4>允许当前情况</h4>
            </div>
            <div className="option-details">
              <p>预约链彻底失去对该情况的约束力</p>
              <p>从此以后，该情况不再触发"下必为例"</p>
              <p>将情况加入预约白名单</p>
              <p className="option-warning">低风险，但永久失去约束</p>
            </div>
          </div>
        </div>
        
        {selectedDecision === 'allow' && (
          <div className="situation-input">
            <label>当前情况描述:</label>
            <input
              type="text"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="例如：在厕所/室外/紧急事务..."
            />
          </div>
        )}
        
        <div className="reason-input">
          <label>决策理由（可选）:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="记录你做出这个决策的原因..."
            rows={3}
          />
        </div>
        
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>取消</button>
          <button 
            className={`confirm-btn ${selectedDecision}`}
            onClick={handleConfirm}
            disabled={!selectedDecision}
          >
            确认{selectedDecision === 'acknowledge' ? '承认失败' : '允许'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentSignalManager;

// 最后更新时间: 2026-02-26 16:00
// 编辑人: Trae AI
// 更新内容: 使用图标替代数字，优化按钮显示内容
