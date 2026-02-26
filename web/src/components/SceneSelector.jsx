import React, { memo, useCallback } from 'react';
import { Zap, Moon, Target, Brain, Dumbbell, BookOpen, Users, Briefcase, Sparkles } from 'lucide-react';
import './SceneSelector.css';

const SCENES = [
  {
    id: 'procrastination',
    name: '拖延症',
    emoji: '⏰',
    icon: Zap,
    description: '总是把事情拖到最后',
    color: '#ff6b6b',
    yaml: `id: root
description: "克服拖延，提高执行力"
type: ROOT
resistance_score: 7
coupling_score: 8
maintenance_cost: 6
children:
  - id: goal_1
    description: "建立即时行动习惯"
    type: GOAL
    resistance_score: 6
    coupling_score: 7
    maintenance_cost: 5
    children:
      - id: action_1
        description: "5分钟法则：只做5分钟"
        type: ACTION
        resistance_score: 3
        coupling_score: 6
        maintenance_cost: 3
      - id: action_2
        description: "番茄工作法：25分钟专注"
        type: ACTION
        resistance_score: 4
        coupling_score: 8
        maintenance_cost: 4
      - id: action_3
        description: "每天完成3件最重要的事"
        type: ACTION
        resistance_score: 5
        coupling_score: 9
        maintenance_cost: 5
`,
  },
  {
    id: 'sleep',
    name: '熬夜问题',
    emoji: '🌙',
    icon: Moon,
    description: '晚上睡不着，早上起不来',
    color: '#a78bfa',
    yaml: `id: root
description: "改善睡眠质量，建立健康作息"
type: ROOT
resistance_score: 6
coupling_score: 9
maintenance_cost: 5
children:
  - id: goal_1
    description: "建立睡前仪式"
    type: GOAL
    resistance_score: 4
    coupling_score: 7
    maintenance_cost: 4
    children:
      - id: action_1
        description: "睡前1小时放下手机"
        type: ACTION
        resistance_score: 7
        coupling_score: 8
        maintenance_cost: 6
      - id: action_2
        description: "固定睡觉时间"
        type: ACTION
        resistance_score: 5
        coupling_score: 9
        maintenance_cost: 4
      - id: action_3
        description: "睡前阅读或冥想"
        type: ACTION
        resistance_score: 3
        coupling_score: 6
        maintenance_cost: 3
`,
  },
  {
    id: 'focus',
    name: '注意力分散',
    emoji: '🎯',
    icon: Target,
    description: '很难集中精力做一件事',
    color: '#00ff88',
    yaml: `id: root
description: "提升专注力，减少分心"
type: ROOT
resistance_score: 7
coupling_score: 7
maintenance_cost: 6
children:
  - id: goal_1
    description: "创造专注环境"
    type: GOAL
    resistance_score: 4
    coupling_score: 8
    maintenance_cost: 3
    children:
      - id: action_1
        description: "手机放另一个房间"
        type: ACTION
        resistance_score: 6
        coupling_score: 7
        maintenance_cost: 2
      - id: action_2
        description: "使用专注类App屏蔽干扰"
        type: ACTION
        resistance_score: 3
        coupling_score: 5
        maintenance_cost: 2
      - id: action_3
        description: "清理桌面，只留必要物品"
        type: ACTION
        resistance_score: 2
        coupling_score: 4
        maintenance_cost: 1
`,
  },
  {
    id: 'stress',
    name: '压力过大',
    emoji: '😰',
    icon: Brain,
    description: '感觉喘不过气来',
    color: '#fbbf24',
    yaml: `id: root
description: "缓解压力，找回内心平静"
type: ROOT
resistance_score: 5
coupling_score: 6
maintenance_cost: 5
children:
  - id: goal_1
    description: "建立减压习惯"
    type: GOAL
    resistance_score: 4
    coupling_score: 5
    maintenance_cost: 4
    children:
      - id: action_1
        description: "每天10分钟冥想"
        type: ACTION
        resistance_score: 4
        coupling_score: 6
        maintenance_cost: 3
      - id: action_2
        description: "定期运动释放压力"
        type: ACTION
        resistance_score: 5
        coupling_score: 8
        maintenance_cost: 5
      - id: action_3
        description: "写日记梳理情绪"
        type: ACTION
        resistance_score: 3
        coupling_score: 5
        maintenance_cost: 3
`,
  },
  {
    id: 'health',
    name: '健康问题',
    emoji: '💪',
    icon: Dumbbell,
    description: '想改善生活习惯',
    color: '#34d399',
    yaml: `id: root
description: "改善健康，建立良好生活习惯"
type: ROOT
resistance_score: 6
coupling_score: 9
maintenance_cost: 6
children:
  - id: goal_1
    description: "建立运动习惯"
    type: GOAL
    resistance_score: 5
    coupling_score: 8
    maintenance_cost: 5
    children:
      - id: action_1
        description: "每天步行30分钟"
        type: ACTION
        resistance_score: 3
        coupling_score: 7
        maintenance_cost: 3
      - id: action_2
        description: "每周运动3次"
        type: ACTION
        resistance_score: 6
        coupling_score: 8
        maintenance_cost: 6
      - id: action_3
        description: "多喝水，少喝饮料"
        type: ACTION
        resistance_score: 4
        coupling_score: 5
        maintenance_cost: 3
`,
  },
  {
    id: 'learning',
    name: '学习效率',
    emoji: '📚',
    icon: BookOpen,
    description: '想提高学习效率',
    color: '#60a5fa',
    yaml: `id: root
description: "提高学习效率，建立知识体系"
type: ROOT
resistance_score: 6
coupling_score: 7
maintenance_cost: 5
children:
  - id: goal_1
    description: "建立学习系统"
    type: GOAL
    resistance_score: 5
    coupling_score: 8
    maintenance_cost: 5
    children:
      - id: action_1
        description: "每天固定时间学习"
        type: ACTION
        resistance_score: 4
        coupling_score: 7
        maintenance_cost: 4
      - id: action_2
        description: "使用间隔重复记忆法"
        type: ACTION
        resistance_score: 5
        coupling_score: 6
        maintenance_cost: 4
      - id: action_3
        description: "输出倒逼输入：教别人"
        type: ACTION
        resistance_score: 6
        coupling_score: 9
        maintenance_cost: 5
`,
  },
  {
    id: 'social',
    name: '社交问题',
    emoji: '👥',
    icon: Users,
    description: '想改善人际关系',
    color: '#f472b6',
    yaml: `id: root
description: "改善人际关系，建立社交自信"
type: ROOT
resistance_score: 7
coupling_score: 6
maintenance_cost: 6
children:
  - id: goal_1
    description: "主动建立连接"
    type: GOAL
    resistance_score: 6
    coupling_score: 5
    maintenance_cost: 5
    children:
      - id: action_1
        description: "每周联系一个朋友"
        type: ACTION
        resistance_score: 4
        coupling_score: 4
        maintenance_cost: 3
      - id: action_2
        description: "参加一个兴趣小组"
        type: ACTION
        resistance_score: 7
        coupling_score: 6
        maintenance_cost: 5
      - id: action_3
        description: "学会倾听和表达"
        type: ACTION
        resistance_score: 5
        coupling_score: 7
        maintenance_cost: 4
`,
  },
  {
    id: 'work',
    name: '工作效率',
    emoji: '💼',
    icon: Briefcase,
    description: '想提高工作效率',
    color: '#818cf8',
    yaml: `id: root
description: "提高工作效率，减少无效加班"
type: ROOT
resistance_score: 5
coupling_score: 8
maintenance_cost: 5
children:
  - id: goal_1
    description: "优化工作流程"
    type: GOAL
    resistance_score: 4
    coupling_score: 7
    maintenance_cost: 4
    children:
      - id: action_1
        description: "每天规划3件重要事项"
        type: ACTION
        resistance_score: 3
        coupling_score: 8
        maintenance_cost: 3
      - id: action_2
        description: "批量处理邮件和消息"
        type: ACTION
        resistance_score: 2
        coupling_score: 5
        maintenance_cost: 2
      - id: action_3
        description: "学会说不，减少干扰"
        type: ACTION
        resistance_score: 6
        coupling_score: 6
        maintenance_cost: 4
`,
  },
];

const SceneSelector = memo(function SceneSelector({ onSelect, onClose }) {
  const handleSelect = useCallback((scene) => {
    onSelect(scene.yaml);
    onClose?.();
  }, [onSelect, onClose]);

  return (
    <div className="scene-selector">
      <div className="selector-header">
        <h2>
          <Sparkles size={20} />
          选择你的困扰
        </h2>
        <p>点击一个场景，快速开始构建你的国策树</p>
      </div>

      <div className="scenes-grid">
        {SCENES.map((scene) => {
          return (
            <button
              key={scene.id}
              className="scene-card"
              onClick={() => handleSelect(scene)}
              style={{ '--scene-color': scene.color }}
            >
              <div className="scene-emoji">{scene.emoji}</div>
              <div className="scene-info">
                <h3 className="scene-name">{scene.name}</h3>
                <p className="scene-desc">{scene.description}</p>
              </div>
              <div className="scene-arrow">→</div>
            </button>
          );
        })}
      </div>

      <div className="selector-footer">
        <p>没有找到你的困扰？</p>
        <button className="custom-btn" onClick={() => onSelect(null)}>
          自己创建一个新的
        </button>
      </div>
    </div>
  );
});

export default SceneSelector;

export { SCENES };

// 最后更新时间: 2026-02-21 18:15
// 编辑人: Trae AI
// 说明: 场景快速选择组件，一键加载预设模板
