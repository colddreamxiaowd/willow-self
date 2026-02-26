import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { X, Smile, Meh, Frown, Annoyed, Heart, Sun, CloudSun, CloudRain, CloudSnow, Wind, Image as ImageIcon, ZoomIn } from 'lucide-react';
import './TimelineDetailModal.css';

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

function TimelineDetailModal({ entry, onClose }) {
  const [previewImage, setPreviewImage] = useState(null);

  if (!entry) return null;

  const moodInfo = entry.mood && MOOD_ICONS[entry.mood];
  const weatherInfo = entry.weather && WEATHER_ICONS[entry.weather];
  const MoodIcon = moodInfo?.icon;
  const WeatherIcon = weatherInfo?.icon;
  const hasImages = entry.images && entry.images.length > 0;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageClick = (img) => {
    setPreviewImage(img);
  };

  const closePreview = (e) => {
    e.stopPropagation();
    setPreviewImage(null);
  };

  return (
    <>
      <div className="timeline-detail-overlay" onClick={handleBackdropClick}>
        <div className="timeline-detail-modal">
          <div className="detail-modal-header">
            <div className="detail-date">
              <span className="detail-date-icon">📅</span>
              <span className="detail-date-text">
                {format(parseISO(entry.date), 'yyyy年M月d日 EEEE', { locale: zhCN })}
              </span>
            </div>
            <button className="detail-close-btn" onClick={onClose} aria-label="关闭">
              <X size={20} />
            </button>
          </div>

          <div className="detail-modal-body">
            <div className="detail-tags">
              {moodInfo && (
                <span className="detail-tag mood-tag">
                  <MoodIcon size={16} style={{ color: moodInfo.color }} />
                  <span>{moodInfo.label}</span>
                </span>
              )}
              {weatherInfo && (
                <span className="detail-tag weather-tag">
                  <WeatherIcon size={16} style={{ color: weatherInfo.color }} />
                  <span>{weatherInfo.label}</span>
                </span>
              )}
            </div>

            <div className="detail-content-section">
              <h4 className="detail-section-title">💭 今日反思</h4>
              <div className="detail-reflection">
                {entry.reflection || '暂无反思内容'}
              </div>
            </div>

            {hasImages && (
              <div className="detail-content-section">
                <h4 className="detail-section-title">
                  <ImageIcon size={16} />
                  照片记录 ({entry.images.length})
                </h4>
                <div className="detail-images">
                  {entry.images.map((img, index) => (
                    <div key={index} className="detail-image-wrapper" onClick={() => handleImageClick(img)}>
                      <img 
                        src={img} 
                        alt={`日记照片 ${index + 1}`} 
                        className="detail-image"
                      />
                      <div className="detail-image-overlay">
                        <ZoomIn size={24} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!hasImages && !entry.reflection && (
              <div className="detail-empty">
                <p>暂无详细内容</p>
              </div>
            )}
          </div>

          <div className="detail-modal-footer">
            <span className="detail-updated">
              更新于: {entry.updatedAt 
                ? format(new Date(entry.updatedAt), 'yyyy-MM-dd HH:mm')
                : '未知'}
            </span>
          </div>
        </div>
      </div>

      {previewImage && (
        <div className="image-preview-overlay" onClick={closePreview}>
          <button className="preview-close-btn" onClick={closePreview}>
            <X size={24} />
          </button>
          <img 
            src={previewImage} 
            alt="预览" 
            className="preview-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

export default TimelineDetailModal;
