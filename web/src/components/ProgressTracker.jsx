import React, { useState, useEffect, useCallback, memo, createContext, useContext } from 'react';
import { CheckCircle, Circle, Star, Sparkles, Trophy, Target, Zap, Heart } from 'lucide-react';
import './ProgressTracker.css';

const ProgressContext = createContext(null);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
};

const MILESTONES = [
  { id: 'start', name: '开始使用', emoji: '🚀', message: '太棒了，你已经开始第一步！' },
  { id: 'first_node', name: '创建第一个节点', emoji: '🌱', message: '第一个目标诞生了！' },
  { id: 'first_tree', name: '生成国策树', emoji: '🌳', message: '你的国策树已经成型！' },
  { id: 'find_intervention', name: '找到干预点', emoji: '🎯', message: '发现改变的关键点！' },
  { id: 'complete_profile', name: '完善信息', emoji: '✨', message: '信息填写完整，分析更准确！' },
];

const ENCOURAGEMENTS = [
  { emoji: '💪', text: '继续加油！' },
  { emoji: '🌟', text: '做得很好！' },
  { emoji: '🎉', text: '太厉害了！' },
  { emoji: '🔥', text: '状态火热！' },
  { emoji: '💯', text: '满分表现！' },
  { emoji: '🏆', text: '你是冠军！' },
  { emoji: '✨', text: '闪闪发光！' },
  { emoji: '🚀', text: '飞速进步！' },
];

const ProgressProvider = memo(function ProgressProvider({ children }) {
  const [completedMilestones, setCompletedMilestones] = useState(() => {
    const saved = localStorage.getItem('policytree_progress');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationContent, setCelebrationContent] = useState(null);

  useEffect(() => {
    localStorage.setItem('policytree_progress', JSON.stringify(completedMilestones));
  }, [completedMilestones]);

  const completeMilestone = useCallback((milestoneId) => {
    if (completedMilestones.includes(milestoneId)) return;
    
    const milestone = MILESTONES.find(m => m.id === milestoneId);
    if (!milestone) return;

    setCompletedMilestones(prev => [...prev, milestoneId]);
    
    setCelebrationContent({
      emoji: milestone.emoji,
      title: milestone.name,
      message: milestone.message,
    });
    setShowCelebration(true);
    
    setTimeout(() => setShowCelebration(false), 3000);
  }, [completedMilestones]);

  const progress = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;

  const getEncouragement = useCallback(() => {
    return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
  }, []);

  const value = {
    completedMilestones,
    completeMilestone,
    currentStep,
    setCurrentStep,
    totalSteps,
    setTotalSteps,
    progress,
    showCelebration,
    celebrationContent,
    getEncouragement,
    milestones: MILESTONES,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
      {showCelebration && <CelebrationOverlay content={celebrationContent} />}
    </ProgressContext.Provider>
  );
});

const ProgressTracker = memo(function ProgressTracker({ 
  steps = [],
  currentStepIndex = 0,
  onStepClick,
  showLabels = true,
  compact = false 
}) {
  return (
    <div className={`progress-tracker ${compact ? 'compact' : ''}`}>
      <div className="tracker-line">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          
          return (
            <div 
              key={step.id || index}
              className={`tracker-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
              onClick={() => onStepClick?.(index)}
            >
              <div className="step-indicator">
                {isCompleted ? (
                  <CheckCircle size={compact ? 16 : 20} />
                ) : (
                  <Circle size={compact ? 16 : 20} />
                )}
              </div>
              {showLabels && (
                <span className="step-label">{step.label}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

const MilestoneList = memo(function MilestoneList({ showCompleted = true }) {
  const { completedMilestones, milestones } = useProgress();

  const filteredMilestones = showCompleted 
    ? milestones 
    : milestones.filter(m => !completedMilestones.includes(m.id));

  return (
    <div className="milestone-list">
      {filteredMilestones.map((milestone) => {
        const isCompleted = completedMilestones.includes(milestone.id);
        
        return (
          <div 
            key={milestone.id}
            className={`milestone-item ${isCompleted ? 'completed' : ''}`}
          >
            <span className="milestone-emoji">{milestone.emoji}</span>
            <span className="milestone-name">{milestone.name}</span>
            {isCompleted && (
              <CheckCircle size={14} className="milestone-check" />
            )}
          </div>
        );
      })}
    </div>
  );
});

const CelebrationOverlay = memo(function CelebrationOverlay({ content }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1 + Math.random() * 0.5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="celebration-overlay">
      <div className="celebration-particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>
      
      <div className="celebration-content">
        <div className="celebration-emoji">{content.emoji}</div>
        <h3 className="celebration-title">{content.title}</h3>
        <p className="celebration-message">{content.message}</p>
      </div>
    </div>
  );
});

const ProgressBar = memo(function ProgressBar({ 
  progress = 0, 
  showPercentage = true,
  size = 'medium',
  color = 'primary'
}) {
  return (
    <div className={`progress-bar-container ${size}`}>
      <div className={`progress-bar-track ${color}`}>
        <div 
          className="progress-bar-fill"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <span className="progress-percentage">{Math.round(progress)}%</span>
      )}
    </div>
  );
});

const EncouragementBanner = memo(function EncouragementBanner({ 
  message,
  emoji,
  onClose 
}) {
  const { getEncouragement } = useProgress();
  const encouragement = message ? { emoji, text: message } : getEncouragement();

  return (
    <div className="encouragement-banner">
      <span className="encouragement-emoji">{encouragement.emoji}</span>
      <span className="encouragement-text">{encouragement.text}</span>
      {onClose && (
        <button className="encouragement-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
});

const AchievementBadge = memo(function AchievementBadge({ 
  type = 'star',
  label,
  earned = false 
}) {
  const icons = {
    star: Star,
    trophy: Trophy,
    target: Target,
    zap: Zap,
    heart: Heart,
    sparkles: Sparkles,
  };

  const IconComponent = icons[type] || Star;

  return (
    <div className={`achievement-badge ${earned ? 'earned' : ''}`}>
      <IconComponent size={24} />
      {label && <span className="badge-label">{label}</span>}
    </div>
  );
});

const StepCounter = memo(function StepCounter({ 
  current, 
  total,
  label = '步骤'
}) {
  return (
    <div className="step-counter">
      <span className="counter-current">{current}</span>
      <span className="counter-separator">/</span>
      <span className="counter-total">{total}</span>
      <span className="counter-label">{label}</span>
    </div>
  );
});

export {
  ProgressProvider,
  ProgressTracker,
  MilestoneList,
  ProgressBar,
  EncouragementBanner,
  AchievementBadge,
  StepCounter,
  MILESTONES,
};

export default ProgressTracker;

// 最后更新时间: 2026-02-21 19:45
// 编辑人: Trae AI
// 说明: 进度追踪和正面反馈组件，帮助用户保持动力
