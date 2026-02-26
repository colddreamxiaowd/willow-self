import React, { useState, useEffect } from 'react';
import './OnboardingGuide.css';

const ONBOARDING_KEY = 'policytree_onboarding_completed';

const steps = [
  {
    id: 'welcome',
    title: '欢迎来到 PolicyTree',
    icon: '🌳',
    content: (
      <div className="onboarding-step-content">
        <p className="step-intro">PolicyTree 是一个基于<strong>数学和工程思维</strong>的自控力提升工具。</p>
        <div className="step-features">
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <span>建立清晰的行为目标</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span>追踪执行稳态</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔄</span>
            <span>递归迭代优化</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'ctdp',
    title: '为什么我们总是拖延？',
    icon: '🧠',
    content: (
      <div className="onboarding-step-content">
        <p className="step-intro">这是<strong>双曲贴现</strong>在作祟。</p>
        <div className="concept-card">
          <p>大脑会高估即时满足的价值，低估未来收益。</p>
          <p className="concept-example">刷手机的快乐是<strong>即时的</strong>，学习的收益是<strong>延迟的</strong>。</p>
        </div>
        <p className="step-conclusion">CTDP 通过<strong>国策树</strong>结构，将大目标分解为可立即执行的小步骤。</p>
      </div>
    )
  },
  {
    id: 'rsip',
    title: 'RSIP: 聪明的自控策略',
    icon: '🎯',
    content: (
      <div className="onboarding-step-content">
        <p className="step-intro">RSIP 的核心理念：</p>
        <div className="concept-card highlight">
          <p className="concept-key">不要试图控制一切</p>
          <p>找到<strong>高控制力的干预点</strong>，在那里施加影响</p>
        </div>
        <p className="step-conclusion">例如：与其全天自律，不如专注于起床后30分钟。</p>
      </div>
    )
  },
  {
    id: 'quickstart',
    title: '创建你的第一个国策',
    icon: '📝',
    content: (
      <div className="onboarding-step-content">
        <p className="step-intro">国策是你想要培养的行为或戒除的习惯。</p>
        <div className="example-list">
          <div className="example-item">
            <span className="example-icon">📚</span>
            <span>每天阅读30分钟</span>
          </div>
          <div className="example-item">
            <span className="example-icon">🏃</span>
            <span>每周运动3次</span>
          </div>
          <div className="example-item">
            <span className="example-icon">📵</span>
            <span>睡前1小时不刷手机</span>
          </div>
        </div>
        <p className="step-conclusion">点击"开始"创建你的第一个国策。</p>
      </div>
    )
  },
  {
    id: 'complete',
    title: '准备就绪！',
    icon: '🚀',
    content: (
      <div className="onboarding-step-content">
        <p className="step-intro">你已经了解了 PolicyTree 的核心理念。</p>
        <div className="tips-list">
          <div className="tip-item">✓ 从小处开始，逐步迭代</div>
          <div className="tip-item">✓ 关注稳态，而非完美</div>
          <div className="tip-item">✓ 找到你的高控制力干预点</div>
        </div>
        <p className="step-conclusion highlight">现在，开始你的自控力提升之旅吧！</p>
      </div>
    )
  }
];

export function OnboardingGuide({ onComplete, onSkip }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsVisible(false);
    onSkip?.();
  };

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsVisible(false);
    onComplete?.();
  };

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        {/* 头部 */}
        <div className="onboarding-header">
          <button className="onboarding-skip" onClick={handleSkip}>跳过引导</button>
        </div>

        {/* 内容区 */}
        <div className="onboarding-body">
          <div className="step-icon">{step.icon}</div>
          <h2 className="step-title">{step.title}</h2>
          <div className="step-content-wrapper">
            {step.content}
          </div>
        </div>

        {/* 底部 */}
        <div className="onboarding-footer">
          <div className="progress-dots">
            {steps.map((_, index) => (
              <span
                key={index}
                className={`progress-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              />
            ))}
          </div>
          
          <div className="action-buttons">
            {currentStep > 0 ? (
              <button className="btn-secondary" onClick={handlePrev}>
                上一步
              </button>
            ) : (
              <div className="btn-placeholder" />
            )}
            
            <button className="btn-primary" onClick={handleNext}>
              {currentStep === steps.length - 1 ? '开始' : '下一步'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingGuide;
