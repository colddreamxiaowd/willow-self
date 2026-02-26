import React, { memo, useMemo } from 'react';
import './LoadingAnimation.css';

const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';

const LoadingAnimation = memo(function LoadingAnimation({ 
  type = 'hexagon', 
  text = 'LOADING',
  size = 'medium' 
}) {
  return (
    <div className={`cyber-loader ${size}`}>
      {type === 'hexagon' && <HexagonLoader />}
      {type === 'circuit' && <CircuitLoader />}
      {type === 'glitch' && <GlitchLoader text={text} />}
      {type === 'scan' && <ScanLoader />}
      {type === 'matrix' && <MatrixLoader />}
      
      {type !== 'glitch' && (
        <div className="loader-text">
          <span className="text-content">{text}</span>
        </div>
      )}
    </div>
  );
});

function HexagonLoader() {
  return (
    <div className="hexagon-loader">
      <div className="hexagon-main"></div>
      <div className="hexagon-inner"></div>
    </div>
  );
}

function CircuitLoader() {
  return (
    <div className="circuit-loader">
      <div className="circuit-path">
        <div className="circuit-node"></div>
        <div className="circuit-node"></div>
        <div className="circuit-node"></div>
        <div className="circuit-node"></div>
        <div className="circuit-node"></div>
        <div className="circuit-node"></div>
        <div className="circuit-node"></div>
        <div className="circuit-node"></div>
        <div className="circuit-signal"></div>
        <div className="circuit-signal"></div>
      </div>
    </div>
  );
}

function GlitchLoader({ text }) {
  return (
    <div className="glitch-loader">
      <div className="glitch-text">{text}</div>
      <div className="glitch-bars">
        <div className="glitch-bar"></div>
        <div className="glitch-bar"></div>
        <div className="glitch-bar"></div>
      </div>
    </div>
  );
}

function ScanLoader() {
  return (
    <div className="scan-loader">
      <div className="scan-frame"></div>
      <div className="scan-line"></div>
      <div className="scan-content">
        <div className="scan-icon"></div>
      </div>
    </div>
  );
}

function MatrixLoader() {
  const columns = useMemo(() => {
    return Array.from({ length: 10 }, (_, colIndex) => ({
      id: colIndex,
      chars: Array.from({ length: 8 }, (_, rowIndex) => ({
        id: rowIndex,
        char: MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
      }))
    }));
  }, []);

  return (
    <div className="matrix-loader">
      {columns.map(column => (
        <div key={column.id} className="matrix-column">
          {column.chars.map(char => (
            <div key={char.id} className="matrix-char">{char.char}</div>
          ))}
        </div>
      ))}
      <div className="matrix-glow"></div>
    </div>
  );
}

export default LoadingAnimation;

// 最后更新时间: 2026-02-21 16:35
// 编辑人: Trae AI
