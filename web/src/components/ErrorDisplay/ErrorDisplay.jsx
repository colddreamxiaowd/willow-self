import React, { useState, useCallback, useEffect } from 'react';
import { 
  X, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp,
  FileCode,
  MapPin,
  CheckCircle2,
  Copy,
  RotateCcw
} from 'lucide-react';
import './ErrorDisplay.css';

/**
 * 友好的错误提示组件
 * 
 * 功能特性：
 * 1. 错误分类显示（语法错误、验证错误、运行时错误）
 * 2. 可视化错误定位（行号、列号高亮）
 * 3. 非技术化错误描述
 * 4. 修复建议和示例
 * 5. 一键复制错误信息
 * 6. 展开/收起详情
 */

// 错误类型配置
const ERROR_TYPES = {
  SYNTAX: {
    icon: FileCode,
    className: 'error-syntax',
    title: '格式问题',
    color: '#fbbf24'
  },
  VALIDATION: {
    icon: AlertTriangle,
    className: 'error-validation',
    title: '内容检查',
    color: '#f97316'
  },
  RUNTIME: {
    icon: AlertCircle,
    className: 'error-runtime',
    title: '运行异常',
    color: '#ef4444'
  },
  INFO: {
    icon: Info,
    className: 'error-info',
    title: '提示信息',
    color: '#22d3ee'
  }
};

// 错误消息映射表 - 将技术错误转换为友好描述
const ERROR_MESSAGE_MAP = {
  // YAML 解析错误
  'YAML parse error': {
    type: 'SYNTAX',
    friendlyMessage: 'YAML 格式不正确',
    suggestion: '请检查缩进是否统一（建议使用空格而非制表符），并确保冒号后有空格。'
  },
  'unexpected end of the stream': {
    type: 'SYNTAX',
    friendlyMessage: 'YAML 内容似乎不完整',
    suggestion: '请检查是否遗漏了必要的字段（如 id、description）或括号/引号未闭合。'
  },
  'can not read an implicit mapping pair': {
    type: 'SYNTAX',
    friendlyMessage: '键值对格式有误',
    suggestion: '确保每个键后面都有冒号和空格，例如：id: my-policy'
  },
  'duplicated mapping key': {
    type: 'SYNTAX',
    friendlyMessage: '发现了重复的键名',
    suggestion: '请检查 YAML 中是否有重复的字段名，每个键名在同一层级应该是唯一的。'
  },
  // 验证错误
  '数据验证失败': {
    type: 'VALIDATION',
    friendlyMessage: '数据内容需要调整',
    suggestion: '请检查所有必填字段是否已填写，数值是否在有效范围内（1-10）。'
  },
  'YAML 必须包含 id 字段': {
    type: 'VALIDATION',
    friendlyMessage: '缺少标识符',
    suggestion: '请在根节点添加 id 字段，例如：id: my-life-policy'
  },
  'YAML 必须包含 description 字段': {
    type: 'VALIDATION',
    friendlyMessage: '缺少描述信息',
    suggestion: '请在根节点添加 description 字段，简要描述这个国策树的目标。'
  },
  '节点必须包含有效的 id 字段': {
    type: 'VALIDATION',
    friendlyMessage: '某个节点缺少标识符',
    suggestion: '请检查所有节点是否都有 id 字段，用于唯一标识每个节点。'
  },
  '节点必须包含有效的 description 字段': {
    type: 'VALIDATION',
    friendlyMessage: '某个节点缺少描述',
    suggestion: '请为每个节点添加 description，描述该节点的具体内容。'
  },
  'type 必须是以下值之一': {
    type: 'VALIDATION',
    friendlyMessage: '节点类型不正确',
    suggestion: 'type 字段只能是以下值之一：ROOT（根节点）、GOAL（目标）、ACTION（行动）、MILESTONE（里程碑）'
  },
  '必须在 1-10 之间': {
    type: 'VALIDATION',
    friendlyMessage: '评分数值超出范围',
    suggestion: 'resistance_score、coupling_score、maintenance_cost、impact 等评分字段的值必须在 1 到 10 之间。'
  },
  '输入内容超过最大限制': {
    type: 'VALIDATION',
    friendlyMessage: '内容太长啦',
    suggestion: 'YAML 内容超过了 1MB 限制，请简化内容或拆分为多个国策树。'
  },
  // 运行时错误
  '请先解析 YAML 数据': {
    type: 'INFO',
    friendlyMessage: '还没有解析数据哦',
    suggestion: '请先点击"解析 YAML"按钮加载国策树，然后再执行其他操作。'
  },
  '未找到合适的干预点': {
    type: 'INFO',
    friendlyMessage: '找不到干预点',
    suggestion: '国策树需要至少 3 层深度才能找到干预点。请添加更多子节点。'
  },
  'YAML 解析结果为空': {
    type: 'VALIDATION',
    friendlyMessage: '没有解析到内容',
    suggestion: '请确保 YAML 编辑器中有内容，并且格式正确。'
  }
};

/**
 * 解析错误信息，提取行号和列号
 */
const parseErrorLocation = (errorMessage) => {
  if (!errorMessage) return null;

  // 匹配行号 (line X)
  const lineMatch = errorMessage.match(/line\s+(\d+)/i);
  // 匹配列号 (column X)
  const columnMatch = errorMessage.match(/column\s+(\d+)/i);
  // 匹配位置信息
  const positionMatch = errorMessage.match(/position\s+(\d+)/i);

  return {
    line: lineMatch ? parseInt(lineMatch[1], 10) : null,
    column: columnMatch ? parseInt(columnMatch[1], 10) : null,
    position: positionMatch ? parseInt(positionMatch[1], 10) : null
  };
};

/**
 * 获取友好的错误信息
 */
const getFriendlyError = (errorMessage) => {
  if (!errorMessage) return null;

  // 查找匹配的错误映射
  for (const [key, value] of Object.entries(ERROR_MESSAGE_MAP)) {
    if (errorMessage.includes(key)) {
      return {
        ...value,
        originalMessage: errorMessage
      };
    }
  }

  // 默认返回运行时错误
  return {
    type: 'RUNTIME',
    friendlyMessage: '遇到了一些问题',
    suggestion: '请检查输入内容是否正确，或尝试刷新页面后重试。',
    originalMessage: errorMessage
  };
};

/**
 * 错误详情组件
 */
const ErrorDetails = ({ location, originalMessage, yamlContent }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(originalMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [originalMessage]);

  // 获取错误行附近的代码
  const getContextLines = () => {
    if (!yamlContent || !location.line) return [];
    
    const lines = yamlContent.split('\n');
    const start = Math.max(0, location.line - 3);
    const end = Math.min(lines.length, location.line + 2);
    
    return lines.slice(start, end).map((content, idx) => ({
      number: start + idx + 1,
      content,
      isError: start + idx + 1 === location.line
    }));
  };

  const contextLines = getContextLines();

  return (
    <div className="error-details">
      <button 
        className="details-toggle"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? (
          <><ChevronUp size={16} /> 收起详情</>
        ) : (
          <><ChevronDown size={16} /> 查看详情</>
        )}
      </button>

      {showDetails && (
        <div className="details-content">
          {/* 位置信息 */}
          {location.line && (
            <div className="location-info">
              <MapPin size={14} />
              <span>第 {location.line} 行</span>
              {location.column && <span>，第 {location.column} 列</span>}
            </div>
          )}

          {/* 代码上下文 */}
          {contextLines.length > 0 && (
            <div className="code-context">
              {contextLines.map((line) => (
                <div 
                  key={line.number}
                  className={`context-line ${line.isError ? 'error-line' : ''}`}
                >
                  <span className="line-number">{line.number}</span>
                  <span className="line-content">{line.content || ' '}</span>
                  {line.isError && <span className="error-indicator">← 这里</span>}
                </div>
              ))}
            </div>
          )}

          {/* 原始错误信息 */}
          <div className="original-error">
            <div className="original-header">
              <span>原始错误信息</span>
              <button 
                className={`copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
              >
                {copied ? (
                  <><CheckCircle2 size={14} /> 已复制</>
                ) : (
                  <><Copy size={14} /> 复制</>
                )}
              </button>
            </div>
            <code className="error-code">{originalMessage}</code>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 错误提示卡片组件
 */
const ErrorCard = ({ error, yamlContent, onClose, onRetry }) => {
  const [isExiting, setIsExiting] = useState(false);

  const friendlyError = getFriendlyError(error);
  const location = parseErrorLocation(error);
  const errorConfig = ERROR_TYPES[friendlyError.type];
  const IconComponent = errorConfig.icon;

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  }, [onClose]);

  const handleRetry = useCallback(() => {
    if (onRetry) onRetry();
  }, [onRetry]);

  // 自动关闭（仅 INFO 类型）
  useEffect(() => {
    if (friendlyError.type === 'INFO') {
      const timer = setTimeout(() => {
        handleClose();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [friendlyError.type, handleClose]);

  return (
    <div className={`error-card ${errorConfig.className} ${isExiting ? 'exiting' : ''}`}>
      {/* 图标区域 */}
      <div className="error-icon-wrapper" style={{ backgroundColor: `${errorConfig.color}20` }}>
        <IconComponent size={24} style={{ color: errorConfig.color }} />
      </div>

      {/* 内容区域 */}
      <div className="error-content">
        <div className="error-header">
          <div className="error-type-badge" style={{ 
            backgroundColor: `${errorConfig.color}20`,
            color: errorConfig.color 
          }}>
            {errorConfig.title}
          </div>
          <button 
            className="error-close"
            onClick={handleClose}
            aria-label="关闭"
          >
            <X size={18} />
          </button>
        </div>

        <h4 className="error-title">{friendlyError.friendlyMessage}</h4>
        
        {/* 建议区域 */}
        <div className="error-suggestion">
          <Lightbulb size={16} className="suggestion-icon" />
          <p>{friendlyError.suggestion}</p>
        </div>

        {/* 详情区域 */}
        <ErrorDetails 
          location={location}
          originalMessage={friendlyError.originalMessage}
          yamlContent={yamlContent}
        />

        {/* 操作按钮 */}
        <div className="error-actions">
          {onRetry && (
            <button className="btn-retry" onClick={handleRetry}>
              <RotateCcw size={16} />
              重试
            </button>
          )}
          {location.line && (
            <button 
              className="btn-goto"
              onClick={() => {
                // 触发跳转到指定行的事件
                window.dispatchEvent(new CustomEvent('gotoLine', { 
                  detail: { line: location.line, column: location.column }
                }));
              }}
            >
              <MapPin size={16} />
              跳转到第 {location.line} 行
            </button>
          )}
        </div>
      </div>

      {/* 进度条（自动关闭时显示） */}
      {friendlyError.type === 'INFO' && (
        <div className="auto-close-progress">
          <div className="progress-bar" />
        </div>
      )}
    </div>
  );
};

/**
 * 错误列表容器组件
 */
const ErrorDisplay = ({ errors, yamlContent, onClose, onRetry, maxErrors = 3 }) => {
  // 确保 errors 是数组
  const errorList = Array.isArray(errors) ? errors : errors ? [errors] : [];
  
  // 限制显示的错误数量
  const displayErrors = errorList.slice(0, maxErrors);
  const remainingCount = errorList.length - maxErrors;

  if (errorList.length === 0) return null;

  return (
    <div className="error-display-container">
      {displayErrors.map((error, index) => (
        <ErrorCard
          key={index}
          error={error}
          yamlContent={yamlContent}
          onClose={() => onClose?.(index)}
          onRetry={index === 0 ? onRetry : undefined}
        />
      ))}
      
      {remainingCount > 0 && (
        <div className="more-errors">
          还有 {remainingCount} 个错误...
        </div>
      )}
    </div>
  );
};

export default ErrorDisplay;
export { getFriendlyError, parseErrorLocation };

// 最后更新时间: 2026-02-21 16:45
// 编辑人: UI-Design-Specialist
// 功能说明: 友好的错误提示组件，将技术错误转换为非技术化语言
