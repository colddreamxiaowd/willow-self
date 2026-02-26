import React from 'react';
import { RefreshCw } from 'lucide-react';
import '../../styles/BookTheme.css';

function ActionBar({ onParse, onFindIntervention, onReset, loading, hasIntervention }) {
  return (
    <div className="action-bar">
      <button
        className="action-btn primary"
        onClick={onParse}
        disabled={loading}
      >
        {loading ? '解析中...' : '解析 YAML'}
      </button>
      <button
        className="action-btn"
        onClick={onFindIntervention}
        disabled={loading}
      >
        寻找干预点
      </button>
      <button
        className="action-btn"
        onClick={onReset}
        disabled={!hasIntervention}
        title="重置干预路径"
      >
        <RefreshCw size={16} />
        重置
      </button>
    </div>
  );
}

export default ActionBar;

// 最后更新时间: 2026-02-22 16:58
// 编辑人: Trae AI
// 用途: 边框栏组件，只显示国策树时
