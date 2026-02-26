import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, isToday, isAfter, parseISO, differenceInDays } from 'date-fns';

const JournalContext = createContext(null);

const JOURNAL_STORAGE_KEY = 'policytree_journal_data';
const CHECKIN_STORAGE_KEY = 'policytree_checkin_data';

const getToday = () => format(new Date(), 'yyyy-MM-dd');

const getInitialJournalData = () => {
  try {
    const saved = localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return {
        startDate: data.startDate || getToday(),
        entries: data.entries || {},
        settings: data.settings || {}
      };
    }
  } catch (error) {
    console.error('加载手账数据失败:', error);
  }
  return {
    startDate: getToday(),
    entries: {},
    settings: {}
  };
};

const getCheckInData = () => {
  try {
    const saved = localStorage.getItem(CHECKIN_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('加载打卡数据失败:', error);
  }
  return { checkIns: {} };
};

export function JournalProvider({ children }) {
  const [journalData, setJournalData] = useState(getInitialJournalData);

  useEffect(() => {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(journalData));
  }, [journalData]);

  const getEntry = useCallback((date) => {
    const dateKey = typeof date === 'string' ? date : format(date, 'yyyy-MM-dd');
    return journalData.entries[dateKey] || {
      mood: null,
      weather: null,
      reflection: '',
      images: []
    };
  }, [journalData.entries]);

  const saveEntry = useCallback((date, entry) => {
    const dateKey = typeof date === 'string' ? date : format(date, 'yyyy-MM-dd');
    setJournalData(prev => ({
      ...prev,
      entries: {
        ...prev.entries,
        [dateKey]: {
          ...prev.entries[dateKey],
          ...entry,
          updatedAt: new Date().toISOString()
        }
      }
    }));
  }, []);

  const getCheckInStatus = useCallback((date) => {
    const checkInData = getCheckInData();
    const dateKey = typeof date === 'string' ? date : format(date, 'yyyy-MM-dd');
    const dayCheckIns = checkInData.checkIns?.[dateKey] || {};
    const hasAnyCheckIn = Object.keys(dayCheckIns).length > 0;
    return hasAnyCheckIn;
  }, []);

  const getMonthCalendarData = useCallback((year, month) => {
    const start = startOfMonth(new Date(year, month));
    const end = endOfMonth(new Date(year, month));
    const days = eachDayOfInterval({ start, end });
    const startDate = parseISO(journalData.startDate);

    return days.map(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const isBeforeStart = isBefore(day, startDate);
      const isPast = isBefore(day, new Date()) && !isToday(day);
      const isFuture = isAfter(day, new Date());
      const isCheckedIn = getCheckInStatus(day);
      const entry = getEntry(day);

      let status = 'normal';
      if (!isBeforeStart && isPast && !isCheckedIn) {
        status = 'miss';
      } else if (!isBeforeStart && isCheckedIn) {
        status = 'checked';
      }

      return {
        date: day,
        dateKey,
        isBeforeStart,
        isPast,
        isFuture,
        isToday: isToday(day),
        isCheckedIn,
        status,
        hasEntry: !!entry.reflection || !!entry.mood
      };
    });
  }, [journalData.startDate, getCheckInStatus, getEntry]);

  const getStats = useCallback(() => {
    const startDate = parseISO(journalData.startDate);
    const today = new Date();
    const totalDays = differenceInDays(today, startDate) + 1;
    
    const checkInData = getCheckInData();
    let checkedDays = 0;
    
    Object.keys(checkInData.checkIns || {}).forEach(dateKey => {
      const dayCheckIns = checkInData.checkIns[dateKey];
      if (Object.keys(dayCheckIns).length > 0) {
        const checkDate = parseISO(dateKey);
        if (!isBefore(checkDate, startDate) && !isAfter(checkDate, today)) {
          checkedDays++;
        }
      }
    });

    const entries = journalData.entries;
    const entriesCount = Object.keys(entries).filter(key => {
      const entry = entries[key];
      return entry.reflection || entry.mood;
    }).length;

    const moodCounts = {};
    Object.values(entries).forEach(entry => {
      if (entry.mood) {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      }
    });

    let maxStreak = 0;
    let tempStreak = 0;
    
    for (let i = 0; i <= totalDays; i++) {
      const checkDate = format(new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
      const dayCheckIns = checkInData.checkIns?.[checkDate] || {};
      const hasCheckIn = Object.keys(dayCheckIns).length > 0;
      
      if (hasCheckIn) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    const currentStreak = calculateCurrentStreak(checkInData.checkIns, startDate, today);
    const trendData = calculateTrendData(checkInData.checkIns, startDate, today);
    const moodTrendData = calculateMoodTrendData(entries, checkInData.checkIns, startDate, today);
    const achievements = calculateAchievements(currentStreak, checkedDays, entriesCount, moodCounts);

    return {
      startDate: journalData.startDate,
      totalDays,
      checkedDays,
      checkRate: totalDays > 0 ? Math.round((checkedDays / totalDays) * 100) : 0,
      entriesCount,
      moodCounts,
      currentStreak,
      maxStreak,
      trendData,
      moodTrendData,
      achievements
    };
  }, [journalData]);

  function calculateCurrentStreak(checkIns, startDate, today) {
    let streak = 0;
    let currentDate = today;
    
    while (true) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      const dayCheckIns = checkIns?.[dateKey] || {};
      
      if (Object.keys(dayCheckIns).length > 0) {
        streak++;
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }
    
    return streak;
  }

  function calculateTrendData(checkIns, startDate, today) {
    const periods = [7, 14, 30];
    const trends = {};

    periods.forEach(days => {
      let checkedCount = 0;
      let totalCount = 0;

      for (let i = 0; i < days; i++) {
        const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const dateKey = format(checkDate, 'yyyy-MM-dd');
        
        if (!isBefore(checkDate, startDate)) {
          totalCount++;
          const dayCheckIns = checkIns?.[dateKey] || {};
          if (Object.keys(dayCheckIns).length > 0) {
            checkedCount++;
          }
        }
      }

      trends[`days${days}`] = {
        checked: checkedCount,
        total: totalCount,
        rate: totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0
      };
    });

    return trends;
  }

  function calculateMoodTrendData(entries, checkIns, startDate, today) {
    const moodScores = {
      happy: 5,
      calm: 4,
      tired: 2,
      anxious: 1,
      sad: 0
    };

    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = format(checkDate, 'yyyy-MM-dd');
      
      if (!isBefore(checkDate, startDate)) {
        const entry = entries[dateKey];
        const dayCheckIns = checkIns?.[dateKey] || {};
        const hasCheckIn = Object.keys(dayCheckIns).length > 0;
        
        last30Days.push({
          date: dateKey,
          mood: entry?.mood || null,
          moodScore: entry?.mood ? moodScores[entry.mood] : null,
          hasCheckIn
        });
      }
    }

    const moodWithCheckIn = last30Days.filter(d => d.mood && d.hasCheckIn);
    const moodWithoutCheckIn = last30Days.filter(d => d.mood && !d.hasCheckIn);

    const avgMoodWithCheckIn = moodWithCheckIn.length > 0
      ? moodWithCheckIn.reduce((sum, d) => sum + d.moodScore, 0) / moodWithCheckIn.length
      : null;

    const avgMoodWithoutCheckIn = moodWithoutCheckIn.length > 0
      ? moodWithoutCheckIn.reduce((sum, d) => sum + d.moodScore, 0) / moodWithoutCheckIn.length
      : null;

    const recent7Days = last30Days.slice(-7);
    const recent7Moods = recent7Days.filter(d => d.mood);
    const recent7Avg = recent7Moods.length > 0
      ? recent7Moods.reduce((sum, d) => sum + d.moodScore, 0) / recent7Moods.length
      : null;

    const previous7Days = last30Days.slice(-14, -7);
    const previous7Moods = previous7Days.filter(d => d.mood);
    const previous7Avg = previous7Moods.length > 0
      ? previous7Moods.reduce((sum, d) => sum + d.moodScore, 0) / previous7Moods.length
      : null;

    let moodTrend = 'stable';
    if (recent7Avg !== null && previous7Avg !== null) {
      if (recent7Avg > previous7Avg + 0.5) {
        moodTrend = 'improving';
      } else if (recent7Avg < previous7Avg - 0.5) {
        moodTrend = 'declining';
      }
    }

    return {
      last30Days,
      avgMoodWithCheckIn,
      avgMoodWithoutCheckIn,
      recent7Avg,
      previous7Avg,
      moodTrend
    };
  }

  function calculateAchievements(currentStreak, checkedDays, entriesCount, moodCounts) {
    const achievements = [];

    const streakMilestones = [
      { days: 3, name: '初学者', icon: '🌱', description: '连续打卡3天' },
      { days: 7, name: '坚持者', icon: '🌿', description: '连续打卡7天' },
      { days: 21, name: '习惯养成', icon: '🌳', description: '连续打卡21天' },
      { days: 30, name: '月度达人', icon: '🏆', description: '连续打卡30天' },
      { days: 100, name: '百日大师', icon: '👑', description: '连续打卡100天' }
    ];

    streakMilestones.forEach(milestone => {
      if (currentStreak >= milestone.days) {
        achievements.push({
          type: 'streak',
          name: milestone.name,
          icon: milestone.icon,
          description: milestone.description,
          progress: Math.min(currentStreak / milestone.days, 1),
          unlocked: true
        });
      } else if (currentStreak >= milestone.days * 0.5) {
        achievements.push({
          type: 'streak',
          name: milestone.name,
          icon: milestone.icon,
          description: milestone.description,
          progress: currentStreak / milestone.days,
          unlocked: false
        });
      }
    });

    if (entriesCount >= 50) {
      achievements.push({
        type: 'special',
        name: '日记达人',
        icon: '📝',
        description: '累计写日记50篇',
        progress: 1,
        unlocked: true
      });
    } else if (entriesCount >= 25) {
      achievements.push({
        type: 'special',
        name: '日记达人',
        icon: '📝',
        description: '累计写日记50篇',
        progress: entriesCount / 50,
        unlocked: false
      });
    }

    const totalMoods = Object.values(moodCounts).reduce((sum, count) => sum + count, 0);
    if (totalMoods >= 100) {
      achievements.push({
        type: 'special',
        name: '心情记录者',
        icon: '😊',
        description: '记录心情100次',
        progress: 1,
        unlocked: true
      });
    } else if (totalMoods >= 50) {
      achievements.push({
        type: 'special',
        name: '心情记录者',
        icon: '😊',
        description: '记录心情100次',
        progress: totalMoods / 100,
        unlocked: false
      });
    }

    return achievements;
  }

  const getAllEntries = useCallback(() => {
    const entries = journalData.entries;
    const entriesList = Object.entries(entries)
      .filter(([date, entry]) => entry.reflection || entry.mood || entry.weather || (entry.images && entry.images.length > 0))
      .map(([date, entry]) => ({
        date,
        ...entry
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    return entriesList;
  }, [journalData.entries]);

  const value = useMemo(() => ({
    startDate: journalData.startDate,
    getEntry,
    saveEntry,
    getCheckInStatus,
    getMonthCalendarData,
    getStats,
    getAllEntries
  }), [journalData.startDate, getEntry, saveEntry, getCheckInStatus, getMonthCalendarData, getStats, getAllEntries]);

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
}
