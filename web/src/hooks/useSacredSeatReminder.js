// web/src/hooks/useSacredSeatReminder.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSacredSeatManager } from './useSacredSeatManager';
import { 
  checkSacredSeatViolations, 
  generateViolationReminder,
  getCurrentTimeSlot,
  VIOLATION_CHECK_INTERVAL
} from '../utils/sacredSeatViolationDetection';

export function useSacredSeatReminder(checkInRecords = []) {
  const { activeSeats, recordViolation } = useSacredSeatManager();
  const [currentViolations, setCurrentViolations] = useState([]);
  const [lastReminderTimes, setLastReminderTimes] = useState(() => {
    try {
      const saved = localStorage.getItem('sacred_seat_reminder_times');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [reminderCooldown, setReminderCooldown] = useState(30); // minutes
  const checkIntervalRef = useRef(null);

  const saveReminderTimes = useCallback((times) => {
    try {
      localStorage.setItem('sacred_seat_reminder_times', JSON.stringify(times));
      setLastReminderTimes(times);
    } catch (error) {
      console.error('保存提醒时间失败:', error);
    }
  }, []);

  const checkViolations = useCallback(() => {
    const violations = checkSacredSeatViolations(activeSeats, checkInRecords, {
      currentTime: new Date(),
      gracePeriodMinutes: 15
    });

    const now = Date.now();
    const filteredViolations = violations.filter(violation => {
      const lastTime = lastReminderTimes[violation.seat.id];
      if (!lastTime) return true;
      
      const minutesSinceLastReminder = (now - new Date(lastTime).getTime()) / (1000 * 60);
      return minutesSinceLastReminder >= reminderCooldown;
    });

    setCurrentViolations(filteredViolations);
    return filteredViolations;
  }, [activeSeats, checkInRecords, lastReminderTimes, reminderCooldown]);

  const dismissViolation = useCallback((seatId) => {
    setCurrentViolations(prev => prev.filter(v => v.seat.id !== seatId));
    
    const newTimes = {
      ...lastReminderTimes,
      [seatId]: new Date().toISOString()
    };
    saveReminderTimes(newTimes);
  }, [lastReminderTimes, saveReminderTimes]);

  const handleViolationAction = useCallback((seatId, action) => {
    const violation = currentViolations.find(v => v.seat.id === seatId);
    if (!violation) return;

    switch (action) {
      case 'record':
        recordViolation(seatId, 'missed', '用户主动记录违约');
        dismissViolation(seatId);
        break;
      case 'dismiss':
        dismissViolation(seatId);
        break;
      case 'snooze':
        const snoozeTime = new Date(Date.now() + 30 * 60 * 1000);
        const newTimes = {
          ...lastReminderTimes,
          [seatId]: snoozeTime.toISOString()
        };
        saveReminderTimes(newTimes);
        setCurrentViolations(prev => prev.filter(v => v.seat.id !== seatId));
        break;
      default:
        dismissViolation(seatId);
    }
  }, [currentViolations, recordViolation, dismissViolation, lastReminderTimes, saveReminderTimes]);

  const getReminderForViolation = useCallback((violation) => {
    return generateViolationReminder(violation);
  }, []);

  useEffect(() => {
    checkViolations();

    checkIntervalRef.current = setInterval(() => {
      checkViolations();
    }, VIOLATION_CHECK_INTERVAL);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [checkViolations]);

  useEffect(() => {
    const handleTimeSlotChange = () => {
      checkViolations();
    };

    const checkTimeSlot = () => {
      const currentSlot = getCurrentTimeSlot();
      const storedSlot = localStorage.getItem('current_time_slot');
      
      if (storedSlot !== currentSlot) {
        localStorage.setItem('current_time_slot', currentSlot);
        handleTimeSlotChange();
      }
    };

    const timeSlotInterval = setInterval(checkTimeSlot, 60000);
    return () => clearInterval(timeSlotInterval);
  }, [checkViolations]);

  return {
    currentViolations,
    hasViolations: currentViolations.length > 0,
    violationCount: currentViolations.length,
    checkViolations,
    dismissViolation,
    handleViolationAction,
    getReminderForViolation,
    setReminderCooldown
  };
}

export default useSacredSeatReminder;

// 最后更新时间: 2026-02-23 15:00
// 编辑人: Trae AI
