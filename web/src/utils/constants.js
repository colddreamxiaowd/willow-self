/**
 * 项目常量定义
 * 集中管理所有常量，便于维护和测试
 */

// 默认 YAML 内容
export const DEFAULT_YAML = `id: root
description: "我的生活目标"
type: ROOT
resistance_score: 5
coupling_score: 5
maintenance_cost: 5
children:
  - id: health
    description: "保持身体健康"
    type: GOAL
    resistance_score: 3
    coupling_score: 8
    maintenance_cost: 4
    children:
      - id: exercise
        description: "每周运动3次"
        type: ACTION
        resistance_score: 4
        coupling_score: 7
        maintenance_cost: 3
      - id: sleep
        description: "保证7小时睡眠"
        type: ACTION
        resistance_score: 5
        coupling_score: 9
        maintenance_cost: 2
  - id: career
    description: "职业发展"
    type: GOAL
    resistance_score: 6
    coupling_score: 6
    maintenance_cost: 5
    children:
      - id: skills
        description: "学习新技能"
        type: ACTION
        resistance_score: 3
        coupling_score: 7
        maintenance_cost: 4
      - id: network
        description: "扩展人脉"
        type: ACTION
        resistance_score: 7
        coupling_score: 5
        maintenance_cost: 3
`;

// 心理健康关键词（用于检测敏感内容）
export const MENTAL_HEALTH_KEYWORDS = [
  '自杀', '自残', '想死', '活不下去', '绝望', '抑郁', '焦虑症',
  '精神崩溃', '心理崩溃', '无法呼吸', '胸闷心悸'
];

// 免责声明
export const DISCLAIMER = `
⚠️ 重要免责声明

PolicyTree Generator 不是医疗工具，不能替代专业心理治疗或医学建议。
如果您正在经历严重的心理困扰，请寻求专业帮助。

全国心理援助热线：400-161-9995
北京心理危机研究与干预中心：010-82951332
`;

// 应用版本
export const APP_VERSION = '0.1.1';

// 运行时模式配置
export const RUNTIME_MODE = {
  TRAINING: 'training',
  RSIP: 'rsip'
};

export const RUNTIME_MODE_STORAGE_KEY = 'policytree_runtime_mode';

export function getRuntimeMode() {
  try {
    const saved = localStorage.getItem(RUNTIME_MODE_STORAGE_KEY);
    return saved === RUNTIME_MODE.RSIP ? RUNTIME_MODE.RSIP : RUNTIME_MODE.TRAINING;
  } catch {
    return RUNTIME_MODE.TRAINING;
  }
}

export function setRuntimeMode(nextMode) {
  const current = getRuntimeMode();
  const resolved = current === RUNTIME_MODE.RSIP ? RUNTIME_MODE.RSIP : nextMode;
  try {
    localStorage.setItem(RUNTIME_MODE_STORAGE_KEY, resolved);
  } catch {
    // ignore
  }
  return resolved;
}

// 最后更新时间: 2026-02-23 15:00
// 编辑人: Trae AI
// 说明: 添加 RSIP 运行时模式配置，配合国策Brainstorm功能
