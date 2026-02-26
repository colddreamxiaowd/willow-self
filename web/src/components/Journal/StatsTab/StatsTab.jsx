import React from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { TrendingUp, Calendar, Target, Award, Smile, Meh, Frown, Annoyed, Heart } from 'lucide-react';
import { useJournal } from '../hooks/useJournal';
import './StatsTab.css';

const MOOD_ICONS = {
  happy: { icon: Smile, color: '#f1c40f', label: '开心' },
  calm: { icon: Heart, color: '#2ecc71', label: '平静' },
  tired: { icon: Meh, color: '#95a5a6', label: '疲惫' },
  anxious: { icon: Annoyed, color: '#e67e22', label: '焦虑' },
  sad: { icon: Frown, color: '#3498db', label: '难过' }
};

function getMoodLabel(avgScore) {
  if (avgScore >= 4.5) return '开心';
  if (avgScore >= 3.5) return '平静';
  if (avgScore >= 2.5) return '疲惫';
  if (avgScore >= 1.5) return '焦虑';
  return '难过';
}

function StatsTab() {
  const { getStats } = useJournal();
  const stats = getStats();

  const renderMoodChart = () => {
    const moodCounts = stats.moodCounts;
    const total = Object.values(moodCounts).reduce((sum, count) => sum + count, 0);
    
    if (total === 0) {
      return (
        <div className="empty-chart">
          <p>还没有心情记录</p>
        </div>
      );
    }

    return (
      <div className="mood-chart">
        {Object.entries(moodCounts).map(([mood, count]) => {
          const moodInfo = MOOD_ICONS[mood];
          const Icon = moodInfo.icon;
          const percentage = Math.round((count / total) * 100);
          
          return (
            <div key={mood} className="mood-bar-item">
              <div className="mood-bar-header">
                <Icon size={18} style={{ color: moodInfo.color }} />
                <span className="mood-label">{moodInfo.label}</span>
                <span className="mood-count">{count}次</span>
              </div>
              <div className="mood-bar-track">
                <div 
                  className="mood-bar-fill"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: moodInfo.color 
                  }}
                />
              </div>
              <span className="mood-percentage">{percentage}%</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="stats-tab">
      <div className="stats-header">
        <h3>数据统计</h3>
        <p className="stats-period">
          从 {format(new Date(stats.startDate), 'yyyy年M月d日', { locale: zhCN })} 开始
        </p>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon calendar">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalDays}</span>
            <span className="stat-label">总天数</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon checked">
            <Target size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.checkedDays}</span>
            <span className="stat-label">打卡天数</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon streak">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.currentStreak}</span>
            <span className="stat-label">连续打卡</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon max">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.maxStreak}</span>
            <span className="stat-label">最长连续</span>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="section-header">
          <span className="section-icon">📊</span>
          <span className="section-title">打卡率</span>
        </div>
        <div className="check-rate-container">
          <div className="check-rate-circle">
            <svg viewBox="0 0 100 100">
              <circle
                className="rate-bg"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="8"
              />
              <circle
                className="rate-fill"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="8"
                strokeDasharray={`${stats.checkRate * 2.83} ${283 - stats.checkRate * 2.83}`}
                strokeDashoffset="70.75"
              />
            </svg>
            <div className="rate-value">
              <span className="rate-number">{stats.checkRate}</span>
              <span className="rate-unit">%</span>
            </div>
          </div>
          <div className="rate-description">
            <p>你已坚持打卡 <strong>{stats.checkedDays}</strong> 天</p>
            <p>共记录日记 <strong>{stats.entriesCount}</strong> 篇</p>
          </div>
        </div>
      </div>

      {stats.trendData && (
        <div className="stats-section">
          <div className="section-header">
            <span className="section-icon">📈</span>
            <span className="section-title">趋势分析</span>
          </div>
          <div className="trend-cards">
            <div className="trend-card">
              <div className="trend-period">最近7天</div>
              <div className="trend-rate">{stats.trendData.days7.rate}%</div>
              <div className="trend-detail">
                {stats.trendData.days7.checked}/{stats.trendData.days7.total}天
              </div>
            </div>
            <div className="trend-card">
              <div className="trend-period">最近14天</div>
              <div className="trend-rate">{stats.trendData.days14.rate}%</div>
              <div className="trend-detail">
                {stats.trendData.days14.checked}/{stats.trendData.days14.total}天
              </div>
            </div>
            <div className="trend-card">
              <div className="trend-period">最近30天</div>
              <div className="trend-rate">{stats.trendData.days30.rate}%</div>
              <div className="trend-detail">
                {stats.trendData.days30.checked}/{stats.trendData.days30.total}天
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="stats-section">
        <div className="section-header">
          <span className="section-icon">😊</span>
          <span className="section-title">心情分布</span>
        </div>
        {renderMoodChart()}
      </div>

      {stats.moodTrendData && (
        <div className="stats-section">
          <div className="section-header">
            <span className="section-icon">💭</span>
            <span className="section-title">心情趋势</span>
          </div>
          <div className="mood-trend-insights">
            {stats.moodTrendData.moodTrend === 'improving' && (
              <div className="mood-insight improving">
                <span className="insight-icon">📈</span>
                <span>心情趋势正在好转，继续保持！</span>
              </div>
            )}
            {stats.moodTrendData.moodTrend === 'declining' && (
              <div className="mood-insight declining">
                <span className="insight-icon">📉</span>
                <span>最近心情有所波动，记得照顾好自己</span>
              </div>
            )}
            {stats.moodTrendData.moodTrend === 'stable' && (
              <div className="mood-insight stable">
                <span className="insight-icon">➡️</span>
                <span>心情状态稳定，保持良好节奏</span>
              </div>
            )}
            
            {stats.moodTrendData.avgMoodWithCheckIn !== null && 
             stats.moodTrendData.avgMoodWithoutCheckIn !== null && (
              <div className="mood-checkin-correlation">
                <p>
                  打卡时平均心情：<strong>{getMoodLabel(stats.moodTrendData.avgMoodWithCheckIn)}</strong>
                </p>
                <p>
                  未打卡时平均心情：<strong>{getMoodLabel(stats.moodTrendData.avgMoodWithoutCheckIn)}</strong>
                </p>
                {stats.moodTrendData.avgMoodWithCheckIn > stats.moodTrendData.avgMoodWithoutCheckIn && (
                  <p className="correlation-tip">💡 打卡似乎能改善你的心情状态</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {stats.achievements && stats.achievements.length > 0 && (
        <div className="stats-section">
          <div className="section-header">
            <span className="section-icon">🏆</span>
            <span className="section-title">成就徽章</span>
          </div>
          <div className="achievements-grid">
            {stats.achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-info">
                  <div className="achievement-name">{achievement.name}</div>
                  <div className="achievement-desc">{achievement.description}</div>
                  {!achievement.unlocked && (
                    <div className="achievement-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${achievement.progress * 100}%` }}
                        />
                      </div>
                      <span className="progress-text">
                        {Math.round(achievement.progress * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="stats-tips">
        <h4>💡 小贴士</h4>
        <ul>
          <li>坚持打卡可以帮助你养成好习惯</li>
          <li>记录心情可以更好地了解自己</li>
          <li>每日反思有助于持续成长</li>
        </ul>
      </div>
    </div>
  );
}

export default StatsTab;
