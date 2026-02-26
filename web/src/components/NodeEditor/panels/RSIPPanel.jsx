import React, { useState, useCallback } from 'react';

const QUESTIONS = [
  '这个状态是什么导致的？',
  '在你做这件事之前，发生了什么？',
  '有没有什么外部因素让你不得不这样？',
  '这个状态，你能自己控制吗？',
];

function RSIPPanel({ 
  currentState, 
  onAddPredecessor, 
  isComplete, 
  interventionPoint 
}) {
  const [input, setInput] = useState('');
  const [resistance, setResistance] = useState(5);
  const [coupling, setCoupling] = useState(5);
  const [maintenance, setMaintenance] = useState(5);
  const [questionIndex, setQuestionIndex] = useState(0);

  const handleSubmit = useCallback(() => {
    if (!input.trim()) return;
    
    onAddPredecessor({
      description: input.trim(),
      resistance,
      coupling,
      maintenance,
    });
    
    setInput('');
    setResistance(5);
    setCoupling(5);
    setMaintenance(5);
    setQuestionIndex(prev => (prev + 1) % QUESTIONS.length);
  }, [input, resistance, coupling, maintenance, onAddPredecessor]);

  if (isComplete && interventionPoint) {
    return (
      <div className="rsip-panel complete">
        <div className="intervention-found">
          <h3>🌟 找到干预点！</h3>
          <p className="intervention-description">
            "{interventionPoint.description}"
          </p>
          <p className="intervention-controllability">
            可控性高达 {Math.round(interventionPoint.controllability * 100)}%
          </p>
          <p className="intervention-message">
            这就是你真正能改变的地方！
          </p>
          <button className="btn-primary">
            开始执行这个行动
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rsip-panel">
      <div className="rsip-current-state">
        <span className="rsip-label">📍 当前状态:</span>
        <span className="rsip-state">{currentState || '请输入你的困扰'}</span>
      </div>
      
      <div className="rsip-question">
        <span className="rsip-question-icon">🤔</span>
        <span className="rsip-question-text">
          {QUESTIONS[questionIndex]}
        </span>
      </div>
      
      <div className="rsip-input-group">
        <textarea
          className="rsip-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="描述导致这个状态的原因..."
          rows={3}
        />
      </div>
      
      <div className="rsip-sliders">
        <div className="slider-group">
          <label>执行难度: {resistance}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={resistance}
            onChange={(e) => setResistance(Number(e.target.value))}
          />
          <div className="slider-labels">
            <span>容易</span>
            <span>困难</span>
          </div>
        </div>
        
        <div className="slider-group">
          <label>外部依赖: {coupling}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={coupling}
            onChange={(e) => setCoupling(Number(e.target.value))}
          />
          <div className="slider-labels">
            <span>独立</span>
            <span>依赖</span>
          </div>
        </div>
        
        <div className="slider-group">
          <label>维护成本: {maintenance}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={maintenance}
            onChange={(e) => setMaintenance(Number(e.target.value))}
          />
          <div className="slider-labels">
            <span>低</span>
            <span>高</span>
          </div>
        </div>
      </div>
      
      <button 
        className="btn-primary rsip-submit"
        onClick={handleSubmit}
        disabled={!input.trim()}
      >
        继续追问
      </button>
    </div>
  );
}

export default RSIPPanel;

// 最后更新时间: 2026-02-22 14:10
// 编辑人: Trae AI
// 用途: RSIP 递归追问面板，引导用户找到干预点
