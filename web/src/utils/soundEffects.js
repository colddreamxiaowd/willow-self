/**
 * 音效工具函数
 * 使用 Web Audio API 生成音效
 */

// 创建音频上下文
let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

/**
 * 播放国策激活音效
 * 金色光芒风格的仪式感音效
 */
export function playActivationSound() {
  try {
    const ctx = getAudioContext();
    const currentTime = ctx.currentTime;

    // 创建主增益节点
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(0.3, currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.01, currentTime + 2);

    // 创建多个振荡器产生和弦效果
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C大调和弦
    
    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(masterGain);
      
      // 设置频率
      oscillator.frequency.setValueAtTime(freq, currentTime);
      
      // 设置波形
      oscillator.type = index === 0 ? 'sine' : 'triangle';
      
      // 设置包络
      const attackTime = 0.1 + index * 0.05;
      const decayTime = 1.5 + index * 0.2;
      
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, currentTime + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + attackTime + decayTime);
      
      // 播放
      oscillator.start(currentTime);
      oscillator.stop(currentTime + attackTime + decayTime + 0.5);
    });

    // 添加高频闪烁效果
    const sparkleOsc = ctx.createOscillator();
    const sparkleGain = ctx.createGain();
    
    sparkleOsc.connect(sparkleGain);
    sparkleGain.connect(masterGain);
    
    sparkleOsc.frequency.setValueAtTime(2093, currentTime); // 高C
    sparkleOsc.type = 'sine';
    
    sparkleGain.gain.setValueAtTime(0, currentTime);
    sparkleGain.gain.linearRampToValueAtTime(0.1, currentTime + 0.05);
    sparkleGain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.8);
    
    sparkleOsc.start(currentTime + 0.2);
    sparkleOsc.stop(currentTime + 1);

  } catch (error) {
    console.warn('播放音效失败:', error);
  }
}

/**
 * 播放成功音效
 */
export function playSuccessSound() {
  try {
    const ctx = getAudioContext();
    const currentTime = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // 上升音阶
    oscillator.frequency.setValueAtTime(523.25, currentTime);
    oscillator.frequency.linearRampToValueAtTime(659.25, currentTime + 0.1);
    oscillator.frequency.linearRampToValueAtTime(783.99, currentTime + 0.2);
    
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.2, currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.5);
    
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 0.5);
  } catch (error) {
    console.warn('播放音效失败:', error);
  }
}

/**
 * 播放失败音效
 */
export function playFailureSound() {
  try {
    const ctx = getAudioContext();
    const currentTime = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // 下降音阶
    oscillator.frequency.setValueAtTime(440, currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(220, currentTime + 0.3);
    
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.2, currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.4);
    
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 0.4);
  } catch (error) {
    console.warn('播放音效失败:', error);
  }
}

/**
 * 播放点击音效
 */
export function playClickSound() {
  try {
    const ctx = getAudioContext();
    const currentTime = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(800, currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, currentTime + 0.1);
    
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.1);
    
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 0.1);
  } catch (error) {
    console.warn('播放音效失败:', error);
  }
}

// 最后更新时间: 2026-02-23 12:45
// 编辑人: Trae AI
