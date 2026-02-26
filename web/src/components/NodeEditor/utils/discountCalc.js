/**
 * 双曲贴现函数
 * W(τ) = 1 / (1 + k·τ)
 * @param {number} tau - 时间
 * @param {number} k - 贴现率
 * @returns {number} 权重
 */
export function hyperbolicDiscount(tau, k = 0.5) {
  return 1 / (1 + k * tau);
}

/**
 * 计算价值积分
 * I = ∫₀^∞ V(τ) · W(τ) dτ
 * 使用数值积分（梯形法则）
 * @param {Function} valueFunction - 价值函数 V(τ)
 * @param {number} k - 贴现率
 * @param {number} maxTime - 最大时间
 * @param {number} steps - 积分步数
 * @returns {number} 积分值
 */
export function calculateValueIntegral(valueFunction, k = 0.5, maxTime = 100, steps = 1000) {
  const dt = maxTime / steps;
  let integral = 0;

  for (let i = 0; i < steps; i++) {
    const t1 = i * dt;
    const t2 = (i + 1) * dt;
    
    const w1 = hyperbolicDiscount(t1, k);
    const w2 = hyperbolicDiscount(t2, k);
    
    const v1 = valueFunction(t1);
    const v2 = valueFunction(t2);
    
    integral += (v1 * w1 + v2 * w2) * dt / 2;
  }

  return integral;
}

/**
 * 即时满足的价值函数
 * 高即时价值，快速衰减
 * @param {number} tau - 时间
 * @param {number} immediateValue - 即时价值
 * @param {number} decayRate - 衰减率
 * @returns {number} 价值
 */
export function immediateGratificationValue(tau, immediateValue = 80, decayRate = 0.5) {
  return immediateValue * Math.exp(-decayRate * tau);
}

/**
 * 延迟满足的价值函数
 * 低即时价值，缓慢增长
 * @param {number} tau - 时间
 * @param {number} futureValue - 未来价值
 * @param {number} growthRate - 增长率
 * @returns {number} 价值
 */
export function delayedGratificationValue(tau, futureValue = 100, growthRate = 0.1) {
  return futureValue * (1 - Math.exp(-growthRate * tau));
}

/**
 * 生成价值曲线数据点
 * @param {Function} valueFunction - 价值函数
 * @param {number} maxTime - 最大时间
 * @param {number} points - 数据点数量
 * @returns {Array} 数据点数组 [{t, v}, ...]
 */
export function generateCurveData(valueFunction, maxTime = 10, points = 50) {
  const data = [];
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * maxTime;
    data.push({ t, v: valueFunction(t) });
  }
  return data;
}

/**
 * 比较两个行为的价值积分
 * @param {Object} behavior1 - 行为1参数
 * @param {Object} behavior2 - 行为2参数
 * @param {number} k - 贴现率
 * @returns {Object} 比较结果
 */
export function compareBehaviors(behavior1, behavior2, k = 0.5) {
  const integral1 = calculateValueIntegral(
    (t) => immediateGratificationValue(t, behavior1.immediateValue, behavior1.decayRate),
    k
  );
  
  const integral2 = calculateValueIntegral(
    (t) => delayedGratificationValue(t, behavior2.futureValue, behavior2.growthRate),
    k
  );

  return {
    behavior1Integral: integral1,
    behavior2Integral: integral2,
    winner: integral1 > integral2 ? behavior1.name : behavior2.name,
    explanation: integral1 > integral2
      ? `你的贴现率是 ${k}，所以"${behavior1.name}"的价值积分更高。这就是为什么你总是选择${behavior1.name}——不是你懒，是你的大脑在用"贴现"计算价值！`
      : `你的贴现率是 ${k}，"${behavior2.name}"的价值积分更高。这说明你更看重长期价值！`
  };
}

// 最后更新时间: 2026-02-22 14:15
// 编辑人: Trae AI
// 用途: 双曲贴现计算工具，用于可视化即时满足与延迟满足的价值比较
