import React, { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Calendar, Smile, Meh, Frown, Annoyed, Heart, CloudSun, CloudRain, CloudSnow, Sun, Wind, Filter, RotateCcw } from 'lucide-react';
import { useJournal } from '../hooks/useJournal';
import TimelineDetailModal from './TimelineDetailModal';
import './TimelineTab.css';

const MOOD_ICONS = {
  happy: { icon: Smile, color: '#f1c40f', label: '开心' },
  calm: { icon: Heart, color: '#2ecc71', label: '平静' },
  tired: { icon: Meh, color: '#95a5a6', label: '疲惫' },
  anxious: { icon: Annoyed, color: '#e67e22', label: '焦虑' },
  sad: { icon: Frown, color: '#3498db', label: '难过' }
};

const WEATHER_ICONS = {
  sunny: { icon: Sun, color: '#f1c40f', label: '晴' },
  cloudy: { icon: CloudSun, color: '#95a5a6', label: '多云' },
  rainy: { icon: CloudRain, color: '#3498db', label: '雨' },
  snowy: { icon: CloudSnow, color: '#ecf0f1', label: '雪' },
  windy: { icon: Wind, color: '#1abc9c', label: '风' }
};

function TimelineTab() {
  const { getAllEntries } = useJournal();
  const allEntries = getAllEntries();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);

  const filteredEntries = useMemo(() => {
    if (!startDate && !endDate) {
      return allEntries;
    }

    return allEntries.filter(entry => {
      const entryDate = parseISO(entry.date);
      let isValid = true;

      if (startDate) {
        isValid = isValid && entryDate >= new Date(startDate);
      }
      if (endDate) {
        isValid = isValid && entryDate <= new Date(endDate);
      }

      return isValid;
    });
  }, [allEntries, startDate, endDate]);

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
  };

  const renderMood = (mood) => {
    if (!mood || !MOOD_ICONS[mood]) return null;
    const moodInfo = MOOD_ICONS[mood];
    const Icon = moodInfo.icon;
    return (
      <span className="timeline-tag mood">
        <Icon size={14} style={{ color: moodInfo.color }} />
        {moodInfo.label}
      </span>
    );
  };

  const renderWeather = (weather) => {
    if (!weather || !WEATHER_ICONS[weather]) return null;
    const weatherInfo = WEATHER_ICONS[weather];
    const Icon = weatherInfo.icon;
    return (
      <span className="timeline-tag weather">
        <Icon size={14} style={{ color: weatherInfo.color }} />
        {weatherInfo.label}
      </span>
    );
  };

  if (allEntries.length === 0) {
    return (
      <div className="timeline-tab">
        <div className="timeline-empty">
          <Calendar size={48} />
          <h3>暂无日记记录</h3>
          <p>开始写日记，时间线会在这里显示</p>
        </div>
      </div>
    );
  }

  return (
    <div className="timeline-tab">
      <div className="timeline-header">
        <h3>🕐 日记时间线</h3>
      </div>

      <div className="timeline-filter">
        <div className="filter-row">
          <label>
            <span>开始日期:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            <span>结束日期:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>
        <div className="filter-actions">
          <button className="filter-btn" onClick={() => {}}>
            <Filter size={14} /> 筛选
          </button>
          <button className="reset-btn" onClick={handleReset}>
            <RotateCcw size={14} /> 重置
          </button>
        </div>
      </div>

      <div className="timeline-count">
        共 {filteredEntries.length} 条记录
      </div>

      <div className="timeline-list">
        {filteredEntries.map((entry) => (
          <div key={entry.date} className="timeline-card" onClick={() => setSelectedEntry(entry)}>
            <div className="card-header">
              <span className="card-date">
                📅 {format(parseISO(entry.date), 'yyyy年M月d日 EEEE', { locale: zhCN })}
              </span>
            </div>
            <div className="card-tags">
              {renderMood(entry.mood)}
              {renderWeather(entry.weather)}
            </div>
            <div className="card-content">
              {entry.reflection || '暂无反思内容'}
            </div>
          </div>
        ))}
      </div>

      {selectedEntry && (
        <TimelineDetailModal 
          entry={selectedEntry} 
          onClose={() => setSelectedEntry(null)} 
        />
      )}
    </div>
  );
}

export default TimelineTab;
