import React, { useState, useMemo } from 'react';
import {
  generateCurveData,
  immediateGratificationValue,
  delayedGratificationValue,
  compareBehaviors,
} from '../utils/discountCalc';

function DiscountVisualizer() {
  const [behavior1, setBehavior1] = useState({ name: '刷手机', immediateValue: 80, decayRate: 0.5 });
  const [behavior2, setBehavior2] = useState({ name: '去学习', futureValue: 100, growthRate: 0.1 });
  const [discountRate, setDiscountRate] = useState(0.5);

  const curve1Data = useMemo(() => 
    generateCurveData((t) => immediateGratificationValue(t, behavior1.immediateValue, behavior1.decayRate)),
    [behavior1]
  );

  const curve2Data = useMemo(() =>
    generateCurveData((t) => delayedGratificationValue(t, behavior2.futureValue, behavior2.growthRate)),
    [behavior2]
  );

  const comparison = useMemo(() =>
    compareBehaviors(behavior1, behavior2, discountRate),
    [behavior1, behavior2, discountRate]
  );

  const maxValue = Math.max(
    ...curve1Data.map(d => d.v),
    ...curve2Data.map(d => d.v)
  );

  const renderCurve = (data, color) => {
    const points = data.map((d, i) => {
      const x = (d.t / 10) * 100;
      const y = 100 - (d.v / maxValue) * 100;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    return (
      <path
        d={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    );
  };

  return (
    <div className="discount-visualizer">
      <h3 className="visualizer-title">📊 为什么你总是选择即时满足？</h3>
      
      <div className="behavior-inputs">
        <div className="behavior-input">
          <label>行为 1 (即时满足)</label>
          <input
            type="text"
            value={behavior1.name}
            onChange={(e) => setBehavior1({ ...behavior1, name: e.target.value })}
          />
        </div>
        <span className="vs">vs</span>
        <div className="behavior-input">
          <label>行为 2 (延迟满足)</label>
          <input
            type="text"
            value={behavior2.name}
            onChange={(e) => setBehavior2({ ...behavior2, name: e.target.value })}
          />
        </div>
      </div>
      
      <div className="curve-container">
        <svg viewBox="0 0 100 100" className="curve-svg">
          <line x1="0" y1="100" x2="100" y2="100" stroke="#475569" strokeWidth="0.5" />
          <line x1="0" y1="0" x2="0" y2="100" stroke="#475569" strokeWidth="0.5" />
          
          {renderCurve(curve1Data, '#ef4444')}
          {renderCurve(curve2Data, '#22c55e')}
          
          <text x="50" y="98" fontSize="4" fill="#94a3b8" textAnchor="middle">时间</text>
          <text x="2" y="50" fontSize="4" fill="#94a3b8" textAnchor="start" transform="rotate(-90, 2, 50)">价值</text>
        </svg>
        
        <div className="curve-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#ef4444' }} />
            <span>{behavior1.name}</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#22c55e' }} />
            <span>{behavior2.name}</span>
          </div>
        </div>
      </div>
      
      <div className="discount-slider">
        <label>你的贴现率 k: {discountRate.toFixed(2)}</label>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={discountRate}
          onChange={(e) => setDiscountRate(Number(e.target.value))}
        />
        <div className="slider-labels">
          <span>看重未来</span>
          <span>看重眼前</span>
        </div>
      </div>
      
      <div className="explanation-box">
        <p className="explanation-icon">💡</p>
        <p className="explanation-text">{comparison.explanation}</p>
        <p className="explanation-formula">
          公式: I = ∫ V(τ) · W(τ) dτ，其中 W(τ) = 1 / (1 + k·τ)
        </p>
      </div>
    </div>
  );
}

export default DiscountVisualizer;

// 最后更新时间: 2026-02-22 14:20
// 编辑人: Trae AI
// 用途: 双曲贴现可视化组件，帮助用户理解即时满足与延迟满足的价值比较
