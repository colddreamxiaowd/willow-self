import React, { useState, useCallback, memo } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, HelpCircle, Check } from 'lucide-react';
import './GuidedWizard.css';

const WIZARD_STEPS = [
  {
    id: 'problem',
    title: '你最大的困扰是什么？',
    subtitle: '别担心，我们一步步来解决',
    type: 'select',
    options: [
      { value: 'procrastination', label: '拖延症', emoji: '⏰', description: '总是把事情拖到最后' },
      { value: 'sleep', label: '熬夜问题', emoji: '🌙', description: '晚上睡不着，早上起不来' },
      { value: 'focus', label: '注意力分散', emoji: '🎯', description: '很难集中精力做一件事' },
      { value: 'stress', label: '压力过大', emoji: '😰', description: '感觉喘不过气来' },
      { value: 'health', label: '健康问题', emoji: '💪', description: '想改善生活习惯' },
      { value: 'other', label: '其他困扰', emoji: '🤔', description: '有其他想要改变的事' },
    ],
  },
  {
    id: 'goal',
    title: '你希望达到什么状态？',
    subtitle: '想象一下，改变后的你会是什么样',
    type: 'text',
    placeholder: '例如：每天能专注学习4小时，不再熬夜...',
    help: '用你自己的话描述就好，越具体越好',
  },
  {
    id: 'action',
    title: '你觉得可以做什么来改变？',
    subtitle: '哪怕是很小的行动也可以',
    type: 'text',
    placeholder: '例如：睡前把手机放客厅、每天早起10分钟...',
    help: '可以写多个，用逗号分开',
  },
  {
    id: 'difficulty',
    title: '开始做这件事有多难？',
    subtitle: '诚实地评估一下',
    type: 'slider',
    min: 1,
    max: 10,
    labels: {
      1: '非常容易',
      3: '有点难',
      5: '中等难度',
      7: '比较难',
      10: '非常困难',
    },
    help: '1分 = 几乎不用努力就能开始，10分 = 需要很大意志力',
  },
  {
    id: 'chain',
    title: '做这件事会带动其他事吗？',
    subtitle: '有些行为会像多米诺骨牌一样',
    type: 'slider',
    min: 1,
    max: 10,
    labels: {
      1: '完全独立',
      3: '影响一点点',
      5: '有一些影响',
      7: '影响挺多',
      10: '会带动很多事',
    },
    help: '例如：早起可能会让你有时间吃早餐、运动、读书...',
  },
  {
    id: 'maintain',
    title: '需要多少精力来维持？',
    subtitle: '有些习惯养成后就自然了',
    type: 'slider',
    min: 1,
    max: 10,
    labels: {
      1: '几乎不用管',
      3: '偶尔提醒自己',
      5: '需要一些关注',
      7: '需要持续努力',
      10: '需要很大投入',
    },
    help: '1分 = 设定后自动运行，10分 = 每天都需要意志力',
  },
];

const GuidedWizard = memo(function GuidedWizard({ onComplete, onSwitchToYaml }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    problem: '',
    goal: '',
    action: '',
    difficulty: 5,
    chain: 5,
    maintain: 5,
  });
  const [showHelp, setShowHelp] = useState(false);

  const step = WIZARD_STEPS[currentStep];
  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  const handleAnswer = useCallback((value) => {
    setAnswers(prev => ({ ...prev, [step.id]: value }));
  }, [step.id]);

  const handleNext = useCallback(() => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      const yaml = generateYaml(answers);
      onComplete(yaml);
    }
  }, [currentStep, answers, onComplete]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const canProceed = () => {
    const value = answers[step.id];
    if (step.type === 'text') {
      return value && value.trim().length > 0;
    }
    if (step.type === 'select') {
      return value && value.length > 0;
    }
    return true;
  };

  const renderStepContent = () => {
    switch (step.type) {
      case 'select':
        return (
          <div className="options-grid">
            {step.options.map((option) => (
              <button
                key={option.value}
                className={`option-card ${answers[step.id] === option.value ? 'selected' : ''}`}
                onClick={() => handleAnswer(option.value)}
              >
                <span className="option-emoji">{option.emoji}</span>
                <span className="option-label">{option.label}</span>
                <span className="option-desc">{option.description}</span>
                {answers[step.id] === option.value && (
                  <span className="option-check"><Check size={16} /></span>
                )}
              </button>
            ))}
          </div>
        );

      case 'text':
        return (
          <div className="text-input-container">
            <textarea
              className="wizard-textarea"
              value={answers[step.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={step.placeholder}
              rows={3}
              autoFocus
            />
            <p className="input-help">{step.help}</p>
          </div>
        );

      case 'slider':
        return (
          <div className="slider-container">
            <div className="slider-value-display">
              <span className="slider-number">{answers[step.id]}</span>
              <span className="slider-label">{step.labels[answers[step.id]] || ''}</span>
            </div>
            <input
              type="range"
              className="wizard-slider"
              min={step.min}
              max={step.max}
              value={answers[step.id]}
              onChange={(e) => handleAnswer(parseInt(e.target.value))}
            />
            <div className="slider-labels">
              <span>{step.labels[step.min]}</span>
              <span>{step.labels[step.max]}</span>
            </div>
            <p className="input-help">{step.help}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="guided-wizard">
      <div className="wizard-header">
        <div className="wizard-progress">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-text">
          第 {currentStep + 1} 步，共 {WIZARD_STEPS.length} 步
        </div>
      </div>

      <div className="wizard-content">
        <div className="step-title">
          <h2>{step.title}</h2>
          <p className="step-subtitle">{step.subtitle}</p>
        </div>

        {renderStepContent()}
      </div>

      <div className="wizard-footer">
        <button
          className="btn-help"
          onClick={() => setShowHelp(!showHelp)}
        >
          <HelpCircle size={16} />
          需要帮助？
        </button>

        <div className="wizard-actions">
          {currentStep > 0 && (
            <button className="btn-back" onClick={handleBack}>
              <ChevronLeft size={16} />
              上一步
            </button>
          )}
          
          <button
            className="btn-next"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentStep < WIZARD_STEPS.length - 1 ? (
              <>
                下一步
                <ChevronRight size={16} />
              </>
            ) : (
              <>
                <Sparkles size={16} />
                生成我的国策树
              </>
            )}
          </button>
        </div>
      </div>

      <div className="yaml-switch">
        <button className="switch-btn" onClick={onSwitchToYaml}>
          我是高级用户，想直接编辑 YAML
        </button>
      </div>
    </div>
  );
});

function generateYaml(answers) {
  const actions = answers.action
    ? answers.action.split(/[,，、]/).map(a => a.trim()).filter(a => a)
    : ['待添加的行动'];

  const childrenYaml = actions.map((action, index) => {
    return `
  - id: action_${index + 1}
    description: "${action}"
    type: ACTION
    resistance_score: ${answers.difficulty}
    coupling_score: ${answers.chain}
    maintenance_cost: ${answers.maintain}`;
  }).join('\n');

  return `id: root
description: "${answers.goal || '我的生活目标'}"
type: ROOT
resistance_score: ${answers.difficulty}
coupling_score: ${answers.chain}
maintenance_cost: ${answers.maintain}
children:
  - id: goal_1
    description: "${getProblemLabel(answers.problem)}"
    type: GOAL
    resistance_score: ${Math.max(1, answers.difficulty - 1)}
    coupling_score: ${Math.min(10, answers.chain + 1)}
    maintenance_cost: ${answers.maintain}
    children:${childrenYaml}
`;
}

function getProblemLabel(problem) {
  const labels = {
    procrastination: '克服拖延',
    sleep: '改善睡眠',
    focus: '提升专注力',
    stress: '缓解压力',
    health: '改善健康',
    other: '实现目标',
  };
  return labels[problem] || '实现目标';
}

export default GuidedWizard;

// 最后更新时间: 2026-02-21 17:30
// 编辑人: Trae AI
// 说明: 引导式问答组件，用通俗语言引导用户创建国策树
