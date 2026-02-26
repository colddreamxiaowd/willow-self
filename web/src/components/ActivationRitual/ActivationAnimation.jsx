import React, { useEffect, useState } from 'react';
import './ActivationRitual.css';

function ActivationAnimation({ policyName, onComplete, complete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const phaseTimer = setTimeout(() => setPhase(1), 100);
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2500);

    return () => {
      clearTimeout(phaseTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="activation-animation">
      {/* 金色光芒背景 */}
      <div className={`golden-glow ${phase >= 1 ? 'active' : ''}`}>
        <div className="glow-layer layer-1"></div>
        <div className="glow-layer layer-2"></div>
        <div className="glow-layer layer-3"></div>
      </div>

      {/* 中心光球 */}
      <div className={`light-orb ${phase >= 1 ? 'active' : ''}`}>
        <div className="orb-core"></div>
        <div className="orb-ring ring-1"></div>
        <div className="orb-ring ring-2"></div>
        <div className="orb-ring ring-3"></div>
      </div>

      {/* 粒子爆发效果 */}
      <div className="particle-container">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className={`particle ${phase >= 1 ? 'burst' : ''}`}
            style={{
              '--i': i,
              '--angle': `${i * 22.5}deg`,
              '--delay': `${i * 0.05}s`,
            }}
          />
        ))}
      </div>

      {/* 光线放射 */}
      <div className="light-rays">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`light-ray ${phase >= 1 ? 'shine' : ''}`}
            style={{
              '--i': i,
              '--angle': `${i * 30}deg`,
            }}
          />
        ))}
      </div>

      {/* 文字内容 */}
      <div className={`activation-text ${phase >= 1 ? 'show' : ''}`}>
        <div className="activation-icon">
          <span className="flame">🔥</span>
          <div className="icon-glow"></div>
        </div>
        <h3 className="activation-title">国策已点亮</h3>
        <p className="activation-policy-name">{policyName || '未命名国策'}</p>
        <div className="activation-sparkles">
          <span>✨</span>
          <span>✨</span>
          <span>✨</span>
        </div>
      </div>

      {/* 完成提示 */}
      {complete && (
        <div className="completion-message">
          <span className="check-mark">✓</span>
          <span>激活成功</span>
        </div>
      )}
    </div>
  );
}

export default ActivationAnimation;

// 最后更新时间: 2026-02-23 12:45
// 编辑人: Trae AI
