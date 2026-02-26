import React, { memo, useCallback, useState } from 'react';
import { HelpCircle, Plus, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import './PolicyForm.css';

const NODE_TYPES = [
  { value: 'ROOT', label: '核心目标', emoji: '🎯', desc: '最想改变的大方向' },
  { value: 'GOAL', label: '子目标', emoji: '📌', desc: '分解出的小目标' },
  { value: 'ACTION', label: '具体行动', emoji: '✅', desc: '可以立即做的事' },
];

const PARAM_CONFIG = {
  resistance: {
    label: '开始有多难？',
    question: '开始做这件事有多困难？',
    help: '1分 = 几乎不用努力就能开始，10分 = 需要很大意志力',
    labels: {
      1: '非常容易',
      3: '有点难',
      5: '中等',
      7: '比较难',
      10: '非常困难',
    },
  },
  coupling: {
    label: '会带动其他事吗？',
    question: '做这件事会带动其他事吗？',
    help: '例如：早起可能会让你有时间吃早餐、运动、读书...',
    labels: {
      1: '完全独立',
      3: '影响一点',
      5: '有一些影响',
      7: '影响挺多',
      10: '会带动很多事',
    },
  },
  maintenance: {
    label: '需要多少精力维持？',
    question: '需要多少精力来维持这个习惯？',
    help: '1分 = 设定后自动运行，10分 = 每天都需要意志力',
    labels: {
      1: '几乎不用管',
      3: '偶尔提醒',
      5: '需要关注',
      7: '持续努力',
      10: '很大投入',
    },
  },
};

const PolicyForm = memo(function PolicyForm({ 
  node, 
  onChange, 
  onDelete, 
  onAddChild,
  depth = 0 
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const [showHelp, setShowHelp] = useState(null);

  const handleFieldChange = useCallback((field, value) => {
    onChange({ ...node, [field]: value });
  }, [node, onChange]);

  const toggleExpand = () => setExpanded(!expanded);

  const renderSlider = (field, config) => {
    const value = node[field] || 5;
    return (
      <div className="form-field slider-field" key={field}>
        <div className="field-header">
          <label className="field-label">{config.label}</label>
          <button 
            className="help-trigger"
            onClick={() => setShowHelp(showHelp === field ? null : field)}
          >
            <HelpCircle size={14} />
          </button>
        </div>
        
        {showHelp === field && (
          <div className="field-help">
            <p>{config.question}</p>
            <p className="help-detail">{config.help}</p>
          </div>
        )}

        <div className="slider-wrapper">
          <div className="slider-value">
            <span className="value-number">{value}</span>
            <span className="value-label">{config.labels[value] || ''}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={value}
            onChange={(e) => handleFieldChange(field, parseInt(e.target.value))}
            className="form-slider"
          />
          <div className="slider-extremes">
            <span>1</span>
            <span>10</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`policy-form depth-${depth}`}>
      <div className="form-header" onClick={toggleExpand}>
        <div className="header-left">
          <span className="expand-icon">
            {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </span>
          <span className="node-emoji">
            {NODE_TYPES.find(t => t.value === node.type)?.emoji || '📝'}
          </span>
          <span className="node-title">
            {node.description || '未命名节点'}
          </span>
        </div>
        <div className="header-actions">
          {depth > 0 && (
            <button 
              className="action-btn delete"
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              title="删除"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="form-body">
          <div className="form-field">
            <label className="field-label">这是什么？</label>
            <input
              type="text"
              className="form-input"
              value={node.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="用一句话描述..."
            />
          </div>

          <div className="form-field">
            <label className="field-label">节点类型</label>
            <div className="type-selector">
              {NODE_TYPES.map(type => (
                <button
                  key={type.value}
                  className={`type-option ${node.type === type.value ? 'selected' : ''}`}
                  onClick={() => handleFieldChange('type', type.value)}
                >
                  <span className="type-emoji">{type.emoji}</span>
                  <span className="type-label">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {renderSlider('resistance_score', PARAM_CONFIG.resistance)}
          {renderSlider('coupling_score', PARAM_CONFIG.coupling)}
          {renderSlider('maintenance_cost', PARAM_CONFIG.maintenance)}

          <div className="form-actions">
            <button 
              className="add-child-btn"
              onClick={() => onAddChild()}
            >
              <Plus size={14} />
              添加子节点
            </button>
          </div>

          {node.children && node.children.length > 0 && (
            <div className="children-list">
              {node.children.map((child, index) => (
                <PolicyForm
                  key={child.id || index}
                  node={child}
                  depth={depth + 1}
                  onChange={(updated) => {
                    const newChildren = [...node.children];
                    newChildren[index] = updated;
                    handleFieldChange('children', newChildren);
                  }}
                  onDelete={() => {
                    const newChildren = node.children.filter((_, i) => i !== index);
                    handleFieldChange('children', newChildren);
                  }}
                  onAddChild={() => {
                    const newChild = {
                      id: `node_${Date.now()}`,
                      description: '',
                      type: 'ACTION',
                      resistance_score: 5,
                      coupling_score: 5,
                      maintenance_cost: 5,
                      children: [],
                    };
                    handleFieldChange('children', [...(node.children || []), newChild]);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export const PolicyFormContainer = memo(function PolicyFormContainer({ 
  data, 
  onChange,
  onGenerateYaml 
}) {
  const handleRootChange = useCallback((updated) => {
    onChange(updated);
  }, [onChange]);

  const handleAddChild = useCallback(() => {
    const newChild = {
      id: `node_${Date.now()}`,
      description: '',
      type: 'GOAL',
      resistance_score: 5,
      coupling_score: 5,
      maintenance_cost: 5,
      children: [],
    };
    onChange({
      ...data,
      children: [...(data.children || []), newChild],
    });
  }, [data, onChange]);

  return (
    <div className="policy-form-container">
      <div className="form-toolbar">
        <h3 className="toolbar-title">
          <Sparkles size={16} />
          可视化编辑器
        </h3>
        <button className="generate-btn" onClick={onGenerateYaml}>
          生成 YAML
        </button>
      </div>

      <div className="forms-area">
        <PolicyForm
          node={data}
          depth={0}
          onChange={handleRootChange}
          onDelete={() => {}}
          onAddChild={handleAddChild}
        />
      </div>
    </div>
  );
});

export function formToYaml(node, indent = 0) {
  const spaces = '  '.repeat(indent);
  let yaml = `${spaces}- id: ${node.id || 'unknown'}
${spaces}  description: "${node.description || ''}"
${spaces}  type: ${node.type || 'ACTION'}
${spaces}  resistance_score: ${node.resistance_score || 5}
${spaces}  coupling_score: ${node.coupling_score || 5}
${spaces}  maintenance_cost: ${node.maintenance_cost || 5}`;

  if (node.children && node.children.length > 0) {
    yaml += `\n${spaces}  children:`;
    node.children.forEach(child => {
      yaml += '\n' + formToYaml(child, indent + 2);
    });
  }

  return yaml;
}

export function yamlToForm(yamlData) {
  if (!yamlData) {
    return {
      id: 'root',
      description: '',
      type: 'ROOT',
      resistance_score: 5,
      coupling_score: 5,
      maintenance_cost: 5,
      children: [],
    };
  }

  const convertNode = (node) => ({
    id: node.id || `node_${Date.now()}`,
    description: node.description || '',
    type: node.type || 'ACTION',
    resistance_score: node.resistance_score || 5,
    coupling_score: node.coupling_score || 5,
    maintenance_cost: node.maintenance_cost || 5,
    children: node.children ? node.children.map(convertNode) : [],
  });

  return convertNode(yamlData);
}

export default PolicyForm;

// 最后更新时间: 2026-02-21 18:00
// 编辑人: Trae AI
// 说明: 可视化表单组件，用滑块和下拉框替代YAML手动输入
