/**
 * CheckInApp - 打卡系统主组件
 *
 * 理论基础：CTDP (链式时延协议) + RSIP (递归稳态迭代协议)
 * 核心概念：通过每日打卡记录行为，建立正向反馈循环
 *
 * 灵感来源：知乎文章《自制力问题的数学物理方法》by edmond
 * 文章链接：https://www.zhihu.com/question/19888447/answer/1930799480401293785
 *
 * 核心机制：
 * - 水密舱机制 (RSIP)：打卡失败时自动隔离，防止连锁崩溃
 * - 链式触发 (CTDP)：完成一个国策后触发下一个
 * - 晚间复盘：每日结束时回顾当天表现
 * - 神圣座位：结合物理位置约束
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useCheckIn, countDescendants } from './hooks/useCheckIn';
import CheckInCard from './CheckInCard';
import BulkheadModal from './BulkheadModal';
import FailureModal from './FailureModal';
import EveningReview from '../EveningReview';
import { SacredSeatManager } from '../SacredSeatManager';
import { InheritanceTrigger } from '../ChainSelector';
import { getRuntimeMode, setRuntimeMode, RUNTIME_MODE } from '../../utils/constants';
import './CheckIn.css';

const POLICY_TREE_STORAGE_KEY = 'policytree_editor_data';

function CheckInApp({ onViewTree }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]); // 添加 edges 状态
  const [loading, setLoading] = useState(true);
  const [showEveningReview, setShowEveningReview] = useState(false);
  const [todayRecords, setTodayRecords] = useState([]);
  const [showSacredSeatManager, setShowSacredSeatManager] = useState(false);
  const [showInheritanceTrigger, setShowInheritanceTrigger] = useState(false);
  const [collapsedChainData, setCollapsedChainData] = useState(null);
  const [mode, setMode] = useState(() => getRuntimeMode());
  const [showRsipConfirm, setShowRsipConfirm] = useState(false);

  // 使用 ref 存储最新的 nodes，避免闭包问题
  const nodesRef = useRef(nodes);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    const loadData = () => {
      try {
        const saved = localStorage.getItem(POLICY_TREE_STORAGE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          if (data.nodes) {
            setNodes(data.nodes);
          }
          if (data.edges) {
            setEdges(data.edges); // 加载 edges 数据
          }
        }
      } catch (error) {
        console.error('加载国策树数据失败:', error);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const saveNodes = useCallback((newNodesOrUpdater) => {
    console.log('>>> saveNodes 被调用，参数类型:', typeof newNodesOrUpdater);
    // 支持函数式更新：如果传入的是函数，先执行函数获取最新值
    const newNodes = typeof newNodesOrUpdater === 'function'
      ? newNodesOrUpdater(nodesRef.current)
      : newNodesOrUpdater;

    console.log('>>> saveNodes 处理后的 newNodes 长度:', newNodes?.length);
    console.log('>>> saveNodes 当前 nodesRef 长度:', nodesRef.current?.length);

    // 读取现有数据，检查时间戳
    const existingData = localStorage.getItem(POLICY_TREE_STORAGE_KEY);
    let existingTimestamp = null;
    if (existingData) {
      try {
        const parsed = JSON.parse(existingData);
        existingTimestamp = parsed.timestamp;
      } catch (e) {
        console.warn('解析现有数据失败:', e);
      }
    }

    const currentTimestamp = new Date().toISOString();
    
    // 检查时间戳，如果现有数据在1秒内更新过，则跳过保存
    if (existingTimestamp) {
      const existingTime = new Date(existingTimestamp).getTime();
      const currentTime = new Date(currentTimestamp).getTime();
      const timeDiff = Math.abs(currentTime - existingTime);
      
      if (timeDiff < 1000) {
        console.log('检测到频繁保存，跳过（时间差:', timeDiff, 'ms');
        return true;
      }
    }

    setNodes(newNodes);
    try {
      const saved = localStorage.getItem(POLICY_TREE_STORAGE_KEY);
      const existingData = saved ? JSON.parse(saved) : {};
      // 保留原有的 edges 数据
      existingData.nodes = newNodes;
      existingData.version = existingData.version || '2.1';
      existingData.timestamp = currentTimestamp;
      // 确保 edges 不被覆盖
      if (!existingData.edges) {
        existingData.edges = [];
      }
      localStorage.setItem(POLICY_TREE_STORAGE_KEY, JSON.stringify(existingData));
      console.log('>>> 国策树数据已保存到 localStorage，节点数:', newNodes?.length, '边数:', existingData.edges?.length);
    } catch (error) {
      console.error('>>> 保存国策树数据失败:', error);
    }
  }, []);

  const {
    activePolicies,
    today,
    getTodayCheckIn,
    getPolicyStats,
    checkIn,
    showFailureModal,
    setShowFailureModal,
    selectedPolicy,
    handleFailureAction,
    showBulkheadModal,
    setShowBulkheadModal,
    triggerBulkhead,
    getSmartSuggestion,
    bulkheads,
    getTodayRecords,
    confirmContext
  } = useCheckIn(nodes, saveNodes, edges); // 传入 edges 参数

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  // 更新今日记录
  useEffect(() => {
    if (nodes.length > 0) {
      const records = getTodayRecords();
      setTodayRecords(records);
    }
  }, [nodes, getTodayRecords]);

  // 晚间回顾触发逻辑
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    
    // 在晚上 9 点到 11 点之间触发回顾
    if (hour >= 21 && hour < 23) {
      const lastReviewDate = localStorage.getItem('last_evening_review_date');
      const todayStr = now.toDateString();
      
      if (lastReviewDate !== todayStr && todayRecords.length > 0) {
        // 检查是否有未确认的记录
        const unconfirmedRecords = todayRecords.filter(r => !r.confirmedContext);
        if (unconfirmedRecords.length > 0) {
          setShowEveningReview(true);
        }
      }
    }
  }, [todayRecords]);

  // 处理情境确认
  const handleConfirmContext = useCallback((recordId, confirmedContext) => {
    confirmContext(recordId, confirmedContext);
    
    // 更新今日记录
    const records = getTodayRecords();
    setTodayRecords(records);
  }, [confirmContext, getTodayRecords]);

  // 关闭晚间回顾
  const handleCloseEveningReview = useCallback(() => {
    localStorage.setItem('last_evening_review_date', new Date().toDateString());
    setShowEveningReview(false);
  }, []);

  const handleInheritance = useCallback(({ collapsedChain, inheritedChain, reason }) => {
    if (!collapsedChainData) return;
    
    const updatedNodes = nodes.map(node => {
      if (node.id === collapsedChainData.policyId) {
        const currentData = node.data || {};
        const normalChains = currentData.normalChains || [];
        
        const updatedNormalChains = normalChains.map(chain => {
          if (chain.id === inheritedChain) {
            return {
              ...chain,
              type: 'elite',
              inheritedAt: new Date().toISOString(),
              inheritedFrom: collapsedChain
            };
          }
          if (chain.id === collapsedChain || chain.type === 'elite') {
            return {
              ...chain,
              type: 'normal',
              nodeCount: 0,
              collapsedAt: new Date().toISOString()
            };
          }
          return chain;
        });
        
        return {
          ...node,
          data: {
            ...currentData,
            chainType: 'elite',
            chainId: inheritedChain,
            normalChains: updatedNormalChains,
            lastInheritance: new Date().toISOString(),
            inheritanceHistory: [
              ...(currentData.inheritanceHistory || []),
              {
                timestamp: new Date().toISOString(),
                collapsedChain,
                inheritedChain,
                reason
              }
            ]
          }
        };
      }
      return node;
    });
    
    saveNodes(updatedNodes);
    setShowInheritanceTrigger(false);
    setCollapsedChainData(null);
  }, [collapsedChainData, nodes, saveNodes]);

  const triggerChainCollapse = useCallback((policyId, chainId) => {
    const policy = nodes.find(n => n.id === policyId);
    if (!policy) return;
    
    const normalChains = policy.data?.normalChains || [];
    const sortedChains = [...normalChains]
      .filter(c => c.id !== chainId && c.nodeCount > 0)
      .sort((a, b) => (b.nodeCount || 0) - (a.nodeCount || 0));
    
    if (sortedChains.length > 0) {
      setCollapsedChainData({
        policyId,
        collapsedChainId: chainId,
        candidateChain: sortedChains[0]
      });
      setShowInheritanceTrigger(true);
    }
  }, [nodes]);

  const selectedPolicyData = selectedPolicy 
    ? nodes.find(n => n.id === selectedPolicy)
    : null;

  const lossPreview = useMemo(() => {
    if (mode !== RUNTIME_MODE.RSIP || !selectedPolicy) return null;
    const descendantCount = countDescendants(nodes, selectedPolicy);
    return { nodes: descendantCount + 1, days: 1 };
  }, [mode, selectedPolicy, nodes]);

  const activeBulkheads = bulkheads.filter(b => b.status === 'frozen');

  if (loading) {
    return (
      <div className="checkin-app loading">
        <div className="loading-spinner">加载中...</div>
      </div>
    );
  }

  return (
    <div className="checkin-app">
      <header className="checkin-header">
        <h2>📅 今日状态</h2>
        <span className="date-display">{formatDate(today)}</span>
        {mode === RUNTIME_MODE.TRAINING && (
          <button 
            className="rsip-entry-btn"
            onClick={() => setShowRsipConfirm(true)}
          >
            进入RSIP（不可逆）
          </button>
        )}
        {mode === RUNTIME_MODE.RSIP && (
          <span className="mode-badge rsip">RSIP模式</span>
        )}
      </header>

      <main className="checkin-main">
        {activePolicies.length === 0 ? (
          <div className="empty-state ritual-empty">
            <div className="empty-icon pulse">🌱</div>
            <h3>还没有点亮任何国策</h3>
            <p className="empty-subtitle">每一个伟大的改变，都始于一个郑重的承诺</p>
            
            <div className="ritual-steps">
              <div className="step">
                <span className="step-num">1</span>
                <span className="step-text">前往国策树</span>
              </div>
              <div className="step-arrow">→</div>
              <div className="step">
                <span className="step-num">2</span>
                <span className="step-text">选择国策</span>
              </div>
              <div className="step-arrow">→</div>
              <div className="step">
                <span className="step-num">3</span>
                <span className="step-text">郑重激活</span>
              </div>
            </div>
            
            <button className="primary-btn ritual-btn" onClick={onViewTree}>
              <span className="btn-icon">✨</span>
              前往国策树点亮第一个国策
            </button>
            
            <p className="empty-hint">💡 提示：长按国策节点1秒可激活</p>
          </div>
        ) : (
          <>
            <section className="policies-section">
              <h3 className="section-title">
                已激活国策 
                <span className="count-badge">{activePolicies.length}个</span>
              </h3>
              
              <div className="policies-list">
                {activePolicies.map(policy => {
                  const todayCheckIn = getTodayCheckIn(policy.id);
                  const stats = getPolicyStats(policy.id);
                  const suggestion = getSmartSuggestion(policy.id);

                  return (
                    <CheckInCard
                      key={policy.id}
                      policy={policy}
                      todayCheckIn={todayCheckIn}
                      stats={stats}
                      suggestion={suggestion}
                      onCheckIn={checkIn}
                      onViewTree={onViewTree}
                      mode={mode}
                    />
                  );
                })}
              </div>
            </section>

            <section className="sacred-seat-section">
              <h3 className="section-title">神圣座位</h3>
              <p className="section-desc">
                主动设定承诺：在特定条件下只做特定的事情
              </p>
              
              <button 
                className="sacred-seat-btn"
                onClick={() => setShowSacredSeatManager(true)}
              >
                管理神圣座位
              </button>
            </section>

            {mode !== RUNTIME_MODE.RSIP && (
              <section className="bulkhead-section">
                <h3 className="section-title">🚨 水密隔舱</h3>
                <p className="section-desc">
                  遇到不可抗力？暂停结算，保护国策树
                </p>
                
                {activeBulkheads.length > 0 && (
                  <div className="active-bulkheads">
                    {activeBulkheads.map(bulkhead => (
                      <div key={bulkhead.id} className="bulkhead-card frozen">
                        <div className="bulkhead-header">
                          <span className="bulkhead-icon">🧊</span>
                          <span className="bulkhead-date">
                            {bulkhead.triggeredAt.split('T')[0]} 触发
                          </span>
                        </div>
                        <p className="bulkhead-reason">{bulkhead.reason}</p>
                        <p className="bulkhead-unfreeze">
                          解冻日期：{bulkhead.unfreezeDate}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                
                <button 
                  className="bulkhead-trigger-btn"
                  onClick={() => setShowBulkheadModal(true)}
                >
                  触发水密隔舱
                </button>
              </section>
            )}
          </>
        )}
      </main>

      <BulkheadModal
        isOpen={showBulkheadModal}
        onClose={() => setShowBulkheadModal(false)}
        onConfirm={triggerBulkhead}
        activePolicies={activePolicies}
      />

      <FailureModal
        isOpen={showFailureModal}
        onClose={() => setShowFailureModal(false)}
        policyName={selectedPolicyData?.data?.name}
        enhancement={selectedPolicyData?.data?.enhancement || 0}
        onAction={handleFailureAction}
        mode={mode}
        lossPreview={lossPreview}
      />

      <EveningReview
        records={todayRecords}
        onConfirmContext={handleConfirmContext}
        onClose={handleCloseEveningReview}
        onSkip={handleCloseEveningReview}
        isOpen={showEveningReview}
      />

      {showSacredSeatManager && (
        <div className="sacred-seat-manager-overlay">
          <SacredSeatManager 
            policies={activePolicies}
            onClose={() => setShowSacredSeatManager(false)}
          />
        </div>
      )}

      {showRsipConfirm && (
        <div className="modal-overlay">
          <div className="modal-content rsip-confirm">
            <h3>进入RSIP模式</h3>
            <p>此操作<strong>不可逆</strong>！</p>
            <ul>
              <li>水密隔舱将被禁用</li>
              <li>失败时只能选择熄灭国策</li>
              <li>签到记录当天不可修改</li>
              <li>鼓励性语言将被移除</li>
            </ul>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowRsipConfirm(false)}
              >
                取消
              </button>
              <button 
                className="danger-btn"
                onClick={() => {
                  const newMode = setRuntimeMode(RUNTIME_MODE.RSIP);
                  setMode(newMode);
                  setShowRsipConfirm(false);
                }}
              >
                确认切换
              </button>
            </div>
          </div>
        </div>
      )}

      {showInheritanceTrigger && collapsedChainData && (
        <div className="inheritance-trigger-overlay">
          <InheritanceTrigger
            policy={nodes.find(n => n.id === collapsedChainData.policyId)}
            onConfirm={handleInheritance}
            onSkip={() => {
              setShowInheritanceTrigger(false);
              setCollapsedChainData(null);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default CheckInApp;

// 最后更新时间: 2026-02-26 16:30
// 编辑人: Trae AI
// 更新内容:
//   1. 移除预约信号管理器功能
//   2. 保留储君继承触发器 (InheritanceTrigger)
//   3. 保留水密隔舱功能
