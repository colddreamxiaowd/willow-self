// 国策模板 Brainstorm 数据
// 基于 RSIP (递归稳态迭代协议) 方法论设计

export const policyPrinciples = [
  '零敲牛皮糖：从鸡毛蒜皮的小国策开始，能拆就拆',
  '农村包围城市：先解决简单问题，让难题自然变简单',
  '下必为例：允许一次 = 永远允许，慎重设定边界',
  '有效干预节点：在自由意志可干预的位置设置规则',
  '胜于易胜：永远不要奢求一蹴而就，用小确胜积累',
  '穿越牛熊：国策要在最糟糕的一天也能轻松存活',
  '杠杆思维：四两拨千斤，用最小成本撬动最大改变',
  '递归回溯：失败了就悔棋重来，直到找到最优路径'
];

export const brainstormCategories = [
  { id: 'all', name: '全部', icon: '🌟' },
  { id: 'foundation', name: '基础国策', icon: '🏠' },
  { id: 'sleep', name: '睡眠作息', icon: '😴' },
  { id: 'digital', name: '数字健康', icon: '📱' },
  { id: 'morning', name: '晨间仪式', icon: '🌅' },
  { id: 'focus', name: '专注工作', icon: '🎯' },
  { id: 'evening', name: '晚间复盘', icon: '🌙' },
  { id: 'emergency', name: '应急机制', icon: '🛡️' }
];

export const brainstormTemplates = [
  // ========== 基础国策 ==========
  {
    id: 'wash-dishes',
    name: '饭后洗碗',
    icon: '🍽️',
    description: '在家吃完饭后必须尽快洗碗，避免颓废状态蔓延',
    category: 'foundation',
    difficulty: 'easy',
    leverage: 5,
    recommended: true,
    tags: ['基础', '家务', '即时'],
    coreIdea: '这是作者的一号根国策。看似鸡毛蒜皮，却能切实避免一个更大的颓废状态。饭后立即洗碗，象征着不拖延、不积累的生活态度，是整个国策树的基石。',
    rules: [
      '在家吃完饭后，必须立即洗碗',
      '不能将碗碟留在水槽中超过30分钟',
      '如果太累，至少将碗碟放入洗碗机或浸泡',
      '遵循下必为例原则：如果这次允许拖延，以后每次都可以拖延'
    ],
    successCriteria: '连续7天，每次饭后30分钟内完成洗碗',
    traps: [
      '这次特殊，下次再洗 - 这是破窗效应的开始',
      '先放着，等会儿一起洗 - 等会儿往往不会来',
      '太累了，明天再洗 - 明天会有明天的碗'
    ],
    applicableScenarios: '适合作为国策树的根节点，尤其适用于容易拖延、生活秩序混乱的人'
  },
  {
    id: 'shower-after-home',
    name: '回家洗澡',
    icon: '🚿',
    description: '回家15分钟内必须洗澡，切换状态',
    category: 'foundation',
    difficulty: 'easy',
    leverage: 4,
    recommended: true,
    tags: ['基础', '状态切换', '即时'],
    coreIdea: '洗澡是一种强力的状态切换仪式。回家后立即洗澡，可以将外出状态彻底切换为居家状态，避免躺在沙发上刷手机的颓废陷阱。',
    rules: [
      '进家门后15分钟内必须开始洗澡',
      '洗澡前不得坐下或拿起手机',
      '可以设置手机提醒或闹钟',
      '如果有人在，可以先打招呼，但必须在15分钟内开始'
    ],
    successCriteria: '连续7天，回家15分钟内开始洗澡',
    traps: [
      '先坐一会儿再洗 - 坐下去就起不来了',
      '等看完这个消息 - 一个消息变成两个小时',
      '今天不热，不用洗 - 洗澡的目的不只是清洁'
    ],
    applicableScenarios: '适合容易回家后躺在沙发上玩手机、难以开始晚间活动的人'
  },
  {
    id: 'no-phone-sofa',
    name: '沙发禁机',
    icon: '🛋️',
    description: '不在沙发上使用手机，打破颓废循环',
    category: 'foundation',
    difficulty: 'medium',
    leverage: 5,
    recommended: true,
    tags: ['基础', '边界', '习惯'],
    coreIdea: '沙发+手机=时间黑洞。这个国策切断了躺沙发→刷手机→更不想动→继续刷的颓废循环，是改变居家状态的关键节点。',
    rules: [
      '沙发上禁止使用手机',
      '想玩手机必须离开沙发',
      '可以在沙发上阅读、冥想、休息',
      '如果违规，遵循下必为例原则'
    ],
    successCriteria: '连续14天，沙发上不使用手机',
    traps: [
      '就看一下消息 - 消息会引出更多内容',
      '坐着也算沙发吗 - 不要寻找漏洞',
      '沙发上的平板可以吗 - 转移注意力不是解决方案'
    ],
    applicableScenarios: '适合容易在沙发上浪费时间、难以自拔的人'
  },

  // ========== 睡眠作息 ==========
  {
    id: 'first-strike',
    name: '先发制人',
    icon: '⚡',
    description: '起床后30分钟内禁用手机，激活一天状态',
    category: 'sleep',
    difficulty: 'easy',
    leverage: 5,
    recommended: true,
    tags: ['早晨', '手机', '启动'],
    coreIdea: '一日之计在于晨。起床后的行为奠定了一天的基调。起床后立即接触手机，会让大脑进入被动接收模式；而先做正事，则会让大脑进入主动创造模式。',
    rules: [
      '无论几点起床，起床后30分钟内禁止使用手机',
      '手机可以放在另一个房间或飞行模式',
      '这段时间只允许做正事：洗漱、整理、早餐、看邮件',
      '可以设置手机自动解锁时间'
    ],
    successCriteria: '连续7天，起床后30分钟内不碰手机',
    traps: [
      '就看一眼时间 - 时间会引出通知',
      '闹钟在手机上 - 用传统闹钟或智能手表',
      '有人找我怎么办 - 真正的急事会打电话'
    ],
    applicableScenarios: '适合早晨容易沉迷手机、导致一天拖延的人'
  },
  {
    id: 'night-falls',
    name: '夜幕降临',
    icon: '🌆',
    description: '23:00后手机屏幕自动调为黑白模式',
    category: 'sleep',
    difficulty: 'easy',
    leverage: 3,
    recommended: true,
    tags: ['晚间', '被动', '视觉'],
    coreIdea: '这是一个纯被动的国策，维护成本几乎为零。黑白屏幕会降低手机的视觉吸引力，减少多巴胺刺激，让大脑自然产生困意。',
    rules: [
      '设置手机23:00自动进入黑白模式',
      '设置手机7:00自动恢复彩色模式',
      '不要手动关闭黑白模式',
      '可以设置例外应用（如相机）'
    ],
    successCriteria: '设置成功即可，无需主动维护',
    traps: [
      '手动关闭黑白模式 - 设置后就不要碰',
      '寻找恢复彩色的方法 - 信任这个机制'
    ],
    applicableScenarios: '适合所有想减少晚间手机使用的人，尤其是容易刷手机到深夜的人'
  },
  {
    id: 'stand-to-play',
    name: '预备仪式',
    icon: '🧍',
    description: '23:00后可以玩手机，但只能站着玩',
    category: 'sleep',
    difficulty: 'medium',
    leverage: 4,
    recommended: false,
    tags: ['晚间', '过渡', '身体'],
    coreIdea: '从躺着玩手机到不玩手机很难，但从躺着玩到站着玩很容易，从站着玩到不玩也很容易。这是一个过渡性的国策，降低改变难度。',
    rules: [
      '23:00后想玩手机，必须站起来玩',
      '可以走动、站立，但不能坐下或躺下',
      '站累了自然就想放下手机了',
      '这是过渡国策，最终目标是23:30后不用手机'
    ],
    successCriteria: '连续7天，23:00后玩手机时保持站立',
    traps: [
      '靠着墙也算站 - 要真正站立',
      '坐着但手机举高 - 不要欺骗自己',
      '站太久导致身体不适 - 这是信号，该放下手机了'
    ],
    applicableScenarios: '适合难以直接戒断晚间手机使用的人，作为过渡策略'
  },
  {
    id: 'digital-curfew',
    name: '电子宵禁',
    icon: '🌙',
    description: '23:30后不得使用社交媒体和短视频App',
    category: 'sleep',
    difficulty: 'medium',
    leverage: 4,
    recommended: false,
    tags: ['晚间', '限制', '应用'],
    coreIdea: '明确的时间边界比模糊的早点睡更有效。23:30是一个合理的 cutoff 时间，给大脑留出30分钟的冷却期，为入睡做准备。',
    rules: [
      '23:30后禁止使用小红书、抖音、微博等App',
      '可以使用手机进行阅读、冥想、设置闹钟',
      '可以使用系统自带的屏幕使用时间限制功能',
      '如果必须使用，遵循下必为例原则'
    ],
    successCriteria: '连续14天，23:30后不使用限制类App',
    traps: [
      '就看一分钟 - 一分钟会变成一个多小时',
      '用网页版不算 - 不要寻找漏洞',
      '今天特殊 - 特殊一次就会特殊无数次'
    ],
    applicableScenarios: '适合容易刷手机到深夜、影响睡眠质量的人'
  },
  {
    id: 'sleep-reserve',
    name: '作息储备计划',
    icon: '💤',
    description: '可强化升级的作息国策，逐步提前睡眠时间',
    category: 'sleep',
    difficulty: 'hard',
    leverage: 5,
    recommended: false,
    tags: ['睡眠', '进阶', '可升级'],
    coreIdea: '这是一个可进阶的国策，通过储备冗余来保护基础节点。即使某次不得不晚睡，也可以释放储备，退回到+0状态，而不至于让整个作息节奏崩掉。',
    rules: [
      '基础(+0)：8:30起床',
      '强化+1：22:45睡/7:45起',
      '强化+2：22:40睡/7:40起',
      '每升一级，起床时间和宵禁时间均提前15分钟',
      '遇到特殊情况可以释放储备，退回到+0'
    ],
    successCriteria: '稳定维持在当前强化等级7天以上',
    upgradePath: [
      '+0：8:30起床，无强制就寝时间',
      '+1：7:45起床，22:45电子宵禁',
      '+2：7:30起床，22:30电子宵禁',
      '+3：7:15起床，22:15电子宵禁'
    ],
    traps: [
      '一开始就追求高等级 - 从+0开始，稳扎稳打',
      '失败后放弃整个国策 - 释放储备是设计的一部分',
      '忽视其他配套国策 - 需要先发制人等国策配合'
    ],
    applicableScenarios: '适合希望系统改善作息、愿意长期投入的人'
  },

  // ========== 数字健康 ==========
  {
    id: 'no-phone-bedroom',
    name: '卧室禁机',
    icon: '🚫',
    description: '不带手机进卧室，从根本上解决睡前刷手机',
    category: 'digital',
    difficulty: 'medium',
    leverage: 5,
    recommended: true,
    tags: ['睡眠', '边界', '环境'],
    coreIdea: '这是解决睡前刷手机问题的最优解。与其躺在床上忍着不刷，不如从一开始就不带手机进卧室。这是典型的有效干预节点策略。',
    rules: [
      '睡前将手机放在卧室外充电',
      '使用传统闹钟或智能手表作为闹钟',
      '卧室只保留阅读器、纸质书等低刺激物品',
      '如果必须使用，遵循下必为例原则'
    ],
    successCriteria: '连续14天，手机不在卧室内过夜',
    traps: [
      '闹钟在手机上 - 准备替代方案',
      '万一有人找我 - 真正的急事会打电话',
      '睡前需要听音乐 - 使用专用播放器或智能音箱'
    ],
    applicableScenarios: '适合睡前必刷手机、影响睡眠质量的人'
  },
  {
    id: 'app-limits',
    name: '应用限额',
    icon: '⏱️',
    description: '为社交媒体设置每日使用时间限制',
    category: 'digital',
    difficulty: 'easy',
    leverage: 3,
    recommended: false,
    tags: ['限制', '被动', '时间'],
    coreIdea: '利用系统自带的屏幕使用时间功能，为最容易沉迷的App设置硬性限制。这是一个被动国策，一旦设置好，维护成本极低。',
    rules: [
      '为小红书、抖音、微博等App设置每日30分钟限额',
      '限额用尽后，当天无法继续使用（除非主动解除）',
      '不要频繁调整限额',
      '可以设置忽略限额密码，增加使用门槛'
    ],
    successCriteria: '设置成功，连续7天不主动解除限额',
    traps: [
      '频繁调整限额 - 设置后至少坚持一周',
      '寻找解除限额的方法 - 增加使用门槛',
      '今天特殊 - 特殊一次就会特殊无数次'
    ],
    applicableScenarios: '适合所有想减少社交媒体使用时间的人'
  },
  {
    id: 'notification-clean',
    name: '通知清理',
    icon: '🔕',
    description: '关闭非必要通知，减少干扰',
    category: 'digital',
    difficulty: 'easy',
    leverage: 4,
    recommended: false,
    tags: ['被动', '专注', '干扰'],
    coreIdea: '每一次通知都是对注意力的打断。关闭非必要通知，可以大幅减少被动分心的次数，提升专注力和生活质量。',
    rules: [
      '关闭所有营销类、推广类通知',
      '只保留真正重要的通知（电话、短信、工作）',
      '社交媒体通知全部关闭',
      '定期检查和清理新安装App的通知权限'
    ],
    successCriteria: '设置成功，通知数量减少80%以上',
    traps: [
      '担心错过重要信息 - 真正重要的信息会打电话',
      '保留可能有用的通知 - 宁可错过，不要打扰',
      '新App默认开启通知 - 养成检查权限的习惯'
    ],
    applicableScenarios: '适合容易被通知分心、难以保持专注的人'
  },

  // ========== 晨间仪式 ==========
  {
    id: 'morning-light',
    name: '光线唤醒',
    icon: '☀️',
    description: '起床后立即拉开窗帘，让自然光进入',
    category: 'morning',
    difficulty: 'easy',
    leverage: 3,
    recommended: false,
    tags: ['早晨', '光线', '生理'],
    coreIdea: '自然光可以抑制褪黑素分泌，帮助身体快速清醒。这是一个简单但有效的生理调节国策，为一天的良好状态打下基础。',
    rules: [
      '起床后5分钟内拉开窗帘或走出室外',
      '让自然光照射面部至少5分钟',
      '阴天也要执行，自然光强度远高于室内灯光',
      '可以配合简单的伸展运动'
    ],
    successCriteria: '连续7天，起床后5分钟内接触自然光',
    traps: [
      '今天阴天，没用 - 阴天也有自然光',
      '先洗漱完再说 - 顺序很重要',
      '冬天太冷不想开窗 - 可以站在窗边'
    ],
    applicableScenarios: '适合早晨难以清醒、容易昏昏沉沉的人'
  },
  {
    id: 'morning-exercise',
    name: '晨间运动',
    icon: '🏃',
    description: '起床后进行10分钟简单运动',
    category: 'morning',
    difficulty: 'medium',
    leverage: 4,
    recommended: false,
    tags: ['早晨', '身体', '激活'],
    coreIdea: '早晨的身体活动可以快速提升心率和血液循环，帮助大脑进入活跃状态。不需要高强度，简单的伸展或快走即可。',
    rules: [
      '起床后进行10分钟简单运动',
      '可以是伸展、瑜伽、快走、跳绳等',
      '运动前不要看手机',
      '强度以微微出汗为宜'
    ],
    successCriteria: '连续7天，早晨完成10分钟运动',
    traps: [
      '追求高强度 - 简单运动即可',
      '今天没时间 - 10分钟总能挤出来',
      '运动前看手机 - 会打乱整个早晨节奏'
    ],
    applicableScenarios: '适合早晨状态低迷、需要快速激活身体的人'
  },

  // ========== 专注工作 ==========
  {
    id: 'sacred-seat',
    name: '神圣座位',
    icon: '🪑',
    description: '指定专门的工作/学习位置，建立环境锚点',
    category: 'focus',
    difficulty: 'medium',
    leverage: 4,
    recommended: true,
    tags: ['专注', '环境', '仪式'],
    coreIdea: '神圣座位原理：指定一个特定的位置作为神圣座位，一旦坐上去就必须专注工作。通过环境锚点，建立强烈的条件反射。',
    rules: [
      '指定一个特定的座位/位置为神圣座位',
      '坐在这个位置上时，必须专注工作或学习',
      '不专注时，必须离开这个座位',
      '可以设置多个神圣座位（如书桌、图书馆座位）'
    ],
    successCriteria: '连续14天，在神圣座位上保持专注',
    traps: [
      '坐在这里也可以休息 - 破坏神圣性',
      '神圣座位太舒适 - 适度舒适即可',
      '没有明确的开始仪式 - 可以配合深呼吸或戴耳机'
    ],
    applicableScenarios: '适合难以开始工作、需要环境暗示的人'
  },
  {
    id: 'pomodoro',
    name: '番茄工作法',
    icon: '🍅',
    description: '25分钟工作+5分钟休息的循环',
    category: 'focus',
    difficulty: 'easy',
    leverage: 3,
    recommended: false,
    tags: ['专注', '时间', '节奏'],
    coreIdea: '番茄工作法的核心是将整个专注时段的沉没成本打包、捆绑在一整颗番茄里。一旦开始，中途放弃就要承受失去整颗番茄的代价。',
    rules: [
      '设定25分钟倒计时',
      '这段时间内只专注于一项任务',
      '25分钟后休息5分钟',
      '每4个番茄后休息15-30分钟'
    ],
    successCriteria: '每天完成4个以上番茄',
    traps: [
      '番茄期间查看手机 - 会破坏整个番茄',
      '休息时间过长 - 严格控制在5分钟',
      '任务太大一个番茄做不完 - 提前拆分任务'
    ],
    applicableScenarios: '适合需要长时间专注、容易中途分心的人'
  },
  {
    id: 'phone-out-of-sight',
    name: '手机隔离',
    icon: '📵',
    description: '专注时将手机放在视线之外',
    category: 'focus',
    difficulty: 'easy',
    leverage: 4,
    recommended: false,
    tags: ['专注', '手机', '视觉'],
    coreIdea: '眼不见为净。手机在视线内会持续吸引注意力，即使不碰也会降低专注质量。将其放在视线之外，可以大幅降低诱惑。',
    rules: [
      '开始专注前，将手机放在另一个房间或抽屉',
      '设置为静音或勿扰模式',
      '可以设置自动回复，告知他人你在专注',
      '专注结束后再查看手机'
    ],
    successCriteria: '连续7天，专注时手机不在视线内',
    traps: [
      '放在桌上但倒扣 - 还是能看到',
      '静音但放旁边 - 屏幕亮起还是会分心',
      '需要查资料 - 用电脑查，或提前准备好资料'
    ],
    applicableScenarios: '适合容易被手机分心、难以保持专注的人'
  },

  // ========== 晚间复盘 ==========
  {
    id: 'win-record',
    name: '赢麻了',
    icon: '🏆',
    description: '每天记录当天的胜利，积累正反馈',
    category: 'evening',
    difficulty: 'easy',
    leverage: 3,
    recommended: true,
    tags: ['晚间', '记录', '情绪'],
    coreIdea: '将传统的感恩日记改造成胜利记录。每天完成任何任务或发生好事时，都作为喜报收集起来。用最大的喜报为当天命名，定级为小赢、中赢、大赢。',
    rules: [
      '每天记录至少3件胜利（完成的事、好事）',
      '用最大的胜利为当天命名（如搞定高数第三章胜利日）',
      '给当天定级：小赢、中赢、大赢',
      '每周回顾一次，积累情绪价值'
    ],
    successCriteria: '连续7天，每天记录3条以上胜利',
    traps: [
      '只记录大事 - 小事也是胜利',
      '形式化记录 - 要真正感受胜利的喜悦',
      '漏记几天后放弃 - 随时可以重新开始'
    ],
    applicableScenarios: '适合容易自我否定、需要积累正反馈的人'
  },
  {
    id: 'evening-review',
    name: '晚间回顾',
    icon: '📖',
    description: '睡前5分钟回顾一天的收获',
    category: 'evening',
    difficulty: 'easy',
    leverage: 3,
    recommended: false,
    tags: ['晚间', '反思', '总结'],
    coreIdea: '睡前回顾可以强化当天的学习成果，帮助大脑整理信息。同时也是一种温和的关机仪式，为入睡做好心理准备。',
    rules: [
      '睡前5分钟进行回顾',
      '回顾当天完成的主要事项',
      '思考一件做得好的事和一件可以改进的事',
      '不要过度反思，保持轻松心态'
    ],
    successCriteria: '连续7天，每天睡前回顾',
    traps: [
      '回顾时开始自责 - 保持建设性心态',
      '回顾时间太长 - 控制在5分钟内',
      '回顾后又开始看手机 - 回顾后立即准备睡觉'
    ],
    applicableScenarios: '适合希望提升自我觉察、改善睡眠质量的人'
  },

  // ========== 应急机制 ==========
  {
    id: 'watertight-compartment',
    name: '水密隔舱',
    icon: '🛡️',
    description: '应对不可抗力的标准化容错机制',
    category: 'emergency',
    difficulty: 'easy',
    leverage: 5,
    recommended: true,
    tags: ['应急', '容错', '保护'],
    coreIdea: '当出现影响生活一天以上的不可抗力（生病、出差、紧急事件）时，主动触发此国策，临时冻结相关国策的结算。这是防止整个国策树因一次意外而崩塌的关键机制。',
    rules: [
      '当出现不可抗力事件时，主动触发水密隔舱',
      '指定冻结期限（如生病期间、出差3天）',
      '划定受影响的国策范围（可以全部冻结）',
      '期限结束当天，一次性重新满足所有被冻结的国策'
    ],
    successCriteria: '正确识别不可抗力，及时触发机制',
    traps: [
      '滥用机制 - 只有真正的不可抗力才能触发',
      '忘记重新激活 - 设置提醒，期限结束立即执行',
      '冻结期间完全放纵 - 尽量保持基础习惯'
    ],
    applicableScenarios: '所有国策树都应该配备此国策，作为保险机制'
  },
  {
    id: 'scout-mission',
    name: '侦查任务',
    icon: '🔍',
    description: '5分钟低门槛启动任务，降低启动阻力',
    category: 'emergency',
    difficulty: 'easy',
    leverage: 4,
    recommended: false,
    tags: ['启动', '低门槛', '过渡'],
    coreIdea: '当主任务阻力太大时，设置一个简单的侦查任务：只需要专注5分钟就算完成。5分钟后如果进入状态，可以选择延长；如果状态不佳，也可以毫无负担地放弃。',
    rules: [
      '当难以启动主任务时，先执行侦查任务',
      '侦查任务只需专注5分钟',
      '5分钟后可以选择：继续、休息、放弃',
      '完成侦查任务即算胜利，不强制要求继续'
    ],
    successCriteria: '连续7天，在阻力大时使用侦查任务',
    traps: [
      '侦查任务也做不到 - 说明阻力还是太大，需要进一步拆分',
      '侦查后必须继续 - 5分钟后可以自由选择',
      '频繁依赖侦查任务 - 需要分析主任务是否设计合理'
    ],
    applicableScenarios: '适合启动困难、容易拖延的人，作为过渡策略'
  },

  // ========== 从国策树图片提取的模版 ==========
  // T1 农村包围城市
  {
    id: 'emotional-cushion',
    name: '情绪气囊',
    icon: '🛡️',
    description: '建立情绪缓冲机制，防止情绪失控导致行为失范',
    category: 'foundation',
    difficulty: 'medium',
    leverage: 4,
    recommended: true,
    tags: ['T1', '情绪', '缓冲', '基础'],
    coreIdea: '通过预设机制为情绪提供缓冲空间，避免冲动行为。在情绪波动时第一时间觉察并命名情绪，情绪激动时强制等待后再做决定。',
    rules: [
      '在情绪波动时第一时间觉察并命名情绪',
      '情绪激动时强制等待10分钟后再做决定',
      '建立情绪触发器的识别清单',
      '记录情绪日志，追踪情绪模式'
    ],
    successCriteria: '连续14天，在情绪激动时成功使用缓冲机制',
    traps: [
      '认为自己可以控制情绪 - 缓冲机制是预防性的',
      '等待时间太短 - 10分钟是最低限度',
      '只在情绪爆发后才想起 - 要提前识别信号'
    ],
    applicableScenarios: '适合情绪波动大、容易冲动决策的人'
  },
  {
    id: 'energy-management',
    name: '能量管理',
    icon: '⚡',
    description: '科学管理精力，在最佳状态下做最重要的事',
    category: 'foundation',
    difficulty: 'medium',
    leverage: 5,
    recommended: true,
    tags: ['T1', '精力', '优化', '基础'],
    coreIdea: '识别个人精力规律，将重要任务安排在精力高峰期。通过记录和分析，找到最适合自己的工作和休息节奏。',
    rules: [
      '记录不同时段的精力水平（1-10分）',
      '将重要任务安排在精力高峰期',
      '在低能量时段安排休息或简单任务',
      '每周回顾并优化能量分配策略'
    ],
    successCriteria: '连续21天，完成精力追踪并优化任务安排',
    traps: [
      '忽视精力波动 - 人的精力是有规律的',
      '在低谷期强行工作 - 效率低且容易 burnout',
      '只关注工作不关注休息 - 休息也是能量管理的一部分'
    ],
    applicableScenarios: '适合工作量大、需要高效利用时间的人'
  },
  {
    id: 'full-strike',
    name: '全力一击',
    icon: '💥',
    description: '选择最重要的单一任务，集中全部精力攻克',
    category: 'foundation',
    difficulty: 'hard',
    leverage: 5,
    recommended: false,
    tags: ['T1', '专注', '攻坚', '基础'],
    coreIdea: '与其分散精力做很多事，不如集中全部资源攻克一个关键任务。这是杠杆思维的核心应用：用最小成本撬动最大改变。',
    rules: [
      '每天选择1个最重要的任务作为全力一击目标',
      '为该任务分配最佳时段和全部资源',
      '其他任务让步于全力一击任务',
      '完成后再处理其他事务'
    ],
    successCriteria: '连续7天，每天完成一个全力一击任务',
    traps: [
      '选择太多目标 - 只能有一个全力一击',
      '低估任务难度 - 要预留足够时间和资源',
      '被紧急事务打断 - 学会保护全力一击时间'
    ],
    applicableScenarios: '适合任务繁多、难以聚焦关键目标的人'
  },
  {
    id: 'quick-cleanup',
    name: '快速打扫',
    icon: '🧹',
    description: '建立快速整理机制，保持环境整洁',
    category: 'foundation',
    difficulty: 'easy',
    leverage: 3,
    recommended: true,
    tags: ['T1', '环境', '整理', '基础'],
    coreIdea: '环境整洁度直接影响心理状态和工作效率。通过建立快速打扫机制，用最小的时间成本维持整洁环境，避免混乱积累。',
    rules: [
      '每天固定时间进行5分钟快速打扫',
      '遵循"物归原位"原则',
      '看到脏乱立即处理，不拖延',
      '每周进行一次深度整理'
    ],
    successCriteria: '连续21天，每天完成快速打扫',
    traps: [
      '追求完美 - 快速打扫不要求完美',
      '等到很乱再整理 - 预防胜于治疗',
      '只打扫不整理 - 整理比打扫更重要'
    ],
    applicableScenarios: '适合环境容易混乱、受环境影响大的人'
  },
  {
    id: 'nip-in-bud',
    name: '防微杜渐',
    icon: '🔍',
    description: '及时发现问题苗头，在恶化前解决',
    category: 'foundation',
    difficulty: 'medium',
    leverage: 4,
    recommended: true,
    tags: ['T1', '预防', '觉察', '基础'],
    coreIdea: '小问题如果不及时处理，会演变成大问题。建立早期预警机制，在问题还处于萌芽状态时就识别并解决，成本最低。',
    rules: [
      '建立个人问题预警指标清单',
      '每天花5分钟检查各项指标',
      '发现问题苗头立即采取行动',
      '记录问题处理过程，积累经验'
    ],
    successCriteria: '连续14天，及时发现并处理3个以上问题苗头',
    traps: [
      '忽视小信号 - 小信号往往预示大问题',
      '等问题变大再处理 - 那时成本会高很多',
      '过度敏感 - 要区分正常波动和真正的问题'
    ],
    applicableScenarios: '适合容易忽视小问题、等问题恶化才处理的人'
  },

  // T2 作息调频组
  {
    id: 'first-strike-v2',
    name: '先发制人',
    icon: '⚡',
    description: '起床后30分钟内禁用手机，激活一天状态',
    category: 'sleep',
    difficulty: 'easy',
    leverage: 5,
    recommended: true,
    tags: ['T2', '早晨', '手机', '作息'],
    coreIdea: '一日之计在于晨。起床后的行为奠定了一天的基调。起床后立即接触手机，会让大脑进入被动接收模式；而先做正事，则会让大脑进入主动创造模式。',
    rules: [
      '无论几点起床，起床后30分钟内禁止使用手机',
      '手机可以放在另一个房间或飞行模式',
      '这段时间只允许做正事：洗漱、整理、早餐、看邮件',
      '可以设置手机自动解锁时间'
    ],
    successCriteria: '连续14天，起床后30分钟内不碰手机',
    traps: [
      '就看一眼时间 - 时间会引出通知',
      '闹钟在手机上 - 用传统闹钟或智能手表',
      '有人找我怎么办 - 真正的急事会打电话'
    ],
    applicableScenarios: '适合早晨容易沉迷手机、导致一天拖延的人'
  },
  {
    id: 'curfew-system',
    name: '宵禁制度',
    icon: '🌙',
    description: '设定固定时间后禁止使用电子设备',
    category: 'sleep',
    difficulty: 'medium',
    leverage: 4,
    recommended: true,
    tags: ['T2', '晚间', '电子', '作息'],
    coreIdea: '明确的时间边界比模糊的"早点睡"更有效。设定一个固定的宵禁时间，到点后自动进入睡眠准备模式，为高质量睡眠创造条件。',
    rules: [
      '设定固定的宵禁时间（如23:00）',
      '宵禁后禁止使用所有电子设备',
      '可以阅读纸质书、冥想、轻度拉伸',
      '设置自动提醒，提前15分钟准备'
    ],
    successCriteria: '连续21天，宵禁时间后不使用电子设备',
    traps: [
      '今天特殊 - 特殊一次就会特殊无数次',
      '只看一眼 - 一眼会变成一小时',
      '没有替代活动 - 提前准备好宵禁后的活动'
    ],
    applicableScenarios: '适合晚睡、睡前必刷手机的人'
  },
  {
    id: 'digital-curfew-v2',
    name: '电子宵禁',
    icon: '📵',
    description: '特定时间后限制特定应用的使用',
    category: 'sleep',
    difficulty: 'easy',
    leverage: 4,
    recommended: true,
    tags: ['T2', '晚间', '应用', '作息'],
    coreIdea: '利用系统自带的屏幕使用时间功能，为最容易沉迷的App设置硬性限制。这是一个被动国策，一旦设置好，维护成本极低。',
    rules: [
      '为社交媒体、短视频App设置每日限额',
      '限额用尽后，当天无法继续使用',
      '不要频繁调整限额',
      '可以设置忽略限额密码，增加使用门槛'
    ],
    successCriteria: '设置成功，连续14天不主动解除限额',
    traps: [
      '频繁调整限额 - 设置后至少坚持一周',
      '寻找解除限额的方法 - 增加使用门槛',
      '今天特殊 - 特殊一次就会特殊无数次'
    ],
    applicableScenarios: '适合所有想减少晚间手机使用的人'
  },
  {
    id: 'sleep-flex-plan',
    name: '作息弹性计划',
    icon: '💤',
    description: '可强化升级的作息国策，逐步优化睡眠时间',
    category: 'sleep',
    difficulty: 'medium',
    leverage: 5,
    recommended: false,
    tags: ['T2', '睡眠', '进阶', '作息'],
    coreIdea: '这是一个可进阶的国策，通过储备冗余来保护基础节点。即使某次不得不晚睡，也可以释放储备，退回到基础状态，而不至于让整个作息节奏崩掉。',
    rules: [
      '基础(+0)：固定起床时间',
      '强化+1：起床时间和就寝时间均提前15分钟',
      '每升一级，时间均提前15分钟',
      '遇到特殊情况可以释放储备，退回到+0'
    ],
    successCriteria: '稳定维持在当前强化等级14天以上',
    upgradePath: [
      '+0：基础起床时间',
      '+1：提前15分钟',
      '+2：提前30分钟',
      '+3：提前45分钟'
    ],
    traps: [
      '一开始就追求高等级 - 从+0开始，稳扎稳打',
      '失败后放弃整个国策 - 释放储备是设计的一部分',
      '忽视其他配套国策 - 需要先发制人等国策配合'
    ],
    applicableScenarios: '适合希望系统改善作息、愿意长期投入的人'
  },

  // T3 专注核武组
  {
    id: 'zen-mode',
    name: '禅定模式',
    icon: '🧘',
    description: '深度专注模式，屏蔽所有干扰',
    category: 'focus',
    difficulty: 'hard',
    leverage: 5,
    recommended: true,
    tags: ['T3', '专注', '深度', '核武'],
    coreIdea: '创建一个完全无干扰的专注环境，进入深度工作状态。这是最高级别的专注保护，适合处理需要高度认知资源的任务。',
    rules: [
      '设定专注时段（建议90分钟）',
      '关闭所有通知、手机静音并放在视线外',
      '使用网站屏蔽工具阻止访问干扰网站',
      '提前准备好所有需要的资料，避免中断'
    ],
    successCriteria: '连续7天，每天完成至少一个禅定模式时段',
    traps: [
      '时间设置太长 - 从60分钟开始逐步增加',
      '没有完全屏蔽干扰 - 任何漏网之鱼都会破坏专注',
      '中断后放弃 - 可以重新开始，不要完美主义'
    ],
    applicableScenarios: '适合需要深度工作、容易被干扰的人'
  },
  {
    id: 'sacred-seat-v2',
    name: '神圣座位',
    icon: '🪑',
    description: '指定专门的工作位置，建立环境锚点',
    category: 'focus',
    difficulty: 'medium',
    leverage: 4,
    recommended: true,
    tags: ['T3', '专注', '环境', '核武'],
    coreIdea: '神圣座位原理：指定一个特定的位置作为神圣座位，一旦坐上去就必须专注工作。通过环境锚点，建立强烈的条件反射。',
    rules: [
      '指定一个特定的座位/位置为神圣座位',
      '坐在这个位置上时，必须专注工作或学习',
      '不专注时，必须离开这个座位',
      '可以设置多个神圣座位（如书桌、图书馆座位）'
    ],
    successCriteria: '连续21天，在神圣座位上保持专注',
    traps: [
      '坐在这里也可以休息 - 破坏神圣性',
      '神圣座位太舒适 - 适度舒适即可',
      '没有明确的开始仪式 - 可以配合深呼吸或戴耳机'
    ],
    applicableScenarios: '适合难以开始工作、需要环境暗示的人'
  },
  {
    id: 'fire-coverage',
    name: '火力覆盖',
    icon: '🔥',
    description: '短时间内高强度输出，快速完成任务',
    category: 'focus',
    difficulty: 'hard',
    leverage: 4,
    recommended: false,
    tags: ['T3', '专注', '高强度', '核武'],
    coreIdea: '在精力最充沛的时段，进行高强度、高密度的输出。通过时间压力和能量集中，产生爆发性的生产力。',
    rules: [
      '选择精力最佳的2-3小时时段',
      '设定明确的目标和产出要求',
      '消除所有干扰，全神贯注',
      '完成后彻底休息，恢复能量'
    ],
    successCriteria: '连续7天，每天完成至少一次火力覆盖',
    traps: [
      '频率太高 - 火力覆盖需要恢复时间',
      '目标不清晰 - 要明确产出标准',
      '忽视休息 - 休息是火力覆盖的必要组成部分'
    ],
    applicableScenarios: '适合有明确截止日期、需要快速产出的人'
  },
  {
    id: 'timely-rain',
    name: '及时雨',
    icon: '🌧️',
    description: '在需要时提供即时帮助，解决燃眉之急',
    category: 'focus',
    difficulty: 'easy',
    leverage: 3,
    recommended: false,
    tags: ['T3', '帮助', '即时', '核武'],
    coreIdea: '建立一个即时支持系统，在遇到困难或卡壳时能够快速获得帮助。这可以是工具、资料、人脉或任何能快速解决问题的资源。',
    rules: [
      '建立常用问题快速解决方案库',
      '准备好常用工具和资料',
      '建立可以求助的人脉网络',
      '定期更新和维护支持系统'
    ],
    successCriteria: '建立完整的及时雨系统，并在需要时成功使用3次',
    traps: [
      '过度依赖 - 先尝试自己解决',
      '系统不完善 - 要覆盖常见问题',
      '不及时更新 - 定期维护系统'
    ],
    applicableScenarios: '适合容易卡壳、需要即时支持的人'
  },

  // T3 应用管理组
  {
    id: 'time-room',
    name: '时光的房间',
    icon: '🏠',
    description: '为不同活动创建专属空间，物理隔离干扰',
    category: 'digital',
    difficulty: 'medium',
    leverage: 4,
    recommended: true,
    tags: ['T3', '空间', '隔离', '应用'],
    coreIdea: '通过物理空间的划分，为不同活动创建专属区域。工作区只工作，休息区只休息，通过环境切换来切换状态。',
    rules: [
      '划分专门的工作区和休息区',
      '工作区只进行工作相关活动',
      '休息区禁止工作',
      '通过物理移动来切换状态'
    ],
    successCriteria: '连续14天，严格遵守空间使用规则',
    traps: [
      '空间界限模糊 - 要明确划分',
      '在休息区工作 - 会破坏空间的神圣性',
      '空间太小无法划分 - 可以用不同座位或桌面区域'
    ],
    applicableScenarios: '适合在家工作、难以区分工作和休息的人'
  },
  {
    id: 'normal-mode',
    name: '普通模式',
    icon: '📱',
    description: '设定手机的"普通模式"，限制娱乐功能',
    category: 'digital',
    difficulty: 'easy',
    leverage: 3,
    recommended: true,
    tags: ['T3', '手机', '模式', '应用'],
    coreIdea: '为手机创建一个"普通模式"，在这个模式下只能使用基础功能，娱乐和社交功能被限制。需要娱乐时主动切换到"娱乐模式"。',
    rules: [
      '设置手机的专注模式或工作模式',
      '普通模式下隐藏或限制娱乐App',
      '需要娱乐时主动切换模式',
      '设置模式切换的时间限制'
    ],
    successCriteria: '连续14天，主要使用普通模式',
    traps: [
      '模式设置太宽松 - 要真正限制娱乐',
      '频繁切换模式 - 切换要有成本',
      '忘记切换回普通模式 - 设置自动切换'
    ],
    applicableScenarios: '适合手机使用时间长、难以自控的人'
  },
  {
    id: 'first-blood',
    name: '一血概念',
    icon: '🩸',
    description: '重视第一次使用，建立良好开端',
    category: 'digital',
    difficulty: 'medium',
    leverage: 4,
    recommended: false,
    tags: ['T3', '开端', '仪式', '应用'],
    coreIdea: '第一次使用某个设备或应用时，建立正确的使用模式。第一印象会深刻影响后续的使用习惯，所以要精心设计"一血"体验。',
    rules: [
      '新设备/应用首次使用时设定明确规则',
      '删除或隐藏不必要的功能和应用',
      '设置好通知和权限',
      '记录初始设置，作为后续调整的基准'
    ],
    successCriteria: '为所有新设备和应用建立一血规则',
    traps: [
      '忽视初始设置 - 后期很难改变',
      '设置太复杂 - 要简单易执行',
      '不记录设置 - 忘记当初为什么这样设置'
    ],
    applicableScenarios: '适合经常尝试新应用、需要建立良好使用习惯的人'
  },
  {
    id: 'blitzkrieg',
    name: '闪击战',
    icon: '⚡',
    description: '快速完成任务，不给拖延留机会',
    category: 'digital',
    difficulty: 'medium',
    leverage: 4,
    recommended: false,
    tags: ['T3', '速度', '执行', '应用'],
    coreIdea: '对于小任务，采用"闪击战"策略：立即执行，快速完成，不给拖延留任何机会。2分钟内能完成的任务立即做，不要放入待办清单。',
    rules: [
      '2分钟内能完成的任务立即执行',
      '不将小事放入待办清单',
      '看到任务立即判断：现在做还是安排时间',
      '批量处理同类小事'
    ],
    successCriteria: '连续7天，80%的小事立即完成',
    traps: [
      '低估任务时间 - 严格控制在2分钟内',
      '找借口拖延 - 现在就是最佳时机',
      '忽视批量处理 - 同类事一起处理更高效'
    ],
    applicableScenarios: '适合小事拖延、待办清单堆积的人'
  },

  // T3 晚间管理组
  {
    id: 'curfew-time',
    name: '宵禁了',
    icon: '🌃',
    description: '设定明确的晚间截止时间',
    category: 'evening',
    difficulty: 'medium',
    leverage: 4,
    recommended: true,
    tags: ['T3', '晚间', '时间', '管理'],
    coreIdea: '明确的时间边界比模糊的"早点休息"更有效。设定一个固定的宵禁时间，到点后停止所有活动，开始准备入睡。',
    rules: [
      '设定明确的宵禁时间（如23:00）',
      '宵禁前30分钟开始减速',
      '宵禁后只进行睡眠准备活动',
      '设置多个提醒，确保不会忘记'
    ],
    successCriteria: '连续21天，宵禁时间后停止活动',
    traps: [
      '今天特殊 - 特殊一次就会特殊无数次',
      '没有减速过程 - 要给自己缓冲时间',
      '宵禁后还做刺激性活动 - 要真正准备入睡'
    ],
    applicableScenarios: '适合晚睡、难以按时入睡的人'
  },
  {
    id: 'transparent-block',
    name: '透明阻止',
    icon: '🛑',
    description: '用透明的方式阻止不良行为',
    category: 'evening',
    difficulty: 'easy',
    leverage: 3,
    recommended: true,
    tags: ['T3', '阻止', '透明', '管理'],
    coreIdea: '不要隐藏或压抑不良行为，而是用透明的方式阻止它。记录、公开、量化这些行为，让问题自然暴露并得到控制。',
    rules: [
      '记录所有想要阻止的行为',
      '公开或分享给信任的人',
      '定期回顾和量化',
      '庆祝每一次成功阻止'
    ],
    successCriteria: '连续14天，记录并公开不良行为',
    traps: [
      '记录但不行动 - 记录是为了改变',
      '过于私密不分享 - 分享增加责任感',
      '忽视小行为 - 小行为积累成大问题'
    ],
    applicableScenarios: '适合有不良习惯、需要外部监督的人'
  },
  {
    id: 'space-construction',
    name: '空间构造',
    icon: '🏗️',
    description: '精心设计睡眠环境，优化睡眠质量',
    category: 'evening',
    difficulty: 'easy',
    leverage: 4,
    recommended: true,
    tags: ['T3', '环境', '睡眠', '管理'],
    coreIdea: '睡眠环境对睡眠质量有直接影响。通过精心设计卧室环境（光线、温度、声音、床品），创造一个最适合睡眠的空间。',
    rules: [
      '保持卧室黑暗（使用遮光窗帘或眼罩）',
      '调节适宜温度（18-22度最佳）',
      '减少噪音干扰（耳塞或白噪音）',
      '使用舒适的床品'
    ],
    successCriteria: '完成睡眠环境优化，并连续14天保持良好睡眠',
    traps: [
      '只关注一个因素 - 要综合考虑',
      '忽视个人差异 - 找到最适合自己的设置',
      '环境好但习惯差 - 环境只是辅助'
    ],
    applicableScenarios: '适合睡眠质量差、希望改善睡眠环境的人'
  },
  {
    id: 'crystal-channel',
    name: '水晶通道',
    icon: '💎',
    description: '建立从清醒到睡眠的清晰过渡路径',
    category: 'evening',
    difficulty: 'medium',
    leverage: 4,
    recommended: false,
    tags: ['T3', '过渡', '仪式', '管理'],
    coreIdea: '从清醒到睡眠需要一个过渡过程。设计一个固定的"水晶通道"仪式，让身体和大脑逐步进入睡眠状态。',
    rules: [
      '设计固定的睡前仪式（如洗漱→阅读→冥想）',
      '仪式时间控制在30-60分钟',
      '仪式内容要放松，避免刺激',
      '每天坚持执行，形成条件反射'
    ],
    successCriteria: '连续21天，每天完成水晶通道仪式',
    traps: [
      '仪式太复杂 - 要简单易执行',
      '仪式中有刺激活动 - 如看手机、剧烈运动',
      '时间不固定 - 要在固定时间开始'
    ],
    applicableScenarios: '适合入睡困难、需要过渡仪式的人'
  },
  {
    id: 'fast-channel',
    name: '快速通道',
    icon: '🚀',
    description: '建立快速入睡的技巧和方法',
    category: 'evening',
    difficulty: 'easy',
    leverage: 3,
    recommended: false,
    tags: ['T3', '入睡', '技巧', '管理'],
    coreIdea: '掌握快速入睡的技巧，在需要时能够迅速入睡。这包括呼吸技巧、身体放松、心理暗示等方法。',
    rules: [
      '学习并练习快速入睡技巧（如4-7-8呼吸法）',
      '建立"床=睡眠"的条件反射',
      '20分钟睡不着就起床，避免焦虑',
      '保持规律作息，固定起床时间'
    ],
    successCriteria: '掌握3种以上快速入睡技巧，并能成功使用',
    traps: [
      '过度依赖技巧 - 规律作息更重要',
      '躺在床上尝试入睡 - 睡不着就起床',
      '焦虑睡不着 - 放松心态更重要'
    ],
    applicableScenarios: '适合入睡时间长、希望快速入睡的人'
  },

  // T3 通知管理组
  {
    id: 'risk-avoidance',
    name: '风险规避',
    icon: '⚠️',
    description: '识别并规避数字生活中的风险',
    category: 'digital',
    difficulty: 'medium',
    leverage: 4,
    recommended: true,
    tags: ['T3', '风险', '安全', '通知'],
    coreIdea: '数字生活中存在很多隐性风险：信息过载、隐私泄露、成瘾设计等。建立风险意识，主动规避这些风险。',
    rules: [
      '识别个人的数字风险点',
      '关闭不必要的通知和推送',
      '定期清理数字足迹',
      '使用工具保护隐私和安全'
    ],
    successCriteria: '识别并规避5个以上数字风险点',
    traps: [
      '忽视隐性风险 - 很多风险不易察觉',
      '过度防范 - 要平衡安全和便利',
      '一次设置不再更新 - 要定期检查和调整'
    ],
    applicableScenarios: '适合关注数字安全、希望减少数字风险的人'
  },
  {
    id: 'phone-isolation',
    name: '手机物理隔离',
    icon: '📵',
    description: '将手机放在视线和触及范围之外',
    category: 'digital',
    difficulty: 'easy',
    leverage: 5,
    recommended: true,
    tags: ['T3', '隔离', '物理', '通知'],
    coreIdea: '眼不见为净，手不及为静。将手机放在视线和触及范围之外，大幅降低使用频率。这是最简单但最有效的数字健康策略。',
    rules: [
      '工作或学习时，将手机放在另一个房间',
      '睡前将手机放在卧室外',
      '使用传统闹钟替代手机闹钟',
      '设定专门的查看手机时间'
    ],
    successCriteria: '连续14天，手机不在视线和触及范围内',
    traps: [
      '放在桌上但倒扣 - 还是能看到和拿到',
      '需要时找不到 - 要固定放置位置',
      '担心错过重要信息 - 真正的急事会打电话'
    ],
    applicableScenarios: '适合手机依赖严重、难以自控的人'
  },
  {
    id: 'decision-front',
    name: '决策前置',
    icon: '🎯',
    description: '提前做出决策，减少当下的决策疲劳',
    category: 'digital',
    difficulty: 'medium',
    leverage: 4,
    recommended: true,
    tags: ['T3', '决策', '前置', '通知'],
    coreIdea: '决策疲劳是意志力消耗的主要原因。提前做出决策（如提前规划、预设规则），减少当下的决策负担，保护意志力。',
    rules: [
      '前一天晚上规划第二天的任务',
      '为常见场景预设规则（如看到手机就...）',
      '减少日常小决策（如固定穿搭、饮食）',
      '将重要决策安排在精力最佳时段'
    ],
    successCriteria: '连续14天，使用决策前置策略',
    traps: [
      '规划但不执行 - 要真正按计划行事',
      '规划太详细 - 要留有弹性空间',
      '忽视执行反馈 - 要根据反馈调整计划'
    ],
    applicableScenarios: '适合决策疲劳严重、意志力不足的人'
  },
  {
    id: 'app-restriction',
    name: '应用限制',
    icon: '🔒',
    description: '限制特定应用的使用时间和场景',
    category: 'digital',
    difficulty: 'easy',
    leverage: 4,
    recommended: true,
    tags: ['T3', '限制', '应用', '通知'],
    coreIdea: '不是所有应用都需要无限制访问。为容易沉迷的应用设置明确的使用限制，保护时间和精力。',
    rules: [
      '识别需要限制的应用',
      '设置每日使用限额',
      '限制使用场景（如只能在特定时间使用）',
      '定期回顾和调整限制'
    ],
    successCriteria: '连续14天，遵守应用限制规则',
    traps: [
      '限制太宽松 - 要真正起到约束作用',
      '频繁调整限制 - 设置后至少坚持一周',
      '寻找绕过限制的方法 - 增加使用门槛'
    ],
    applicableScenarios: '适合有特定应用成瘾、需要限制使用的人'
  },
  {
    id: 'password-management',
    name: '免密管理',
    icon: '🔑',
    description: '管理密码和登录，减少使用门槛',
    category: 'digital',
    difficulty: 'easy',
    leverage: 3,
    recommended: false,
    tags: ['T3', '密码', '便利', '通知'],
    coreIdea: '对于需要鼓励使用的应用，减少登录门槛；对于需要限制使用的应用，增加登录门槛。通过密码管理实现行为引导。',
    rules: [
      '为需要鼓励的应用设置自动登录',
      '为需要限制的应用设置复杂密码',
      '使用密码管理器统一管理',
      '定期更新密码安全'
    ],
    successCriteria: '建立完整的密码管理体系',
    traps: [
      '所有应用都免密 - 要区分鼓励类和限制类',
      '密码太简单 - 要保证安全性',
      '忽视密码管理器 - 要养成使用习惯'
    ],
    applicableScenarios: '适合需要区分应用使用优先级的人'
  }
];

export default brainstormTemplates;
