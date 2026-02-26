import React, { useState, useMemo } from 'react';
import { allPolicyTemplates as policyTemplates, allTemplateCategories as templateCategories } from '../../data/policyTemplates';
import { calculateTreeLayout } from '../PolicyTreeEditor/utils/treeLayout';
import './PolicyTemplates.css';

function TemplateCard({ template, onPreview }) {
  return (
    <div className="template-card">
      <div className="template-icon">{template.icon}</div>
      <div className="template-content">
        <h3 className="template-name">{template.name}</h3>
        <p className="template-description">{template.description}</p>
        <div className="template-meta">
          <span className="template-category">{template.category}</span>
          <span className={`template-difficulty difficulty-${template.difficulty}`}>
            {template.difficulty}
          </span>
        </div>
      </div>
      <div className="template-actions">
        <button 
          className="template-btn preview-btn"
          onClick={() => onPreview(template)}
        >
          预览
        </button>
      </div>
    </div>
  );
}

function TemplatePreview({ template, onClose }) {
  const { nodes, edges } = useMemo(() => {
    return calculateTreeLayout(template.tree);
  }, [template]);

  return (
    <div className="template-preview-overlay" onClick={onClose}>
      <div className="template-preview-modal" onClick={e => e.stopPropagation()}>
        <div className="preview-header">
          <div className="preview-title">
            <span className="preview-icon">{template.icon}</span>
            <h2>{template.name}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="preview-info">
          <p>{template.description}</p>
          <div className="preview-stats">
            <span>节点数: {nodes.length}</span>
            <span>难度: {template.difficulty}</span>
          </div>
        </div>

        <div className="preview-tree">
          <div className="tree-visualization">
            {nodes.map(node => (
              <div
                key={node.id}
                className={`preview-node tier-${node.data.tier} status-${node.data.status}`}
                style={{
                  left: node.position.x * 0.4 + 20,
                  top: node.position.y * 0.4 + 20
                }}
              >
                <span className="node-name">{node.data.name}</span>
              </div>
            ))}
            <svg className="preview-edges">
              {edges.map(edge => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;
                
                const x1 = sourceNode.position.x * 0.4 + 60;
                const y1 = sourceNode.position.y * 0.4 + 40;
                const x2 = targetNode.position.x * 0.4 + 60;
                const y2 = targetNode.position.y * 0.4 + 20;
                
                return (
                  <line
                    key={edge.id}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#8B7D6B"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </div>
        </div>

        <div className="preview-tree-structure">
          <h4>国策树结构</h4>
          <div className="tree-list">
            {renderTreeNode(template.tree, 0)}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderTreeNode(node, level) {
  const indent = level * 20;
  const statusClass = node.status === 'active' ? 'active' : 'inactive';
  
  return (
    <div key={node.id} className="tree-node-item">
      <div 
        className={`node-item ${statusClass}`}
        style={{ paddingLeft: indent + 10 }}
      >
        <span className="node-bullet">{node.status === 'active' ? '●' : '○'}</span>
        <span className="node-title">{node.name}</span>
        <span className="node-desc">{node.description}</span>
      </div>
      {node.children && node.children.map(child => renderTreeNode(child, level + 1))}
    </div>
  );
}

function PolicyTemplates() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = useMemo(() => {
    return policyTemplates.filter(template => {
      const matchesCategory = selectedCategory === 'all' || 
        template.category === templateCategories.find(c => c.id === selectedCategory)?.name;
      const matchesSearch = !searchQuery || 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="policy-templates">
      <div className="templates-header">
        <h2>国策模版</h2>
        <p className="templates-subtitle">
          选择一个模版作为起点，快速开始你的国策树设计
        </p>
      </div>

      <div className="templates-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索模版..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="category-tabs">
          {templateCategories.map(category => (
            <button
              key={category.id}
              className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="templates-grid">
        {filteredTemplates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            onPreview={setPreviewTemplate}
          />
        ))}
        {filteredTemplates.length === 0 && (
          <div className="no-templates">
            <p>没有找到匹配的模版</p>
          </div>
        )}
      </div>

      {previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </div>
  );
}

export default PolicyTemplates;

// 最后更新时间: 2026-02-23 11:00
// 编辑人: Trae AI
// 用途: 国策树模板展示组件，提供预设模板供用户参考
