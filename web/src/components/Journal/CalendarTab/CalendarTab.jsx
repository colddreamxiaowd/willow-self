import React, { useState, useMemo } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useJournal } from '../hooks/useJournal';
import './CalendarTab.css';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

function CalendarTab({ selectedDate, onDateSelect, onSwitchToDiary }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { getMonthCalendarData, startDate } = useJournal();

  const calendarData = useMemo(() => {
    return getMonthCalendarData(
      currentMonth.getFullYear(),
      currentMonth.getMonth()
    );
  }, [currentMonth, getMonthCalendarData]);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDateClick = (dayData) => {
    onDateSelect(dayData.date);
  };

  const handleDateDoubleClick = (dayData) => {
    onDateSelect(dayData.date);
    onSwitchToDiary();
  };

  const renderDayStatus = (dayData) => {
    if (dayData.isBeforeStart) return null;
    
    if (dayData.status === 'checked') {
      return <span className="day-status checked">😊</span>;
    }
    
    if (dayData.status === 'miss') {
      return <span className="day-status miss">miss</span>;
    }
    
    return null;
  };

  return (
    <div className="calendar-tab">
      <div className="calendar-header">
        <button className="month-nav-btn" onClick={handlePrevMonth} aria-label="上个月">
          <ChevronLeft size={24} />
        </button>
        <h3 className="current-month">
          {format(currentMonth, 'yyyy年 M月', { locale: zhCN })}
        </h3>
        <button className="month-nav-btn" onClick={handleNextMonth} aria-label="下个月">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-icon">😊</span>
          <span>已打卡</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon miss-text">miss</span>
          <span>未打卡</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot start-dot"></span>
          <span>起始日: {format(new Date(startDate), 'M月d日', { locale: zhCN })}</span>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="weekday-row">
          {WEEKDAYS.map(day => (
            <div key={day} className="weekday-cell">{day}</div>
          ))}
        </div>

        <div className="days-grid">
          {calendarData.map(dayData => {
            const isSelected = format(dayData.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
            
            return (
              <div
                key={dayData.dateKey}
                className={`day-cell ${dayData.isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dayData.isBeforeStart ? 'before-start' : ''} ${dayData.hasEntry ? 'has-entry' : ''}`}
                onClick={() => handleDateClick(dayData)}
                onDoubleClick={() => handleDateDoubleClick(dayData)}
              >
                <span className="day-number">{format(dayData.date, 'd')}</span>
                {renderDayStatus(dayData)}
                {dayData.hasEntry && <span className="entry-indicator">📝</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="calendar-hint">
        💡 单击选择日期，双击进入日记
      </div>
    </div>
  );
}

export default CalendarTab;
