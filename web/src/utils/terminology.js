export const TERMINOLOGY = {
  coupling_score: {
    technical: '耦合度',
    friendly: '会带动其他事吗？',
    shortLabel: '带动性',
    description: '做这件事会不会带动其他事情一起完成？',
    example: '例如：早起可能会让你有时间吃早餐、运动、读书...',
    tooltip: '有些行为像多米诺骨牌，做一个会带动很多个',
  },
  resistance_score: {
    technical: '阻力',
    friendly: '开始有多难？',
    shortLabel: '难度',
    description: '开始做这件事有多困难？',
    example: '1分 = 几乎不用努力就能开始，10分 = 需要很大意志力',
    tooltip: '越难开始的事，阻力越大',
  },
  maintenance_cost: {
    technical: '维护成本',
    friendly: '需要多少精力维持？',
    shortLabel: '维持成本',
    description: '需要多少精力来维持这个习惯？',
    example: '1分 = 设定后自动运行，10分 = 每天都需要意志力',
    tooltip: '有些习惯养成后就自然了，有些需要持续努力',
  },
  impact: {
    technical: '影响力',
    friendly: '有多大影响？',
    shortLabel: '影响',
    description: '这件事对你的生活有多大影响？',
    example: '正面影响会让生活变好，负面影响会让生活变差',
    tooltip: '影响力可以是正面的也可以是负面的',
  },
  node_type: {
    ROOT: {
      technical: '根节点',
      friendly: '核心目标',
      description: '你最想改变的大方向',
      emoji: '🎯',
    },
    GOAL: {
      technical: '目标节点',
      friendly: '子目标',
      description: '分解出的小目标',
      emoji: '📌',
    },
    ACTION: {
      technical: '行动节点',
      friendly: '具体行动',
      description: '可以立即做的事',
      emoji: '✅',
    },
  },
  score_grade: {
    EXCELLENT: {
      technical: '优选国策',
      friendly: '强烈推荐',
      description: '阻力小、带动性强，值得优先做',
      emoji: '🌟',
      color: '#00ff88',
    },
    HIGH_LEVERAGE: {
      technical: '高杠杆',
      friendly: '很划算',
      description: '投入小、回报大',
      emoji: '⚡',
      color: '#00f0ff',
    },
    DEFENSIVE: {
      technical: '防御型',
      friendly: '保护性',
      description: '防止事情变坏',
      emoji: '🛡️',
      color: '#fbbf24',
    },
    AGGRESSIVE: {
      technical: '进取型',
      friendly: '突破性',
      description: '主动改变现状',
      emoji: '📈',
      color: '#a78bfa',
    },
  },
};

export const getFriendlyLabel = (field) => {
  return TERMINOLOGY[field]?.friendly || field;
};

export const getTechnicalLabel = (field) => {
  return TERMINOLOGY[field]?.technical || field;
};

export const getDescription = (field) => {
  return TERMINOLOGY[field]?.description || '';
};

export const getExample = (field) => {
  return TERMINOLOGY[field]?.example || '';
};

export const getTooltip = (field) => {
  return TERMINOLOGY[field]?.tooltip || '';
};

export const getNodeTypeInfo = (type) => {
  return TERMINOLOGY.node_type[type] || {
    technical: type,
    friendly: type,
    description: '',
    emoji: '📝',
  };
};

export const getScoreGradeInfo = (grade) => {
  return TERMINOLOGY.score_grade[grade] || {
    technical: grade,
    friendly: grade,
    description: '',
    emoji: '📊',
    color: '#888888',
  };
};

export const SLIDER_LABELS = {
  coupling_score: {
    1: '完全独立',
    2: '几乎不影响',
    3: '影响一点点',
    4: '有一些影响',
    5: '中等影响',
    6: '影响挺多',
    7: '影响很多',
    8: '会带动不少',
    9: '会带动很多',
    10: '会带动非常多',
  },
  resistance_score: {
    1: '非常容易',
    2: '很容易',
    3: '比较容易',
    4: '有点难',
    5: '中等难度',
    6: '有点难',
    7: '比较难',
    8: '很难',
    9: '非常难',
    10: '极其困难',
  },
  maintenance_cost: {
    1: '几乎不用管',
    2: '偶尔想想',
    3: '偶尔提醒自己',
    4: '需要一些关注',
    5: '需要持续关注',
    6: '需要持续努力',
    7: '需要很多努力',
    8: '需要很大投入',
    9: '需要极大投入',
    10: '几乎耗尽精力',
  },
};

export const getSliderLabel = (field, value) => {
  return SLIDER_LABELS[field]?.[value] || `${value}`;
};

export default TERMINOLOGY;

// 最后更新时间: 2026-02-21 18:30
// 编辑人: Trae AI
// 说明: 术语映射配置，将专业术语转换为通俗易懂的语言
