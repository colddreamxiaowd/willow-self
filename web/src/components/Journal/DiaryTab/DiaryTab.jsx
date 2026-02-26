import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Sun, Cloud, CloudRain, CloudSnow, Smile, Meh, Frown, Annoyed, Heart, Image as ImageIcon, X } from 'lucide-react';
import { useJournal } from '../hooks/useJournal';
import './DiaryTab.css';

const MOODS = [
  { id: 'happy', label: '开心', icon: Smile, color: '#f1c40f' },
  { id: 'calm', label: '平静', icon: Heart, color: '#2ecc71' },
  { id: 'tired', label: '疲惫', icon: Meh, color: '#95a5a6' },
  { id: 'anxious', label: '焦虑', icon: Annoyed, color: '#e67e22' },
  { id: 'sad', label: '难过', icon: Frown, color: '#3498db' }
];

const WEATHERS = [
  { id: 'sunny', label: '晴', icon: Sun, color: '#f39c12' },
  { id: 'cloudy', label: '阴', icon: Cloud, color: '#95a5a6' },
  { id: 'rainy', label: '雨', icon: CloudRain, color: '#3498db' },
  { id: 'snowy', label: '雪', icon: CloudSnow, color: '#ecf0f1' }
];

function DiaryTab({ selectedDate }) {
  const { getEntry, saveEntry } = useJournal();
  const [entry, setEntry] = useState(() => getEntry(selectedDate));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEntry(getEntry(selectedDate));
    setIsEditing(false);
  }, [selectedDate, getEntry]);

  const handleMoodSelect = (moodId) => {
    const newEntry = { ...entry, mood: moodId };
    setEntry(newEntry);
    saveEntry(selectedDate, newEntry);
  };

  const handleWeatherSelect = (weatherId) => {
    const newEntry = { ...entry, weather: weatherId };
    setEntry(newEntry);
    saveEntry(selectedDate, newEntry);
  };

  const handleReflectionChange = (e) => {
    setEntry({ ...entry, reflection: e.target.value });
  };

  const handleReflectionSave = () => {
    saveEntry(selectedDate, { reflection: entry.reflection });
    setIsEditing(false);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const currentImages = entry.images || [];
    const newImages = [...currentImages];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newImages.push(event.target.result);
        if (newImages.length === currentImages.length + files.length) {
          const updatedEntry = { ...entry, images: newImages };
          setEntry(updatedEntry);
          saveEntry(selectedDate, updatedEntry);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    const newImages = entry.images.filter((_, i) => i !== index);
    const updatedEntry = { ...entry, images: newImages };
    setEntry(updatedEntry);
    saveEntry(selectedDate, updatedEntry);
  };

  const dateDisplay = format(selectedDate, 'yyyy年 M月 d日 EEEE', { locale: zhCN });

  return (
    <div className="diary-tab">
      <div className="diary-date-header">
        <h3>{dateDisplay}</h3>
      </div>

      <div className="diary-section">
        <div className="section-header">
          <span className="section-icon">😊</span>
          <span className="section-title">心情</span>
        </div>
        <div className="mood-selector">
          {MOODS.map(mood => {
            const Icon = mood.icon;
            const isSelected = entry.mood === mood.id;
            return (
              <button
                key={mood.id}
                className={`mood-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleMoodSelect(mood.id)}
                style={{ '--mood-color': mood.color }}
              >
                <Icon size={24} />
                <span>{mood.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="diary-section">
        <div className="section-header">
          <span className="section-icon">🌤️</span>
          <span className="section-title">天气</span>
        </div>
        <div className="weather-selector">
          {WEATHERS.map(weather => {
            const Icon = weather.icon;
            const isSelected = entry.weather === weather.id;
            return (
              <button
                key={weather.id}
                className={`weather-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleWeatherSelect(weather.id)}
                style={{ '--weather-color': weather.color }}
              >
                <Icon size={20} />
                <span>{weather.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="diary-section">
        <div className="section-header">
          <span className="section-icon">📷</span>
          <span className="section-title">照片</span>
        </div>
        <div className="images-container">
          {entry.images && entry.images.length > 0 && (
            <div className="images-grid">
              {entry.images.map((img, index) => (
                <div key={index} className="image-item">
                  <img src={img} alt={`照片 ${index + 1}`} />
                  <button 
                    className="remove-image-btn"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <label className="upload-image-btn">
            <ImageIcon size={20} />
            <span>添加照片</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <div className="diary-section reflection-section">
        <div className="section-header">
          <span className="section-icon">📝</span>
          <span className="section-title">今日反思</span>
          {!isEditing && entry.reflection && (
            <button 
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              编辑
            </button>
          )}
        </div>
        
        {isEditing || !entry.reflection ? (
          <div className="reflection-editor">
            <textarea
              value={entry.reflection}
              onChange={handleReflectionChange}
              placeholder="记录今天的收获、困难和感悟..."
              rows={8}
              autoFocus
            />
            <div className="editor-actions">
              <button 
                className="save-btn"
                onClick={handleReflectionSave}
              >
                保存
              </button>
              {entry.reflection && (
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    setEntry(getEntry(selectedDate));
                    setIsEditing(false);
                  }}
                >
                  取消
                </button>
              )}
            </div>
          </div>
        ) : (
          <div 
            className="reflection-display"
            onClick={() => setIsEditing(true)}
          >
            <p>{entry.reflection}</p>
            <span className="edit-hint">点击编辑</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiaryTab;
