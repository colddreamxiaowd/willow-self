// web/src/hooks/useSacredSeat.js

import { useState, useCallback, useMemo } from 'react';
import { detectSacredSeat, SACRED_SEAT_STATUS, shouldPromptSacredSeat } from '../utils/sacredSeatDetection';
import { useContextTracking } from './useContextTracking';

const SACRED_SEAT_STORAGE_KEY = 'policytree_sacred_seats';

export function useSacredSeat(policyId) {
  const { records, patterns: contextPatterns } = useContextTracking(policyId);
  
  const [sacredSeats, setSacredSeats] = useState(() => {
    try {
      const saved = localStorage.getItem(SACRED_SEAT_STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        return data[policyId] || [];
      }
    } catch (error) {
      console.error('加载神圣座位数据失败:', error);
    }
    return [];
  });

  const potentialSacredSeat = useMemo(() => {
    return detectSacredSeat(records, contextPatterns);
  }, [records, contextPatterns]);

  const shouldPrompt = useMemo(() => {
    const activeSeats = sacredSeats.filter(s => s.status === SACRED_SEAT_STATUS.ACTIVE);
    return shouldPromptSacredSeat(activeSeats[0], potentialSacredSeat);
  }, [sacredSeats, potentialSacredSeat]);

  const saveSacredSeats = useCallback((seats) => {
    try {
      const saved = localStorage.getItem(SACRED_SEAT_STORAGE_KEY);
      const allData = saved ? JSON.parse(saved) : {};
      allData[policyId] = seats;
      localStorage.setItem(SACRED_SEAT_STORAGE_KEY, JSON.stringify(allData));
      setSacredSeats(seats);
    } catch (error) {
      console.error('保存神圣座位数据失败:', error);
    }
  }, [policyId]);

  const confirmSacredSeat = useCallback(() => {
    if (!potentialSacredSeat) return;

    const newSeat = {
      id: `sacred-${policyId}-${Date.now()}`,
      policyId,
      trigger: potentialSacredSeat.trigger,
      stats: potentialSacredSeat.stats,
      violations: [],
      createdAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
      status: SACRED_SEAT_STATUS.ACTIVE
    };

    saveSacredSeats([...sacredSeats, newSeat]);
    return newSeat;
  }, [policyId, potentialSacredSeat, sacredSeats, saveSacredSeats]);

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
          violations: [...seat.violations, violation]
        };
      }
      return seat;
    });

    saveSacredSeats(updatedSeats);
  }, [sacredSeats, saveSacredSeats]);

  const cancelSacredSeat = useCallback((seatId) => {
    const updatedSeats = sacredSeats.map(seat => {
      if (seat.id === seatId) {
        return {
          ...seat,
          status: SACRED_SEAT_STATUS.CANCELLED,
          cancelledAt: new Date().toISOString()
        };
      }
      return seat;
    });

    saveSacredSeats(updatedSeats);
  }, [sacredSeats, saveSacredSeats]);

  const activeSacredSeat = useMemo(() => {
    return sacredSeats.find(s => s.status === SACRED_SEAT_STATUS.ACTIVE);
  }, [sacredSeats]);

  return {
    sacredSeats,
    activeSacredSeat,
    potentialSacredSeat,
    shouldPrompt,
    confirmSacredSeat,
    recordViolation,
    cancelSacredSeat
  };
}

export default useSacredSeat;

// 最后更新时间: 2026-02-23 11:45
// 编辑人: Trae AI
