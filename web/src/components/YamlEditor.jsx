import React, { useCallback, memo } from 'react';
import { FileCode, Play } from 'lucide-react';
import './YamlEditor.css';
import { DEFAULT_YAML } from '../utils';

/**
 * YAML 编辑器组件
 * 提供 YAML 输入和解析功能
 */

// 性能优化：使用 memo 包装组件
const YamlEditor = memo(function YamlEditor({ value, onChange, onParse, loading }) {
  const displayValue = value ?? DEFAULT_YAML;

  // 性能优化：使用 useCallback 缓存事件处理函数
  const handleChange = useCallback((e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  }, [onChange]);

  const handleParse = useCallback(() => {
    if (onParse) {
      onParse();
    }
  }, [onParse]);

  // 计算行数
  const lineCount = displayValue.split('\n').length;

  return (
    <div className="yaml-editor">
      <div className="editor-header">
        <div className="editor-title">
          <FileCode size={18} />
          <span>YAML 编辑器</span>
        </div>
        <button
          className="parse-btn"
          onClick={handleParse}
          disabled={loading}
          aria-label={loading ? '解析中' : '解析 YAML'}
        >
          <Play size={16} />
          {loading ? '解析中...' : '解析'}
        </button>
      </div>
      <div className="editor-content">
        <textarea
          value={displayValue}
          onChange={handleChange}
          placeholder="输入 YAML 格式的国策树定义..."
          spellCheck={false}
          aria-label="YAML 编辑器"
        />
      </div>
      <div className="editor-footer">
        <span className="line-count">
          {lineCount} 行
        </span>
        <span className="char-count">
          {displayValue.length} 字符
        </span>
      </div>
    </div>
  );
});

export default YamlEditor;

// 最后更新时间: 2026-02-21 16:00
// 编辑人: Senior-Code-Review-Engineer
// 优化内容:
// 1. 使用工具函数导入默认 YAML
// 2. 使用空值合并运算符 ?? 替代 ||
// 3. 添加 aria-label 提升可访问性
