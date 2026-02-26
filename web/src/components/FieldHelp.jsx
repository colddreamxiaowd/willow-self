import React, { useState, memo } from 'react';
import { HelpCircle, X, Lightbulb, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import './FieldHelp.css';

const HELP_CONTENT = {
  coupling_score: {
    title: '带动性是什么？',
    shortDesc: '做这件事会不会带动其他事情一起完成？',
    longDesc: `有些行为像多米诺骨牌，做一个会带动很多个。

比如早起这件事：
• 早起 → 有时间吃早餐
• 早起 → 有时间运动
• 早起 → 精神更好 → 工作效率更高

这就是"带动性"高的行为。`,
    example: '早起、运动、整理房间都是带动性高的行为',
    tip: '优先做带动性高的事，可以"一石多鸟"',
    scale: [
      { value: 1, label: '完全独立', desc: '做这件事不会影响其他事' },
      { value: 5, label: '有一些影响', desc: '会带动1-2件相关的事' },
      { value: 10, label: '带动很多事', desc: '像多米诺骨牌一样' },
    ],
  },
  resistance_score: {
    title: '阻力是什么？',
    shortDesc: '开始做这件事有多困难？',
    longDesc: `阻力就是你开始做一件事需要克服的"心理障碍"。

阻力高的事：
• 需要很大意志力才能开始
• 总是找借口拖延
• 想到就头疼

阻力低的事：
• 几乎不用思考就能开始
• 很自然地就做了
• 甚至有点享受`,
    example: '刷手机阻力低，写论文阻力高',
    tip: '从阻力低的事开始，更容易建立信心',
    scale: [
      { value: 1, label: '非常容易', desc: '几乎不用努力就能开始' },
      { value: 5, label: '中等难度', desc: '需要一些意志力' },
      { value: 10, label: '非常困难', desc: '每次都需要很大决心' },
    ],
  },
  maintenance_cost: {
    title: '维持成本是什么？',
    shortDesc: '需要多少精力来维持这个习惯？',
    longDesc: `维持成本是指养成习惯后，需要持续投入多少精力。

低维持成本：
• 习惯养成后自动运行
• 不需要每天提醒自己
• 像刷牙一样自然

高维持成本：
• 每天都需要意志力
• 容易中断
• 需要外部监督`,
    example: '每天喝水维持成本低，每天健身维持成本高',
    tip: '选择维持成本低的事，更容易坚持',
    scale: [
      { value: 1, label: '几乎不用管', desc: '设定后自动运行' },
      { value: 5, label: '需要关注', desc: '偶尔需要提醒自己' },
      { value: 10, label: '需要很大投入', desc: '每天都需要意志力' },
    ],
  },
  node_type: {
    title: '节点类型说明',
    types: [
      {
        type: 'ROOT',
        label: '核心目标',
        emoji: '🎯',
        desc: '你最想改变的大方向，比如"改善作息"、"提高效率"',
      },
      {
        type: 'GOAL',
        label: '子目标',
        emoji: '📌',
        desc: '分解出的小目标，比如"早睡早起"、"减少干扰"',
      },
      {
        type: 'ACTION',
        label: '具体行动',
        emoji: '✅',
        desc: '可以立即做的事，比如"睡前把手机放客厅"',
      },
    ],
  },
  score_grade: {
    title: '评分等级说明',
    grades: [
      {
        grade: 'EXCELLENT',
        label: '优选国策',
        emoji: '🌟',
        color: '#00ff88',
        desc: '阻力小、带动性强，值得优先做',
        criteria: '评分 > 15 且 阻力 ≤ 3',
      },
      {
        grade: 'HIGH_LEVERAGE',
        label: '高杠杆',
        emoji: '⚡',
        color: '#00f0ff',
        desc: '投入小、回报大',
        criteria: '带动性 ≥ 8 且 阻力 ≤ 5',
      },
      {
        grade: 'DEFENSIVE',
        label: '防御型',
        emoji: '🛡️',
        color: '#fbbf24',
        desc: '防止事情变坏',
        criteria: '影响力 < 0',
      },
      {
        grade: 'AGGRESSIVE',
        label: '进取型',
        emoji: '📈',
        color: '#a78bfa',
        desc: '主动改变现状',
        criteria: '影响力 > 0',
      },
    ],
  },
};

const FieldHelp = memo(function FieldHelp({ 
  field, 
  showDetailed = false,
  onClose 
}) {
  const [expanded, setExpanded] = useState(showDetailed);
  
  const content = HELP_CONTENT[field];
  if (!content) return null;

  return (
    <div className={`field-help ${expanded ? 'expanded' : ''}`}>
      {!expanded ? (
        <div className="help-preview">
          <div className="preview-icon">
            <Lightbulb size={14} />
          </div>
          <p className="preview-text">{content.shortDesc}</p>
          <button 
            className="expand-btn"
            onClick={() => setExpanded(true)}
          >
            了解更多
          </button>
        </div>
      ) : (
        <div className="help-detailed">
          <div className="help-header">
            <h4 className="help-title">
              <BookOpen size={16} />
              {content.title}
            </h4>
            {onClose && (
              <button className="close-btn" onClick={onClose}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className="help-body">
            <p className="help-desc">{content.longDesc}</p>

            {content.example && (
              <div className="help-example">
                <span className="example-label">举例：</span>
                <span className="example-text">{content.example}</span>
              </div>
            )}

            {content.tip && (
              <div className="help-tip">
                <Lightbulb size={14} />
                <span>{content.tip}</span>
              </div>
            )}

            {content.scale && (
              <div className="help-scale">
                <h5>评分参考：</h5>
                <div className="scale-items">
                  {content.scale.map((item) => (
                    <div key={item.value} className="scale-item">
                      <span className="scale-value">{item.value}</span>
                      <div className="scale-info">
                        <span className="scale-label">{item.label}</span>
                        <span className="scale-desc">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {content.types && (
              <div className="help-types">
                {content.types.map((type) => (
                  <div key={type.type} className="type-item">
                    <span className="type-emoji">{type.emoji}</span>
                    <div className="type-info">
                      <span className="type-label">{type.label}</span>
                      <span className="type-desc">{type.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {content.grades && (
              <div className="help-grades">
                {content.grades.map((grade) => (
                  <div 
                    key={grade.grade} 
                    className="grade-item"
                    style={{ '--grade-color': grade.color }}
                  >
                    <span className="grade-emoji">{grade.emoji}</span>
                    <div className="grade-info">
                      <span className="grade-label">{grade.label}</span>
                      <span className="grade-desc">{grade.desc}</span>
                      <span className="grade-criteria">{grade.criteria}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            className="collapse-btn"
            onClick={() => setExpanded(false)}
          >
            收起
          </button>
        </div>
      )}
    </div>
  );
});

export const HelpTooltip = memo(function HelpTooltip({ field }) {
  const content = HELP_CONTENT[field];
  if (!content) return null;

  return (
    <div className="help-tooltip">
      <div className="tooltip-icon">
        <HelpCircle size={14} />
      </div>
      <div className="tooltip-content">
        <p className="tooltip-text">{content.shortDesc}</p>
      </div>
    </div>
  );
});

export const QuickHelp = memo(function QuickHelp({ field }) {
  const content = HELP_CONTENT[field];
  if (!content) return null;

  return (
    <span className="quick-help">
      <HelpCircle size={12} />
      <span className="quick-help-text">{content.shortDesc}</span>
    </span>
  );
});

export const CollapsibleHelp = memo(function CollapsibleHelp({ field, defaultExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const content = HELP_CONTENT[field];
  if (!content) return null;

  return (
    <div className="collapsible-help">
      <button 
        className="collapsible-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="header-icon">
          <HelpCircle size={14} />
        </span>
        <span className="header-text">{content.title}</span>
        <span className="header-toggle">
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>
      
      {isExpanded && (
        <div className="collapsible-content">
          <FieldHelp field={field} showDetailed />
        </div>
      )}
    </div>
  );
});

export { HELP_CONTENT };

export default FieldHelp;

// 最后更新时间: 2026-02-21 19:15
// 编辑人: Trae AI
// 说明: 字段帮助提示组件，提供通俗易懂的概念解释
