/**
 * 国策模版库 - 基于知乎文章图片提取
 * 来源: https://www.zhihu.com/question/19888447/answer/1930799480401293785
 * 作者: edmond
 * 
 * 最后更新时间: 2026-02-23
 * 编辑人: Trae AI
 */

export const policyTemplatesFromImage = [
  // ==================== T1 农村包围城市 ====================
  {
    id: 'template-t1-emotional-cushion',
    name: '情绪气囊',
    icon: '🛡️',
    description: '建立情绪缓冲机制，防止情绪失控导致行为失范',
    category: '情绪管理',
    difficulty: '中等',
    tier: 'T1',
    group: '农村包围城市',
    tree: {
      id: 'root-emotional-cushion',
      name: '情绪气囊',
      description: '通过预设机制为情绪提供缓冲空间，避免冲动行为',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础情绪觉察' },
          { level: 1, description: '情绪缓冲机制' },
          { level: 2, description: '情绪转化能力' }
        ]
      },
      children: [
        {
          id: 'ec-1',
          name: '情绪识别',
          description: '在情绪波动时第一时间觉察并命名情绪',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '3',
              step: 1,
              unit: '秒',
              format: '{value}秒内识别情绪'
            }
          },
          children: [
            {
              id: 'ec-1-1',
              name: '情绪日记',
              description: '记录每日情绪波动及触发因素',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '1',
                  step: 1,
                  unit: '次',
                  format: '每日记录{value}次'
                }
              }
            }
          ]
        },
        {
          id: 'ec-2',
          name: '缓冲策略',
          description: '情绪激动时强制等待后再做决定',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '10',
              step: 5,
              unit: '分钟',
              format: '激动时等待{value}'
            }
          },
          children: [
            {
              id: 'ec-2-1',
              name: '深呼吸练习',
              description: '情绪激动时进行深呼吸平复',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '5',
                  step: 3,
                  unit: '次',
                  format: '深呼吸{value}'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-t1-energy-management',
    name: '能量管理',
    icon: '⚡',
    description: '科学管理精力，在最佳状态下做最重要的事',
    category: '精力管理',
    difficulty: '中等',
    tier: 'T1',
    group: '农村包围城市',
    tree: {
      id: 'root-energy-management',
      name: '能量管理',
      description: '识别个人精力规律，优化任务安排',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础能量觉察' },
          { level: 1, description: '能量优化配置' },
          { level: 2, description: '能量系统管理' }
        ]
      },
      children: [
        {
          id: 'em-1',
          name: '精力追踪',
          description: '记录不同时段的精力水平',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '3',
              step: 1,
              unit: '次',
              format: '每日记录{value}次'
            }
          },
          children: [
            {
              id: 'em-1-1',
              name: '黄金时间识别',
              description: '找出个人精力最佳的时段',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'custom',
                customEffects: [
                  { level: 0, description: '识别1个黄金时段' },
                  { level: 1, description: '识别2个黄金时段' },
                  { level: 2, description: '全天候优化' }
                ]
              }
            }
          ]
        },
        {
          id: 'em-2',
          name: '任务匹配',
          description: '高难度任务安排在精力最佳时段',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '1',
              step: 1,
              unit: '个',
              format: '每日{value}个重要任务'
            }
          },
          children: [
            {
              id: 'em-2-1',
              name: '吃青蛙',
              description: '每天先完成最难的任务',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'custom',
                customEffects: [
                  { level: 0, description: '每周3次' },
                  { level: 1, description: '每周5次' },
                  { level: 2, description: '每日执行' }
                ]
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-t1-full-strike',
    name: '全力一击',
    icon: '⚔️',
    description: '在关键时段集中全部精力完成核心任务',
    category: '专注力',
    difficulty: '较难',
    tier: 'T1',
    group: '农村包围城市',
    tree: {
      id: 'root-full-strike',
      name: '全力一击',
      description: '设定专注时段，排除干扰，全力投入',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础专注时段' },
          { level: 1, description: '深度专注' },
          { level: 2, description: '心流状态' }
        ]
      },
      children: [
        {
          id: 'fs-1',
          name: '专注仪式',
          description: '进入专注状态前的准备仪式',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '5',
              step: 2,
              unit: '分钟',
              format: '准备仪式{value}'
            }
          },
          children: [
            {
              id: 'fs-1-1',
              name: '环境整理',
              description: '整理桌面，准备所需物品',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '3',
                  step: 1,
                  unit: '分钟',
                  format: '整理{value}'
                }
              }
            }
          ]
        },
        {
          id: 'fs-2',
          name: '免打扰模式',
          description: '专注时段内关闭所有通知和干扰',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '25',
              step: 5,
              unit: '分钟',
              format: '专注{value}'
            }
          },
          children: [
            {
              id: 'fs-2-1',
              name: '手机隔离',
              description: '将手机放在视线之外',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'custom',
                customEffects: [
                  { level: 0, description: '静音模式' },
                  { level: 1, description: '放抽屉' },
                  { level: 2, description: '放另一个房间' }
                ]
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-t1-quick-cleanup',
    name: '快速打扫',
    icon: '🧹',
    description: '保持环境整洁，减少视觉干扰',
    category: '环境管理',
    difficulty: '简单',
    tier: 'T1',
    group: '农村包围城市',
    tree: {
      id: 'root-quick-cleanup',
      name: '快速打扫',
      description: '建立快速整理习惯，维持整洁环境',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础整理' },
          { level: 1, description: '定期打扫' },
          { level: 2, description: '极简环境' }
        ]
      },
      children: [
        {
          id: 'qc-1',
          name: '两分钟法则',
          description: '能在两分钟内完成的事立即做',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '2',
              step: 1,
              unit: '分钟',
              format: '{value}内完成'
            }
          },
          children: [
            {
              id: 'qc-1-1',
              name: '物品归位',
              description: '使用完物品立即放回原处',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'custom',
                customEffects: [
                  { level: 0, description: '重要物品归位' },
                  { level: 1, description: '常用物品归位' },
                  { level: 2, description: '所有物品归位' }
                ]
              }
            }
          ]
        },
        {
          id: 'qc-2',
          name: '每日整理',
          description: '每天固定时间进行环境整理',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '10',
              step: 5,
              unit: '分钟',
              format: '每日整理{value}'
            }
          },
          children: [
            {
              id: 'qc-2-1',
              name: '睡前复位',
              description: '睡前将环境恢复原状',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '5',
                  step: 3,
                  unit: '分钟',
                  format: '睡前{value}复位'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-t1-nip-in-bud',
    name: '防微杜渐',
    icon: '🔍',
    description: '在问题萌芽阶段及时干预，防止恶化',
    category: '预防机制',
    difficulty: '中等',
    tier: 'T1',
    group: '农村包围城市',
    tree: {
      id: 'root-nip-in-bud',
      name: '防微杜渐',
      description: '建立预警机制，及时发现问题苗头',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础觉察' },
          { level: 1, description: '预警系统' },
          { level: 2, description: '自动干预' }
        ]
      },
      children: [
        {
          id: 'nib-1',
          name: '滑坡识别',
          description: '识别行为滑坡的早期信号',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '3',
              step: 1,
              unit: '个',
              format: '识别{value}信号'
            }
          },
          children: [
            {
              id: 'nib-1-1',
              name: '触发点记录',
              description: '记录导致滑坡的触发因素',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '1',
                  step: 1,
                  unit: '次',
                  format: '记录{value}/周'
                }
              }
            }
          ]
        },
        {
          id: 'nib-2',
          name: '及时止损',
          description: '发现问题后立即采取纠正措施',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '5',
              step: 2,
              unit: '分钟',
              format: '{value}内响应'
            }
          },
          children: [
            {
              id: 'nib-2-1',
              name: '应急预案',
              description: '预设常见问题的应对方案',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '3',
                  step: 2,
                  unit: '个',
                  format: '准备{value}预案'
                }
              }
            }
          ]
        }
      ]
    }
  },

  // ==================== T2 作息调频组 ====================
  {
    id: 'template-t2-first-strike',
    name: '先发制人',
    icon: '🌅',
    description: '早起并立即执行重要任务，抢占先机',
    category: '作息管理',
    difficulty: '中等',
    tier: 'T2',
    group: '作息调频组',
    tree: {
      id: 'root-first-strike',
      name: '先发制人',
      description: '建立早起习惯，利用清晨高效时段',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础早起' },
          { level: 1, description: '早起+立即行动' },
          { level: 2, description: '黄金早晨' }
        ]
      },
      children: [
        {
          id: 'fs-1',
          name: '固定起床',
          description: '每天固定时间起床，包括周末',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '07:00',
              step: -15,
              unit: '时间',
              format: '{value}起床'
            }
          },
          children: [
            {
              id: 'fs-1-1',
              name: '闹钟策略',
              description: '将闹钟放在需要起床才能关掉的位置',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'custom',
                customEffects: [
                  { level: 0, description: '放床边' },
                  { level: 1, description: '放卧室外' },
                  { level: 2, description: '放客厅' }
                ]
              }
            }
          ]
        },
        {
          id: 'fs-2',
          name: '晨间仪式',
          description: '起床后立即执行预设的晨间流程',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '30',
              step: 15,
              unit: '分钟',
              format: '晨间仪式{value}'
            }
          },
          children: [
            {
              id: 'fs-2-1',
              name: '手机隔离',
              description: '起床后一段时间内不用手机',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '30',
                  step: 15,
                  unit: '分钟',
                  format: '起床后{value}禁手机'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-t2-curfew',
    name: '宵禁制度',
    icon: '🌙',
    description: '设定晚间行为限制，保证睡眠质量',
    category: '作息管理',
    difficulty: '中等',
    tier: 'T2',
    group: '作息调频组',
    tree: {
      id: 'root-curfew',
      name: '宵禁制度',
      description: '建立晚间行为边界，为睡眠做准备',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础宵禁' },
          { level: 1, description: '严格执行' },
          { level: 2, description: '完美作息' }
        ]
      },
      children: [
        {
          id: 'c-1',
          name: '固定就寝',
          description: '每天固定时间上床睡觉',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '23:00',
              step: -15,
              unit: '时间',
              format: '{value}就寝'
            }
          },
          children: [
            {
              id: 'c-1-1',
              name: '睡前准备',
              description: '睡前进行放松活动',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '30',
                  step: 15,
                  unit: '分钟',
                  format: '准备{value}'
                }
              }
            }
          ]
        },
        {
          id: 'c-2',
          name: '睡前复盘',
          description: '睡前回顾当天完成情况',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '5',
              step: 3,
              unit: '分钟',
              format: '复盘{value}'
            }
          },
          children: [
            {
              id: 'c-2-1',
              name: '明日规划',
              description: '提前规划第二天任务',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '3',
                  step: 2,
                  unit: '个',
                  format: '规划{value}任务'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-t2-digital-curfew',
    name: '电子宵禁',
    icon: '📵',
    description: '睡前限制电子设备使用',
    category: '数字健康',
    difficulty: '较难',
    tier: 'T2',
    group: '作息调频组',
    tree: {
      id: 'root-digital-curfew',
      name: '电子宵禁',
      description: '建立电子设备使用的时间边界',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础限制' },
          { level: 1, description: '严格限制' },
          { level: 2, description: '完全断联' }
        ]
      },
      children: [
        {
          id: 'dc-1',
          name: '屏幕时间限制',
          description: '睡前一定时间停止使用屏幕',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '30',
              step: 15,
              unit: '分钟',
              format: '睡前{value}禁屏'
            }
          },
          children: [
            {
              id: 'dc-1-1',
              name: '灰度模式',
              description: '晚间自动开启手机灰度显示',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '21:00',
                  step: -30,
                  unit: '时间',
                  format: '{value}开启灰度'
                }
              }
            }
          ]
        },
        {
          id: 'dc-2',
          name: '充电站策略',
          description: '睡前将手机放在固定充电位置',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'custom',
            customEffects: [
              { level: 0, description: '放床边充电' },
              { level: 1, description: '放卧室外' },
              { level: 2, description: '放客厅' }
            ]
          },
          children: [
            {
              id: 'dc-2-1',
              name: '替代活动',
              description: '准备不依赖电子设备的睡前活动',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '1',
                  step: 1,
                  unit: '个',
                  format: '准备{value}活动'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-t2-flexible-schedule',
    name: '作息弹性计划',
    icon: '📅',
    description: '根据情况灵活调整作息，保持可持续性',
    category: '作息管理',
    difficulty: '中等',
    tier: 'T2',
    group: '作息调频组',
    tree: {
      id: 'root-flexible-schedule',
      name: '作息弹性计划',
      description: '建立灵活的作息系统，适应不同情境',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础弹性' },
          { level: 1, description: '智能调整' },
          { level: 2, description: '完美平衡' }
        ]
      },
      children: [
        {
          id: 'fsch-1',
          name: '工作日模式',
          description: '工作日的标准作息安排',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '5',
              step: 0,
              unit: '天',
              format: '每周{value}天'
            }
          },
          children: [
            {
              id: 'fsch-1-1',
              name: '早起时间',
              description: '工作日起床时间',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '06:30',
                  step: -15,
                  unit: '时间',
                  format: '{value}起床'
                }
              }
            }
          ]
        },
        {
          id: 'fsch-2',
          name: '休息日模式',
          description: '休息日的弹性作息安排',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '1',
              step: 0.5,
              unit: '小时',
              format: '弹性{value}'
            }
          },
          children: [
            {
              id: 'fsch-2-1',
              name: '偏差控制',
              description: '休息日作息偏差不超过设定值',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '1',
                  step: 0.5,
                  unit: '小时',
                  format: '偏差≤{value}'
                }
              }
            }
          ]
        }
      ]
    }
  },

  // ==================== T3 专注核武组 ====================
  {
    id: 'template-t3-zen-mode',
    name: '禅定模式',
    icon: '🧘',
    description: '进入深度专注状态，屏蔽一切干扰',
    category: '专注力',
    difficulty: '较难',
    tier: 'T3',
    group: '专注核武组',
    tree: {
      id: 'root-zen-mode',
      name: '禅定模式',
      description: '创建完全无干扰的专注环境',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础禅定' },
          { level: 1, description: '深度禅定' },
          { level: 2, description: '心流禅定' }
        ]
      },
      children: [
        {
          id: 'zm-1',
          name: '环境隔离',
          description: '创造物理和心理上的隔离环境',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '1',
              step: 1,
              unit: '个',
              format: '隔离{value}干扰源'
            }
          },
          children: [
            {
              id: 'zm-1-1',
              name: '降噪措施',
              description: '使用降噪耳机或白噪音',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'custom',
                customEffects: [
                  { level: 0, description: '偶尔使用' },
                  { level: 1, description: '经常使用' },
                  { level: 2, description: '必须使用' }
                ]
              }
            }
          ]
        },
        {
          id: 'zm-2',
          name: '单任务模式',
          description: '一次只做一件事，禁止多任务',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '25',
              step: 5,
              unit: '分钟',
              format: '专注{value}'
            }
          },
          children: [
            {
              id: 'zm-2-1',
              name: '任务锁定',
              description: '禅定期间禁止切换任务',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'custom',
                customEffects: [
                  { level: 0, description: '自我约束' },
                  { level: 1, description: '工具辅助' },
                  { level: 2, description: '物理隔离' }
                ]
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-t3-sacred-seat',
    name: '神圣座位',
    icon: '🪑',
    description: '指定专门的学习/工作位置，建立条件反射',
    category: '环境管理',
    difficulty: '简单',
    tier: 'T3',
    group: '专注核武组',
    tree: {
      id: 'root-sacred-seat',
      name: '神圣座位',
      description: '建立特定位置与专注行为的强关联',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '1个神圣座位' },
          { level: 1, description: '2个神圣座位' },
          { level: 2, description: '3个神圣座位' }
        ]
      },
      children: [
        {
          id: 'ss-1',
          name: '位置定义',
          description: '明确指定神圣座位的物理位置',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'custom',
            customEffects: [
              { level: 0, description: '书桌' },
              { level: 1, description: '书桌+图书馆' },
              { level: 2, description: '多场景覆盖' }
            ]
          },
          children: [
            {
              id: 'ss-1-1',
              name: '座位准备',
              description: '使用前整理座位环境',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '2',
                  step: 1,
                  unit: '分钟',
                  format: '准备{value}'
                }
              }
            }
          ]
        },
        {
          id: 'ss-2',
          name: '行为绑定',
          description: '在神圣座位上只允许执行特定行为',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'custom',
            customEffects: [
              { level: 0, description: '禁止娱乐' },
              { level: 1, description: '只允许学习' },
              { level: 2, description: '只允许深度工作' }
            ]
          },
          children: [
            {
              id: 'ss-2-1',
              name: '违规惩罚',
              description: '违反规则时的自我惩罚机制',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '10',
                  step: 5,
                  unit: '分钟',
                  format: '惩罚{value}'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-t3-firepower',
    name: '火力覆盖',
    icon: '🔥',
    description: '在最佳时段集中处理高难度任务',
    category: '效率提升',
    difficulty: '中等',
    tier: 'T3',
    group: '专注核武组',
    tree: {
      id: 'root-firepower',
      name: '火力覆盖',
      description: '识别并利用个人黄金时段',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础覆盖' },
          { level: 1, description: '精准打击' },
          { level: 2, description: '饱和攻击' }
        ]
      },
      children: [
        {
          id: 'fc-1',
          name: '黄金时段识别',
          description: '找出个人精力最佳的时段',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '2',
              step: 1,
              unit: '周',
              format: '观察{value}'
            }
          },
          children: [
            {
              id: 'fc-1-1',
              name: '时段记录',
              description: '记录不同时段的专注度',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '3',
                  step: 1,
                  unit: '次',
                  format: '每日{value}次'
                }
              }
            }
          ]
        },
        {
          id: 'fc-2',
          name: '任务匹配',
          description: '将最难任务安排在黄金时段',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '1',
              step: 1,
              unit: '个',
              format: '黄金时段{value}任务'
            }
          },
          children: [
            {
              id: 'fc-2-1',
              name: '任务分级',
              description: '按难度对任务进行分类',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '3',
                  step: 1,
                  unit: '级',
                  format: '分{value}级'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-t3-timely-rain',
    name: '及时雨',
    icon: '🌧️',
    description: '在需要时及时提供帮助和资源',
    category: '支持系统',
    difficulty: '中等',
    tier: 'T3',
    group: '专注核武组',
    tree: {
      id: 'root-timely-rain',
      name: '及时雨',
      description: '建立快速响应的支持机制',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础支持' },
          { level: 1, description: '快速响应' },
          { level: 2, description: '预判需求' }
        ]
      },
      children: [
        {
          id: 'tr-1',
          name: '资源准备',
          description: '提前准备好可能需要的资源',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '3',
              step: 2,
              unit: '个',
              format: '准备{value}资源'
            }
          },
          children: [
            {
              id: 'tr-1-1',
              name: '工具清单',
              description: '列出常用工具和资源',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '5',
                  step: 3,
                  unit: '个',
                  format: '清单{value}项'
                }
              }
            }
          ]
        },
        {
          id: 'tr-2',
          name: '求助机制',
          description: '建立快速求助渠道',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '2',
              step: 1,
              unit: '个',
              format: '{value}求助渠道'
            }
          },
          children: [
            {
              id: 'tr-2-1',
              name: '响应时间',
              description: '设定求助响应时间目标',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '30',
                  step: 15,
                  unit: '分钟',
                  format: '{value}内响应'
                }
              }
            }
          ]
        }
      ]
    }
  },

  // ==================== T3 应用管理组 ====================
  {
    id: 'template-t3-room-of-time',
    name: '时光的房间',
    icon: '🏠',
    description: '为不同活动创建专门的空间或情境',
    category: '环境管理',
    difficulty: '中等',
    tier: 'T3',
    group: '应用管理组',
    tree: {
      id: 'root-room-of-time',
      name: '时光的房间',
      description: '通过空间分隔不同活动，减少干扰',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础分隔' },
          { level: 1, description: '清晰边界' },
          { level: 2, description: '完美空间' }
        ]
      },
      children: [
        {
          id: 'rot-1',
          name: '空间分区',
          description: '为不同活动分配专门区域',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '2',
              step: 1,
              unit: '个',
              format: '{value}功能区'
            }
          },
          children: [
            {
              id: 'rot-1-1',
              name: '工作区',
              description: '专门用于工作的区域',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'custom',
                customEffects: [
                  { level: 0, description: '临时工作区' },
                  { level: 1, description: '固定工作区' },
                  { level: 2, description: '优化工作区' }
                ]
              }
            }
          ]
        },
        {
          id: 'rot-2',
          name: '情境切换',
          description: '在不同活动间建立清晰的切换仪式',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '3',
              step: 2,
              unit: '分钟',
              format: '切换仪式{value}'
            }
          },
          children: [
            {
              id: 'rot-2-1',
              name: '过渡活动',
              description: '设计过渡性的活动帮助切换',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '1',
                  step: 1,
                  unit: '个',
                  format: '{value}过渡活动'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-t3-normal-mode',
    name: '普通模式',
    icon: '⚙️',
    description: '建立日常的标准工作模式',
    category: '习惯养成',
    difficulty: '简单',
    tier: 'T3',
    group: '应用管理组',
    tree: {
      id: 'root-normal-mode',
      name: '普通模式',
      description: '创建可重复的日常标准流程',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础流程' },
          { level: 1, description: '优化流程' },
          { level: 2, description: '自动化流程' }
        ]
      },
      children: [
        {
          id: 'nm-1',
          name: '标准流程',
          description: '定义日常的标准工作流程',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '3',
              step: 2,
              unit: '个',
              format: '标准流程{value}步'
            }
          },
          children: [
            {
              id: 'nm-1-1',
              name: '流程检查',
              description: '定期检查流程执行情况',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '1',
                  step: 1,
                  unit: '周',
                  format: '每周{value}次'
                }
              }
            }
          ]
        },
        {
          id: 'nm-2',
          name: '异常处理',
          description: '预设常见异常情况的处理方案',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '3',
              step: 2,
              unit: '个',
              format: '准备{value}预案'
            }
          },
          children: [
            {
              id: 'nm-2-1',
              name: '快速恢复',
              description: '设计快速回到正常状态的机制',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '5',
                  step: 3,
                  unit: '分钟',
                  format: '{value}内恢复'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-t3-first-blood',
    name: '一血概念',
    icon: '💉',
    description: '重视第一次成功，建立正向循环',
    category: '心理建设',
    difficulty: '中等',
    tier: 'T3',
    group: '应用管理组',
    tree: {
      id: 'root-first-blood',
      name: '一血概念',
      description: '通过首次成功建立信心和动力',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '重视首胜' },
          { level: 1, description: '庆祝成功' },
          { level: 2, description: '建立连胜' }
        ]
      },
      children: [
        {
          id: 'fb-1',
          name: '首胜设计',
          description: '设计容易获得首次成功的任务',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '1',
              step: 1,
              unit: '个',
              format: '每日{value}首胜'
            }
          },
          children: [
            {
              id: 'fb-1-1',
              name: '难度控制',
              description: '确保首胜任务足够简单',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '5',
                  step: 3,
                  unit: '分钟',
                  format: '首胜≤{value}'
                }
              }
            }
          ]
        },
        {
          id: 'fb-2',
          name: '连胜追踪',
          description: '记录连续成功的次数',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '3',
              step: 2,
              unit: '天',
              format: '目标{value}连胜'
            }
          },
          children: [
            {
              id: 'fb-2-1',
              name: '连胜奖励',
              description: '达到连胜目标时给予奖励',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '1',
                  step: 1,
                  unit: '个',
                  format: '{value}奖励'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-t3-blitzkrieg',
    name: '闪击战',
    icon: '⚡',
    description: '利用碎片时间快速完成任务',
    category: '效率提升',
    difficulty: '中等',
    tier: 'T3',
    group: '应用管理组',
    tree: {
      id: 'root-blitzkrieg',
      name: '闪击战',
      description: '识别并利用碎片时间',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础闪击' },
          { level: 1, description: '精准闪击' },
          { level: 2, description: '连环闪击' }
        ]
      },
      children: [
        {
          id: 'bk-1',
          name: '碎片识别',
          description: '识别日常生活中的碎片时间',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '3',
              step: 2,
              unit: '个',
              format: '识别{value}碎片'
            }
          },
          children: [
            {
              id: 'bk-1-1',
              name: '时间记录',
              description: '记录一天中的碎片时间',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '1',
                  step: 1,
                  unit: '天',
                  format: '记录{value}'
                }
              }
            }
          ]
        },
        {
          id: 'bk-2',
          name: '任务匹配',
          description: '为不同长度的碎片时间匹配任务',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '3',
              step: 2,
              unit: '个',
              format: '准备{value}任务'
            }
          },
          children: [
            {
              id: 'bk-2-1',
              name: '任务清单',
              description: '按时间长度分类的任务清单',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '5',
                  step: 3,
                  unit: '个',
                  format: '清单{value}项'
                }
              }
            }
          ]
        }
      ]
    }
  },

  // ==================== T3 晚间管理组 ====================
  {
    id: 'template-t3-curfew-time',
    name: '宵禁了',
    icon: '🌃',
    description: '严格执行晚间行为限制',
    category: '作息管理',
    difficulty: '较难',
    tier: 'T3',
    group: '晚间管理组',
    tree: {
      id: 'root-curfew-time',
      name: '宵禁了',
      description: '建立严格的晚间行为边界',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础宵禁' },
          { level: 1, description: '严格执行' },
          { level: 2, description: '完美宵禁' }
        ]
      },
      children: [
        {
          id: 'ct-1',
          name: '宵禁时间',
          description: '设定明确的宵禁开始时间',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '22:00',
              step: -30,
              unit: '时间',
              format: '{value}宵禁'
            }
          },
          children: [
            {
              id: 'ct-1-1',
              name: '提醒机制',
              description: '宵禁前设置提醒',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '15',
                  step: 5,
                  unit: '分钟',
                  format: '提前{value}提醒'
                }
              }
            }
          ]
        },
        {
          id: 'ct-2',
          name: '宵禁内容',
          description: '明确宵禁期间禁止的行为',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '3',
              step: 2,
              unit: '个',
              format: '禁止{value}行为'
            }
          },
          children: [
            {
              id: 'ct-2-1',
              name: '替代方案',
              description: '准备宵禁期间可以做的事',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '2',
                  step: 1,
                  unit: '个',
                  format: '准备{value}替代'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-t3-transparent-block',
    name: '透明阻止',
    icon: '🚫',
    description: '让阻碍行为变得可见且可度量',
    category: '行为设计',
    difficulty: '中等',
    tier: 'T3',
    group: '晚间管理组',
    tree: {
      id: 'root-transparent-block',
      name: '透明阻止',
      description: '通过可视化和数据化阻止不良行为',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础记录' },
          { level: 1, description: '可视化' },
          { level: 2, description: '自动阻止' }
        ]
      },
      children: [
        {
          id: 'tb-1',
          name: '行为记录',
          description: '记录不良行为的发生情况',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '1',
              step: 1,
              unit: '次',
              format: '记录每{value}次'
            }
          },
          children: [
            {
              id: 'tb-1-1',
              name: '触发分析',
              description: '分析不良行为的触发因素',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '3',
                  step: 2,
                  unit: '个',
                  format: '识别{value}触发点'
                }
              }
            }
          ]
        },
        {
          id: 'tb-2',
          name: '数据展示',
          description: '将行为数据可视化展示',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '1',
              step: 1,
              unit: '天',
              format: '每日{value}次'
            }
          },
          children: [
            {
              id: 'tb-2-1',
              name: '趋势分析',
              description: '分析行为变化趋势',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '7',
                  step: 7,
                  unit: '天',
                  format: '每周{value}分析'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-t3-space-construct',
    name: '空间构造',
    icon: '🏗️',
    description: '通过物理空间设计影响行为',
    category: '环境管理',
    difficulty: '中等',
    tier: 'T3',
    group: '晚间管理组',
    tree: {
      id: 'root-space-construct',
      name: '空间构造',
      description: '设计有利于目标行为的空间环境',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础布局' },
          { level: 1, description: '优化设计' },
          { level: 2, description: '完美空间' }
        ]
      },
      children: [
        {
          id: 'sc-1',
          name: '物品布局',
          description: '合理摆放物品以支持目标行为',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '3',
              step: 2,
              unit: '个',
              format: '优化{value}区域'
            }
          },
          children: [
            {
              id: 'sc-1-1',
              name: '视线管理',
              description: '控制视线范围内的物品',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '5',
                  step: 3,
                  unit: '件',
                  format: '视线内≤{value}'
                }
              }
            }
          ]
        },
        {
          id: 'sc-2',
          name: '动线设计',
          description: '优化空间内的移动路径',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '2',
              step: 1,
              unit: '步',
              format: '减少{value}步'
            }
          },
          children: [
            {
              id: 'sc-2-1',
              name: '障碍设置',
              description: '为不良行为设置物理障碍',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '1',
                  step: 1,
                  unit: '个',
                  format: '设置{value}障碍'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-t3-crystal-channel',
    name: '水晶通道',
    icon: '💎',
    description: '建立清晰的从当前状态到目标状态的过渡路径',
    category: '行为设计',
    difficulty: '较难',
    tier: 'T3',
    group: '晚间管理组',
    tree: {
      id: 'root-crystal-channel',
      name: '水晶通道',
      description: '设计平滑的状态转换机制',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础通道' },
          { level: 1, description: '优化通道' },
          { level: 2, description: '自动化' }
        ]
      },
      children: [
        {
          id: 'cc-1',
          name: '入口设计',
          description: '设计容易进入目标状态的入口',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '2',
              step: 1,
              unit: '分钟',
              format: '入口≤{value}'
            }
          },
          children: [
            {
              id: 'cc-1-1',
              name: '触发器',
              description: '设置进入目标状态的触发器',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '1',
                  step: 1,
                  unit: '个',
                  format: '设置{value}触发器'
                }
              }
            }
          ]
        },
        {
          id: 'cc-2',
          name: '路径优化',
          description: '优化从当前到目标的路径',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '3',
              step: 2,
              unit: '步',
              format: '路径{value}步'
            }
          },
          children: [
            {
              id: 'cc-2-1',
              name: '里程碑',
              description: '在路径上设置检查点',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '2',
                  step: 1,
                  unit: '个',
                  format: '设置{value}里程碑'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-t3-fast-channel',
    name: '快速通道',
    icon: '🚀',
    description: '建立快速进入工作状态的路径',
    category: '效率提升',
    difficulty: '中等',
    tier: 'T3',
    group: '晚间管理组',
    tree: {
      id: 'root-fast-channel',
      name: '快速通道',
      description: '最小化从决定行动到开始行动的时间',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础快速' },
          { level: 1, description: '即时启动' },
          { level: 2, description: '条件反射' }
        ]
      },
      children: [
        {
          id: 'fc-1',
          name: '启动准备',
          description: '提前准备好开始所需的一切',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '1',
              step: 1,
              unit: '分钟',
              format: '启动≤{value}'
            }
          },
          children: [
            {
              id: 'fc-1-1',
              name: '物品准备',
              description: '提前准备好所需物品',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '5',
                  step: 3,
                  unit: '件',
                  format: '准备{value}件'
                }
              }
            }
          ]
        },
        {
          id: 'fc-2',
          name: '阻力消除',
          description: '识别并消除启动阻力',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '3',
              step: 2,
              unit: '个',
              format: '消除{value}阻力'
            }
          },
          children: [
            {
              id: 'fc-2-1',
              name: '决策简化',
              description: '减少开始前的决策负担',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '1',
                  step: 1,
                  unit: '个',
                  format: '决策≤{value}'
                }
              }
            }
          ]
        }
      ]
    }
  },

  // ==================== T3 通知管理组 ====================
  {
    id: 'template-t3-risk-avoidance',
    name: '风险规避',
    icon: '⚠️',
    description: '识别并规避可能导致失控的情境',
    category: '预防机制',
    difficulty: '中等',
    tier: 'T3',
    group: '通知管理组',
    tree: {
      id: 'root-risk-avoidance',
      name: '风险规避',
      description: '建立风险识别和规避系统',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础规避' },
          { level: 1, description: '主动预防' },
          { level: 2, description: '系统免疫' }
        ]
      },
      children: [
        {
          id: 'ra-1',
          name: '风险识别',
          description: '识别个人的高风险情境',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '3',
              step: 2,
              unit: '个',
              format: '识别{value}风险'
            }
          },
          children: [
            {
              id: 'ra-1-1',
              name: '触发清单',
              description: '列出导致失控的常见触发因素',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '5',
                  step: 3,
                  unit: '个',
                  format: '清单{value}项'
                }
              }
            }
          ]
        },
        {
          id: 'ra-2',
          name: '规避策略',
          description: '制定针对不同风险的规避方案',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '2',
              step: 1,
              unit: '个',
              format: '准备{value}方案'
            }
          },
          children: [
            {
              id: 'ra-2-1',
              name: '应急预案',
              description: '万一遇到风险时的应对方案',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '3',
                  step: 2,
                  unit: '个',
                  format: '准备{value}预案'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-t3-phone-isolation',
    name: '手机物理隔离',
    icon: '📵',
    description: '通过物理手段隔离手机干扰',
    category: '数字健康',
    difficulty: '中等',
    tier: 'T3',
    group: '通知管理组',
    tree: {
      id: 'root-phone-isolation',
      name: '手机物理隔离',
      description: '将手机放在难以随手拿到的地方',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础隔离' },
          { level: 1, description: '严格隔离' },
          { level: 2, description: '完全隔离' }
        ]
      },
      children: [
        {
          id: 'pi-1',
          name: '隔离位置',
          description: '设定手机的固定存放位置',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'custom',
            customEffects: [
              { level: 0, description: '放桌上' },
              { level: 1, description: '放抽屉' },
              { level: 2, description: '放另一个房间' }
            ]
          },
          children: [
            {
              id: 'pi-1-1',
              name: '距离控制',
              description: '控制与手机的物理距离',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '2',
                  step: 1,
                  unit: '米',
                  format: '距离≥{value}米'
                }
              }
            }
          ]
        },
        {
          id: 'pi-2',
          name: '隔离时段',
          description: '设定需要隔离手机的时间段',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '2',
              step: 1,
              unit: '小时',
              format: '隔离{value}'
            }
          },
          children: [
            {
              id: 'pi-2-1',
              name: '隔离提醒',
              description: '隔离开始前和结束后的提醒',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '1',
                  step: 1,
                  unit: '次',
                  format: '提醒{value}'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-t3-decision-preposition',
    name: '决策前置',
    icon: '🎯',
    description: '提前做出决策，减少当下的决策负担',
    category: '决策优化',
    difficulty: '中等',
    tier: 'T3',
    group: '通知管理组',
    tree: {
      id: 'root-decision-preposition',
      name: '决策前置',
      description: '在清醒时预先决定，避免冲动决策',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础前置' },
          { level: 1, description: '系统前置' },
          { level: 2, description: '自动化' }
        ]
      },
      children: [
        {
          id: 'dp-1',
          name: '预设规则',
          description: '提前设定常见情境的应对规则',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '3',
              step: 2,
              unit: '个',
              format: '预设{value}规则'
            }
          },
          children: [
            {
              id: 'dp-1-1',
              name: '如果-那么',
              description: '使用如果-那么格式设定规则',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '5',
                  step: 3,
                  unit: '条',
                  format: '准备{value}条'
                }
              }
            }
          ]
        },
        {
          id: 'dp-2',
          name: '默认选项',
          description: '设定默认的优选选项',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '2',
              step: 1,
              unit: '个',
              format: '设定{value}默认'
            }
          },
          children: [
            {
              id: 'dp-2-1',
              name: '选项简化',
              description: '减少可选选项的数量',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '2',
                  step: 1,
                  unit: '个',
                  format: '选项≤{value}'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-t3-app-restriction',
    name: '应用限制',
    icon: '📱',
    description: '对特定应用设置使用限制',
    category: '数字健康',
    difficulty: '中等',
    tier: 'T3',
    group: '通知管理组',
    tree: {
      id: 'root-app-restriction',
      name: '应用限制',
      description: '通过技术手段限制应用使用',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础限制' },
          { level: 1, description: '严格限制' },
          { level: 2, description: '完全管控' }
        ]
      },
      children: [
        {
          id: 'ar-1',
          name: '时间限制',
          description: '为应用设置每日使用时长上限',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '30',
              step: 15,
              unit: '分钟',
              format: '每日≤{value}'
            }
          },
          children: [
            {
              id: 'ar-1-1',
              name: '时段限制',
              description: '限制特定时段的应用使用',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '2',
                  step: 1,
                  unit: '个',
                  format: '限制{value}时段'
                }
              }
            }
          ]
        },
        {
          id: 'ar-2',
          name: '应用分类',
          description: '将应用按优先级分类管理',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '3',
              step: 1,
              unit: '类',
              format: '分{value}类'
            }
          },
          children: [
            {
              id: 'ar-2-1',
              name: '白名单',
              description: '设定不受限制的必要应用',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '5',
                  step: 3,
                  unit: '个',
                  format: '白名单{value}个'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-t3-password-freeze',
    name: '免密管理',
    icon: '🔐',
    description: '通过增加操作成本来减少冲动使用',
    category: '行为设计',
    difficulty: '较难',
    tier: 'T3',
    group: '通知管理组',
    tree: {
      id: 'root-password-freeze',
      name: '免密管理',
      description: '移除便捷登录，增加使用门槛',
      status: 'active',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '基础门槛' },
          { level: 1, description: '增加成本' },
          { level: 2, description: '高门槛' }
        ]
      },
      children: [
        {
          id: 'pf-1',
          name: '密码保护',
          description: '为特定应用设置复杂密码',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '8',
              step: 4,
              unit: '位',
              format: '密码≥{value}位'
            }
          },
          children: [
            {
              id: 'pf-1-1',
              name: '密码记录',
              description: '将密码记录在不方便取用的地方',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'custom',
                customEffects: [
                  { level: 0, description: '记在本子' },
                  { level: 1, description: '锁在抽屉' },
                  { level: 2, description: '交给他人保管' }
                ]
              }
            }
          ]
        },
        {
          id: 'pf-2',
          name: '退出登录',
          description: '使用后主动退出账号登录',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'custom',
            customEffects: [
              { level: 0, description: '重要应用退出' },
              { level: 1, description: '常用应用退出' },
              { level: 2, description: '所有应用退出' }
            ]
          },
          children: [
            {
              id: 'pf-2-1',
              name: '自动退出',
              description: '设置应用自动退出时间',
              status: 'inactive',
              enhancement: 0,
              enhancementConfig: {
                mode: 'auto',
                autoConfig: {
                  baseValue: '5',
                  step: 5,
                  unit: '分钟',
                  format: '{value}后退出'
                }
              }
            }
          ]
        }
      ]
    }
  }
];

// 国策分类
export const policyCategoriesFromImage = [
  { id: 'all', name: '全部' },
  { id: 't1', name: 'T1 农村包围城市' },
  { id: 't2', name: 'T2 作息调频组' },
  { id: 't3-focus', name: 'T3 专注核武组' },
  { id: 't3-app', name: 'T3 应用管理组' },
  { id: 't3-evening', name: 'T3 晚间管理组' },
  { id: 't3-notification', name: 'T3 通知管理组' }
];

// 国策组定义
export const policyGroups = [
  {
    id: 't1',
    name: '农村包围城市',
    description: '基础国策组，建立基本的自制力和习惯',
    tier: 'T1',
    color: '#4CAF50'
  },
  {
    id: 't2',
    name: '作息调频组',
    description: '优化作息规律，建立稳定的生活节奏',
    tier: 'T2',
    color: '#2196F3'
  },
  {
    id: 't3-focus',
    name: '专注核武组',
    description: '提升专注力，建立深度工作状态',
    tier: 'T3',
    color: '#FF5722'
  },
  {
    id: 't3-app',
    name: '应用管理组',
    description: '管理应用使用，优化数字生活',
    tier: 'T3',
    color: '#9C27B0'
  },
  {
    id: 't3-evening',
    name: '晚间管理组',
    description: '管理晚间行为，保证睡眠质量',
    tier: 'T3',
    color: '#673AB7'
  },
  {
    id: 't3-notification',
    name: '通知管理组',
    description: '管理通知和干扰，保持专注',
    tier: 'T3',
    color: '#FF9800'
  }
];

export default policyTemplatesFromImage;
