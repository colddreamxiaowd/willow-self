import React, { useState } from 'react';
import { Calendar, BookOpen, BarChart3, Clock } from 'lucide-react';
import CalendarTab from './CalendarTab/CalendarTab';
import DiaryTab from './DiaryTab/DiaryTab';
import StatsTab from './StatsTab/StatsTab';
import TimelineTab from './TimelineTab/TimelineTab';
import { JournalProvider } from './hooks/useJournal';
import './JournalApp.css';

const TABS = [
  { id: 'calendar', label: '日历', icon: Calendar },
  { id: 'diary', label: '日记', icon: BookOpen },
  { id: 'timeline', label: '时间线', icon: Clock },
  { id: 'stats', label: '统计', icon: BarChart3 }
];

function JournalApp({ onClose }) {
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const renderTabContent = () => {
    switch (activeTab) {
      case 'calendar':
        return (
          <CalendarTab 
            selectedDate={selectedDate} 
            onDateSelect={setSelectedDate}
            onSwitchToDiary={() => setActiveTab('diary')}
          />
        );
      case 'diary':
        return <DiaryTab selectedDate={selectedDate} />;
      case 'timeline':
        return <TimelineTab />;
      case 'stats':
        return <StatsTab />;
      default:
        return null;
    }
  };

  return (
    <JournalProvider>
      <div className="journal-app">
        <div className="journal-header">
          <h2 className="journal-title">我的手账</h2>
          <button className="journal-close-btn" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>

        <div className="journal-tabs">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`journal-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="journal-content">
          {renderTabContent()}
        </div>
      </div>
    </JournalProvider>
  );
}

export default JournalApp;
