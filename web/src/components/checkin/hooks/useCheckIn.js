import { useState, useCallback, useEffect } from 'react';
import { inferContextFromTime } from '../../../utils/contextInference';

const STORAGE_KEY = 'policytree_checkin_data';

const getToday = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

const getInitialData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('加载打卡数据失败:', error);
  }
  return {
    checkIns: {},
    bulkheads: [],
    policyStates: {}
  };
};

export function countDescendants(nodes, nodeId) {
  if (!nodes || !nodeId) return 0;
  
  const children = nodes.filter(n => n.data?.parentId === nodeId);
  let count = children.length;
  
  for (const child of children) {
    count += countDescendants(nodes, child.id);
  }
  
  return count;
}

export function applyCheckInLock(prevData, today, policyId, status, mode) {
  const todayData = prevData.checkIns[today] || {};
  const existingCheckIn = todayData[policyId];
  
  if (mode === 'rsip' && existingCheckIn) {
    return prevData;
  }
  
  return {
    ...prevData,
    checkIns: {
      ...prevData.checkIns,
      [today]: {
        ...todayData,
        [policyId]: {
          status,
          timestamp: new Date().toISOString(),
          previousStatus: existingCheckIn?.status
        }
      }
    }
  };
}

export function triggerBulkhead(prevData, reason, mode, days = 7, affectedPolicies = []) {
  if (mode === 'rsip') {
    return null;
  }
  
  const unfreezeDate = new Date();
  unfreezeDate.setDate(unfreezeDate.getDate() + days);
  
  const bulkhead = {
    id: `bulkhead-${Date.now()}`,
    triggeredAt: new Date().toISOString(),
    reason,
    affectedPolicies,
    frozenDays: days,
    unfreezeDate: unfreezeDate.toISOString().split('T')[0],
    status: 'frozen'
  };
  
  return {
    ...prevData,
    bulkheads: [...(prevData.bulkheads || []), bulkhead]
  };
}

export function useCheckIn(nodes, setNodes, edges = []) { // 添加 edges 参数，默认为空数组
  const [data, setData] = useState(getInitialData);
  const [showBulkheadModal, setShowBulkheadModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showFailureModal, setShowFailureModal] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const today = getToday();

  const activePolicies = nodes.filter(n => n.data.status === 'active');

  const getTodayCheckIn = useCallback((policyId) => {
    return data.checkIns[today]?.[policyId] || null;
  }, [data.checkIns, today]);

  const getPolicyStats = useCallback((policyId) => {
    const policy = nodes.find(n => n.id === policyId);
    const enhancement = policy?.data?.enhancement || 0;
    
    let consecutiveDays = 0;
    let totalDays = 0;
    let successDays = 0;
    
    const sortedDates = Object.keys(data.checkIns).sort().reverse();
    
    for (const date of sortedDates) {
      const checkIn = data.checkIns[date]?.[policyId];
      if (checkIn) {
        totalDays++;
        if (checkIn.status === 'completed') {
          successDays++;
          if (consecutiveDays === 0 || date === sortedDates[consecutiveDays]) {
            consecutiveDays++;
          }
        } else if (checkIn.status === 'failed') {
          break;
        }
      }
    }
    
    return {
      enhancement,
      consecutiveDays,
      totalDays,
      successDays,
      successRate: totalDays > 0 ? Math.round((successDays / totalDays) * 100) : 0
    };
  }, [nodes, data.checkIns]);

  const checkIn = useCallback((policyId, status, reason = null) => {
    const todayData = data.checkIns[today] || {};
    const existingCheckIn = todayData[policyId];
    
    // 推断当前情境
    const context = inferContextFromTime();
    
    setData(prev => {
      const newCheckIns = {
        ...prev.checkIns,
        [today]: {
          ...prev.checkIns[today],
          [policyId]: {
            status,
            reason,
            timestamp: new Date().toISOString(),
            previousStatus: existingCheckIn?.status,
            context: {
              inferred: context,
              confirmed: null
            }
          }
        }
      };
      
      return {
        ...prev,
        checkIns: newCheckIns
      };
    });

    if (status === 'completed') {
      setNodes(prevNodes => 
        prevNodes.map(node => {
          if (node.id === policyId) {
            return {
              ...node,
              data: {
                ...node.data,
                enhancement: (node.data.enhancement || 0) + 1
              }
            };
          }
          return node;
        })
      );
    } else if (status === 'failed') {
      setSelectedPolicy(policyId);
      setShowFailureModal(true);
    }
  }, [today, data.checkIns, setNodes]);

  // 使用 edges 查找所有子节点（与 PolicyTreeEditor 的 getAllDescendants 一致）
  const getAllDescendants = useCallback((nodeId, edgesList) => {
    const descendants = [];
    const childEdges = edgesList.filter(e => e.source === nodeId);
    
    childEdges.forEach(edge => {
      descendants.push(edge.target);
      descendants.push(...getAllDescendants(edge.target, edgesList));
    });
    
    return descendants;
  }, []);

  const handleFailureAction = useCallback((action) => {
    console.log('>>> handleFailureAction 被调用，action:', action, 'selectedPolicy:', selectedPolicy);
    if (!selectedPolicy) return;

    if (action === 'extinguish') {
      console.log('>>> 执行熄灭国策逻辑');
      setNodes(prevNodes => {
        console.log('>>> setNodes 函数式更新被调用，prevNodes 长度:', prevNodes.length);
        const nodeToExtinguish = prevNodes.find(n => n.id === selectedPolicy);
        console.log('>>> 找到的节点:', nodeToExtinguish?.data?.name);
        if (!nodeToExtinguish) return prevNodes;

        // 使用 edges 查找所有子节点
        const childIds = getAllDescendants(selectedPolicy, edges);
        const idsToExtinguish = [selectedPolicy, ...childIds];
        console.log('>>> 要熄灭的节点IDs:', idsToExtinguish);

        const newNodes = prevNodes.map(node => {
          if (idsToExtinguish.includes(node.id)) {
            return {
              ...node,
              data: {
                ...node.data,
                status: 'inactive',
                enhancement: 0
              }
            };
          }
          return node;
        });
        console.log('>>> 新节点数组已生成，长度:', newNodes.length);
        return newNodes;
      });
    } else if (action === 'release') {
      setNodes(prevNodes => 
        prevNodes.map(node => {
          if (node.id === selectedPolicy) {
            return {
              ...node,
              data: {
                ...node.data,
                enhancement: 0
              }
            };
          }
          return node;
        })
      );
    }
    
    setShowFailureModal(false);
    setSelectedPolicy(null);
  }, [selectedPolicy, setNodes, getAllDescendants, edges]);

  const triggerBulkhead = useCallback((reason, days, affectedPolicies) => {
    const unfreezeDate = new Date();
    unfreezeDate.setDate(unfreezeDate.getDate() + days);
    
    const bulkhead = {
      id: `bulkhead-${Date.now()}`,
      triggeredAt: new Date().toISOString(),
      reason,
      affectedPolicies: affectedPolicies === 'all' 
        ? activePolicies.map(p => p.id)
        : affectedPolicies,
      frozenDays: days,
      unfreezeDate: unfreezeDate.toISOString().split('T')[0],
      status: 'frozen'
    };
    
    setData(prev => ({
      ...prev,
      bulkheads: [...prev.bulkheads, bulkhead]
    }));
    
    if (affectedPolicies === 'all') {
      setNodes(prevNodes => 
        prevNodes.map(node => {
          if (node.data.status === 'active') {
            return {
              ...node,
              data: {
                ...node.data,
                frozen: true,
                frozenUntil: bulkhead.unfreezeDate
              }
            };
          }
          return node;
        })
      );
    } else {
      setNodes(prevNodes => 
        prevNodes.map(node => {
          if (affectedPolicies.includes(node.id)) {
            return {
              ...node,
              data: {
                ...node.data,
                frozen: true,
                frozenUntil: bulkhead.unfreezeDate
              }
            };
          }
          return node;
        })
      );
    }
    
    setShowBulkheadModal(false);
  }, [activePolicies, setNodes]);

  const getSmartSuggestion = useCallback((policyId) => {
    const stats = getPolicyStats(policyId);
    
    if (stats.consecutiveDays >= 3) {
      return {
        type: 'success',
        message: `连续${stats.consecutiveDays}天完成！考虑点亮下一个子国策`,
        action: 'suggest_next'
      };
    }
    
    const recentCheckIns = Object.keys(data.checkIns)
      .sort()
      .reverse()
      .slice(0, 3)
      .map(date => data.checkIns[date]?.[policyId])
      .filter(Boolean);
    
    const failedCount = recentCheckIns.filter(c => c.status === 'failed').length;
    const partialCount = recentCheckIns.filter(c => c.status === 'partial').length;
    
    if (failedCount >= 2) {
      return {
        type: 'warning',
        message: '连续失败，建议降低难度或拆分国策',
        action: 'suggest_adjust'
      };
    }
    
    if (partialCount >= 2) {
      return {
        type: 'info',
        message: '多次部分完成，考虑调整边界条件',
        action: 'suggest_edit'
      };
    }
    
    return null;
  }, [data.checkIns, getPolicyStats]);

  // 获取今日所有签到记录
  const getTodayRecords = useCallback(() => {
    const todayCheckIns = data.checkIns[today] || {};
    const records = [];
    
    Object.entries(todayCheckIns).forEach(([policyId, checkInData]) => {
      const policy = nodes.find(n => n.id === policyId);
      records.push({
        id: `${today}_${policyId}`,
        policyId,
        policyName: policy?.data?.name || '未知国策',
        timestamp: checkInData.timestamp,
        status: checkInData.status,
        executed: checkInData.status === 'completed',
        inferredContext: checkInData.context?.inferred,
        confirmedContext: checkInData.context?.confirmed
      });
    });
    
    return records.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [data.checkIns, today, nodes]);

  // 确认情境
  const confirmContext = useCallback((recordId, confirmedContext) => {
    // recordId 格式为 "date_policyId"
    const [recordDate, policyId] = recordId.split('_');
    
    setData(prev => {
      const dateCheckIns = prev.checkIns[recordDate];
      if (!dateCheckIns || !dateCheckIns[policyId]) return prev;
      
      return {
        ...prev,
        checkIns: {
          ...prev.checkIns,
          [recordDate]: {
            ...prev.checkIns[recordDate],
            [policyId]: {
              ...prev.checkIns[recordDate][policyId],
              context: {
                ...prev.checkIns[recordDate][policyId].context,
                confirmed: confirmedContext
              }
            }
          }
        }
      };
    });
  }, []);

  return {
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
    bulkheads: data.bulkheads,
    getTodayRecords,
    confirmContext
  };
}

// 最后更新时间: 2026-02-23 12:30
// 编辑人: Trae AI
