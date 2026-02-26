// web/src/hooks/useSacredSeatManager.js

import { useState, useCallback, useMemo } from 'react';

const SACRED_SEAT_STORAGE_KEY = 'policytree_sacred_seats_v2';

export const SACRED_SEAT_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  CANCELLED: 'cancelled'
};

export function useSacredSeatManager() {
  const [sacredSeats, setSacredSeats] = useState(() => {
    try {
      const saved = localStorage.getItem(SACRED_SEAT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('加载神圣座位数据失败:', error);
    }
    return [];
  });

  const saveToStorage = useCallback((seats) => {
    try {
      localStorage.setItem(SACRED_SEAT_STORAGE_KEY, JSON.stringify(seats));
      setSacredSeats(seats);
    } catch (error) {
      console.error('保存神圣座位数据失败:', error);
    }
  }, []);

  const createSacredSeat = useCallback((seatData) => {
    const newSeat = {
      id: `sacred-seat-${Date.now()}`,
      policyId: seatData.policyId,
      triggerType: seatData.triggerType,
      triggerValue: seatData.triggerValue,
      triggerLabel: seatData.triggerLabel,
      commitment: seatData.commitment,
      notes: seatData.notes || '',
      violations: [],
      status: SACRED_SEAT_STATUS.ACTIVE,
      createdAt: seatData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveToStorage([...sacredSeats, newSeat]);
    return newSeat;
  }, [sacredSeats, saveToStorage]);

  const updateSacredSeat = useCallback((seatId, updates) => {
    const updatedSeats = sacredSeats.map(seat => {
      if (seat.id === seatId) {
        return {
          ...seat,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return seat;
    });

    saveToStorage(updatedSeats);
  }, [sacredSeats, saveToStorage]);

  const deleteSacredSeat = useCallback((seatId) => {
    const updatedSeats = sacredSeats.filter(seat => seat.id !== seatId);
    saveToStorage(updatedSeats);
  }, [sacredSeats, saveToStorage]);

  const recordViolation = useCallback((seatId, reason, note = '') => {
    const violation = {
      id: `violation-${Date.now()}`,
      date: new Date().toISOString(),
      reason,
      note
    };

    const updatedSeats = sacredSeats.map(seat => {
      if (seat.id === seatId) {
        return {
          ...seat,
          violations: [...(seat.violations || []), violation],
          updatedAt: new Date().toISOString()
        };
      }
      return seat;
    });

    saveToStorage(updatedSeats);
  }, [sacredSeats, saveToStorage]);

  const getActiveSeats = useCallback(() => {
    return sacredSeats.filter(seat => seat.status === SACRED_SEAT_STATUS.ACTIVE);
  }, [sacredSeats]);

  const getSeatsByPolicy = useCallback((policyId) => {
    return sacredSeats.filter(seat => seat.policyId === policyId);
  }, [sacredSeats]);

  const getViolationHistory = useCallback(() => {
    const allViolations = [];
    sacredSeats.forEach(seat => {
      if (seat.violations) {
        seat.violations.forEach(violation => {
          allViolations.push({
            ...violation,
            seatId: seat.id,
            policyId: seat.policyId,
            triggerLabel: seat.triggerLabel
          });
        });
      }
    });
    return allViolations.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [sacredSeats]);

  const getViolationStats = useCallback(() => {
    const history = getViolationHistory();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      total: history.length,
      thisWeek: history.filter(v => new Date(v.date) >= weekAgo).length,
      thisMonth: history.filter(v => new Date(v.date) >= monthAgo).length,
      byReason: history.reduce((acc, v) => {
        acc[v.reason] = (acc[v.reason] || 0) + 1;
        return acc;
      }, {})
    };
  }, [getViolationHistory]);

  const pauseSeat = useCallback((seatId) => {
    updateSacredSeat(seatId, { status: SACRED_SEAT_STATUS.PAUSED });
  }, [updateSacredSeat]);

  const resumeSeat = useCallback((seatId) => {
    updateSacredSeat(seatId, { status: SACRED_SEAT_STATUS.ACTIVE });
  }, [updateSacredSeat]);

  const allowBehavior = useCallback((seatId, behaviorData) => {
    const behavior = {
      id: `allowed-${Date.now()}`,
      name: behaviorData.behaviorName,
      category: behaviorData.category || 'other',
      timestamp: behaviorData.timestamp || new Date().toISOString(),
      reason: behaviorData.reason || ''
    };

    const updatedSeats = sacredSeats.map(seat => {
      if (seat.id === seatId) {
        return {
          ...seat,
          allowedBehaviors: [...(seat.allowedBehaviors || []), behavior],
          updatedAt: new Date().toISOString()
        };
      }
      return seat;
    });

    saveToStorage(updatedSeats);
  }, [sacredSeats, saveToStorage]);

  const removeAllowedBehavior = useCallback((seatId, behaviorId) => {
    const updatedSeats = sacredSeats.map(seat => {
      if (seat.id === seatId) {
        return {
          ...seat,
          allowedBehaviors: (seat.allowedBehaviors || []).filter(b => b.id !== behaviorId),
          updatedAt: new Date().toISOString()
        };
      }
      return seat;
    });

    saveToStorage(updatedSeats);
  }, [sacredSeats, saveToStorage]);

  const activeSeats = useMemo(() => getActiveSeats(), [getActiveSeats]);
  const violationHistory = useMemo(() => getViolationHistory(), [getViolationHistory]);
  const violationStats = useMemo(() => getViolationStats(), [getViolationStats]);

  return {
    sacredSeats,
    activeSeats,
    violationHistory,
    violationStats,
    createSacredSeat,
    updateSacredSeat,
    deleteSacredSeat,
    recordViolation,
    getActiveSeats,
    getSeatsByPolicy,
    getViolationHistory,
    getViolationStats,
    pauseSeat,
    resumeSeat,
    allowBehavior,
    removeAllowedBehavior
  };
}

export default useSacredSeatManager;

// 最后更新时间: 2026-02-24 11:25
// 编辑人: Trae AI
// 更新内容: 添加 allowBehavior 和 removeAllowedBehavior 函数支持行为白名单
