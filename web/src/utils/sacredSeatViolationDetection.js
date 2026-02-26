// web/src/utils/sacredSeatViolationDetection.js

import { SACRED_SEAT_STATUS } from '../hooks/useSacredSeatManager';

export const VIOLATION_CHECK_INTERVAL = 60000; // 1分钟检查一次

export function getCurrentTimeSlot() {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 9) return 'morning';
  if (hour >= 9 && hour < 12) return 'forenoon';
  if (hour >= 12 && hour < 14) return 'noon';
  if (hour >= 14 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 21) return 'evening';
  if (hour >= 21 && hour < 24) return 'night';
  return 'late_night';
}

export function isTimeSlotMatch(seat, currentTimeSlot) {
  if (seat.triggerType !== 'time') return false;
  return seat.triggerValue === currentTimeSlot;
}

export function shouldCheckViolation(seat, currentTimeSlot) {
  if (seat.status !== SACRED_SEAT_STATUS.ACTIVE) return false;
  return isTimeSlotMatch(seat, currentTimeSlot);
}

export function checkSacredSeatViolations(sacredSeats, checkInRecords, options = {}) {
  const {
    currentTime = new Date(),
    gracePeriodMinutes = 15
  } = options;

  const currentTimeSlot = getCurrentTimeSlot();
  const violations = [];

  sacredSeats.forEach(seat => {
    if (!shouldCheckViolation(seat, currentTimeSlot)) return;

    const today = currentTime.toDateString();
    const todayRecords = checkInRecords.filter(record => {
      const recordDate = new Date(record.timestamp).toDateString();
      return recordDate === today && record.policyId === seat.policyId;
    });

    const hasExecutedToday = todayRecords.some(record => record.executed);

    if (!hasExecutedToday) {
      const slotStartTime = getSlotStartTime(currentTimeSlot, currentTime);
      const minutesSinceSlotStart = (currentTime - slotStartTime) / (1000 * 60);

      if (minutesSinceSlotStart >= gracePeriodMinutes) {
        violations.push({
          seat,
          type: 'missed_execution',
          severity: minutesSinceSlotStart >= gracePeriodMinutes * 2 ? 'high' : 'medium',
          message: `在"${seat.triggerLabel}"时段，你承诺"${seat.commitment}"，但尚未执行`,
          suggestedAction: '立即执行或记录违约'
        });
      }
    }
  });

  return violations;
}

function getSlotStartTime(slot, currentDate) {
  const hour = currentDate.getHours();
  const minute = currentDate.getMinutes();
  
  const slotStartHours = {
    'morning': 6,
    'forenoon': 9,
    'noon': 12,
    'afternoon': 14,
    'evening': 18,
    'night': 21
  };

  const startHour = slotStartHours[slot] || 0;
  const date = new Date(currentDate);
  date.setHours(startHour, 0, 0, 0);
  
  return date;
}

export function generateViolationReminder(violation) {
  const { seat, severity } = violation;
  
  const reminders = {
    high: {
      title: '⚠️ 神圣座位违约警告',
      message: `你的神圣座位"${seat.triggerLabel}"已超过预期执行时间较久。`,
      actions: ['立即执行', '记录违约', '暂停提醒']
    },
    medium: {
      title: '⏰ 神圣座位提醒',
      message: `现在是"${seat.triggerLabel}"时段，记得执行你的承诺：${seat.commitment}`,
      actions: ['已执行', '稍后提醒', '记录违约']
    }
  };

  return reminders[severity] || reminders.medium;
}

export function getActiveReminders(sacredSeats, lastReminderTimes, cooldownMinutes = 30) {
  const currentTime = new Date();
  const currentTimeSlot = getCurrentTimeSlot();
  const reminders = [];

  sacredSeats.forEach(seat => {
    if (!shouldCheckViolation(seat, currentTimeSlot)) return;

    const lastReminder = lastReminderTimes[seat.id];
    if (lastReminder) {
      const minutesSinceLastReminder = (currentTime - new Date(lastReminder)) / (1000 * 60);
      if (minutesSinceLastReminder < cooldownMinutes) return;
    }

    reminders.push({
      seat,
      timeSlot: currentTimeSlot,
      triggeredAt: currentTime.toISOString()
    });
  });

  return reminders;
}

export function calculateViolationScore(seat) {
  const violations = seat.violations || [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const recentViolations = violations.filter(v => new Date(v.date) >= thirtyDaysAgo);
  
  if (recentViolations.length === 0) return 100;

  const weeklyViolations = violations.filter(v => {
    const violationDate = new Date(v.date);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return violationDate >= weekAgo;
  });

  const score = Math.max(0, 100 - (weeklyViolations.length * 20) - (recentViolations.length * 5));
  return score;
}

export function getViolationTrend(seat) {
  const violations = seat.violations || [];
  const now = new Date();
  
  const thisWeekViolations = violations.filter(v => {
    const date = new Date(v.date);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date >= weekAgo;
  }).length;

  const lastWeekViolations = violations.filter(v => {
    const date = new Date(v.date);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date >= twoWeeksAgo && date < weekAgo;
  }).length;

  if (thisWeekViolations > lastWeekViolations) return 'worsening';
  if (thisWeekViolations < lastWeekViolations) return 'improving';
  return 'stable';
}

// 最后更新时间: 2026-02-23 15:00
// 编辑人: Trae AI
