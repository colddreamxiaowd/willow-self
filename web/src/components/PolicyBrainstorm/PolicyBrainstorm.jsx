import React, { useState, useCallback, useEffect, useRef } from 'react';
import { brainstormTemplates, brainstormCategories, policyPrinciples } from '../../data/brainstormTemplates';
import { usePolicyTreeContext } from '../../contexts/PolicyTreeContext';
import './PolicyBrainstorm.css';

// 国策卡片组件
function PolicyCard({ policy, onSelect, isSelected, onPreview, onAddToPolicyTree, isAdding, addingTemplateId }) {
  return (
    <div 
      className={`policy-card ${isSelected ? 'selected' : ''} ${policy.recommended ? 'recommended' : ''}`}
      onClick={() => onSelect(policy)}
    >
      {policy.recommended && <span className="recommend-badge">👍 推荐</span>}
      <div className="policy-icon">{policy.icon}</div>
      <h4 className="policy-name">{policy.name}</h4>
      <p className="policy-description">{policy.description}</p>
      
      <div className="policy-meta">
        <span className={`difficulty difficulty-${policy.difficulty}`}>
          {policy.difficulty === 'easy' ? '🟢 简单' : 
           policy.difficulty === 'medium' ? '🟡 中等' : '🔴 较难'}
        </span>
        <span className="leverage">杠杆: {policy.leverage}x</span>
      </div>
      
      <div className="policy-tags">
        {policy.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <div className="policy-actions">
        <button 
          className="preview-btn"
          onClick={(e) => {
            e.stopPropagation();
            onPreview(policy);
          }}
        >
          查看详情
        </button>
        
        {/* 新增：添加到国策树按钮 */}
        <button
          className="add-to-policy-tree-btn"
          onClick={(e) => {
            e.stopPropagation();
            onAddToPolicyTree(policy);
          }}
          disabled={isAdding && addingTemplateId === policy.id}
        >
          {isAdding && addingTemplateId === policy.id ? '添加中...' : '添加到国策树'}
        </button>
      </div>
    </div>
  );
}

// 详情弹窗组件
function PolicyDetailModal({ policy, onClose, onAdd }) {
  if (!policy) return null;

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={e => e.stopPropagation()}>
        <div className="detail-header">
          <span className="detail-icon">{policy.icon}</span>
          <h2>{policy.name}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="detail-content">
          <section className="detail-section">
            <h3>💡 核心思路</h3>
            <p>{policy.coreIdea}</p>
          </section>

          <section className="detail-section">
            <h3>📝 具体规则</h3>
            <ul className="rule-list">
              {policy.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </section>

          <section className="detail-section">
            <h3>✅ 成功标准</h3>
            <p>{policy.successCriteria}</p>
          </section>

          <section className="detail-section">
            <h3>⚠️ 常见陷阱</h3>
            <ul className="trap-list">
              {policy.traps.map((trap, idx) => (
                <li key={idx}>{trap}</li>
              ))}
            </ul>
          </section>

          {policy.upgradePath && (
            <section className="detail-section">
              <h3>🚀 升级路径</h3>
              <div className="upgrade-path">
                {policy.upgradePath.map((step, idx) => (
                  <div key={idx} className="upgrade-step">
                    <span className="step-level">+{idx}</span>
                    <span className="step-desc">{step}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="detail-section">
            <h3>🎯 适用场景</h3>
            <p>{policy.applicableScenarios}</p>
          </section>
        </div>

        <div className="detail-actions">
          <button className="add-btn" onClick={() => onAdd(policy)}>
            添加到我的国策树
          </button>
          <button className="cancel-btn" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

// 设计原则提示 - 书签风格
function PrinciplesTip() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef(null);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setIsAnimating(true);
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % policyPrinciples.length;
        setTimeout(() => setIsAnimating(false), 500);
        return nextIndex;
      });
    }, 6000);
  }, []);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
    stopAutoPlay();
  }, [stopAutoPlay]);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
    startAutoPlay();
  }, [startAutoPlay]);

  const handleDotClick = useCallback((index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  return (
    <div 
      className="principles-bookmark"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="bookmark-ribbon">
        <div className="ribbon-text">RSIP 方法论</div>
      </div>
      
      <div className="bookmark-content">
        <div className="principle-number">
          <span className="handwritten">#{currentIndex + 1}</span>
        </div>
        
        <div className={`principle-text ${isAnimating ? 'animating' : ''}`}>
          <div className="principle-quote">
            <span className="quote-mark">"</span>
            {policyPrinciples[currentIndex]}
            <span className="quote-mark">"</span>
          </div>
          
          <div className="principle-annotation">
            <span className="handwritten-small">
              {getPrincipleAnnotation(currentIndex)}
            </span>
          </div>
        </div>
        
        <div className="bookmark-dots">
          {policyPrinciples.map((_, idx) => (
            <button
              key={idx}
              className={`bookmark-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(idx)}
              aria-label={`第 ${idx + 1} 条原则`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
      
      <div className="bookmark-tassel">
        <div className="tassel-line"></div>
        <div className="tassel-knot"></div>
      </div>
      
      {isPaused && (
        <div className="pause-indicator">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        </div>
      )}
    </div>
  );
}

function getPrincipleAnnotation(index) {
  const annotations = [
    '从鸡毛蒜皮开始，能拆就拆',
    '先解决简单问题，让难题自然变简单',
    '慎重设定边界，一次=永远',
    '在自由意志可干预的位置设置规则',
    '用小确胜积累，不要奢求一蹴而就',
    '国策要在最糟糕的一天也能轻松存活',
    '用最小成本撬动最大改变',
    '失败了就悔棋重来，直到找到最优路径'
  ];
  return annotations[index] || '';
}

// 主组件
function PolicyBrainstorm({ onAddToPolicyTree, onAddSuccess }) {
  // 使用统一数据 Hook
  const { nodes: contextNodes, addNode } = usePolicyTreeContext();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewPolicy, setPreviewPolicy] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  
  // 新增：添加到国策树的状态管理
  const [isAdding, setIsAdding] = useState(false);
  const [addingTemplateId, setAddingTemplateId] = useState(null);

  // 过滤国策
  const filteredPolicies = React.useMemo(() => {
    return brainstormTemplates.filter(policy => {
      const matchesCategory = selectedCategory === 'all' || policy.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDifficulty = difficultyFilter === 'all' || policy.difficulty === difficultyFilter;
      return matchesCategory && matchesSearch && matchesDifficulty;
    });
  }, [selectedCategory, searchQuery, difficultyFilter]);

  // 选择/取消选择国策
  const togglePolicy = useCallback((policy) => {
    setSelectedPolicies(prev => {
      const exists = prev.find(p => p.id === policy.id);
      if (exists) {
        return prev.filter(p => p.id !== policy.id);
      }
      return [...prev, policy];
    });
  }, []);

  // 添加国策到树
  const addPolicyToTree = useCallback((policy) => {
    togglePolicy(policy);
    setPreviewPolicy(null);
  }, [togglePolicy]);

  // 新增：从模板添加到国策树（使用统一 Hook）
  const handleAddToPolicyTree = useCallback(async (policy) => {
    if (isAdding) return;
    
    setIsAdding(true);
    setAddingTemplateId(policy.id);
    
    try {
      console.log('=== [Brainstorm] 开始添加到国策树 ===');
      console.log('[Brainstorm] 模板:', policy.name);
      
      // 生成新国策节点
      const newNode = generatePolicyNodeFromTemplate(policy);
      console.log('[Brainstorm] 生成的新节点:', newNode);
      
      // 使用统一 Hook 添加节点（自动保存到 localStorage）
      if (addNode) {
        // 为新节点分配位置（避免重叠）
        const maxY = contextNodes?.reduce((max, node) => Math.max(max, node.position?.y || 0), 0) || 0;
        const newNodeWithPosition = {
          ...newNode,
          position: {
            x: 100 + Math.random() * 100,
            y: maxY + 150
          }
        };
        
        console.log('[Brainstorm] 新节点位置:', newNodeWithPosition.position);
        
        // 添加节点（自动保存）
        addNode(newNodeWithPosition);
        
        console.log('[Brainstorm] 节点已添加');
      } else {
        console.log('[Brainstorm] addNode 不可用，使用备用方案');
        // 备用：直接保存到 localStorage
        const existingData = localStorage.getItem('policytree_editor_data');
        const parsedExisting = existingData ? JSON.parse(existingData) : null;
        const currentNodes = parsedExisting?.nodes || [];
        const maxY = currentNodes.reduce((max, node) => Math.max(max, node.position?.y || 0), 0);
        const newNodeWithPosition = {
          ...newNode,
          position: { x: 100 + Math.random() * 100, y: maxY + 150 }
        };
        
        const data = {
          version: '2.1',
          timestamp: new Date().toISOString(),
          nodes: [...currentNodes, newNodeWithPosition],
          edges: parsedExisting?.edges || []
        };
        localStorage.setItem('policytree_editor_data', JSON.stringify(data));
      }
      
      // 调用回调
      if (onAddToPolicyTree) {
        onAddToPolicyTree(newNode);
      }
      
      // 成功提示
      alert(`"${policy.name}"已添加到国策树`);
      if (onAddSuccess) onAddSuccess();
      
      console.log('=== [Brainstorm] 添加完成 ===');
    } catch (error) {
      console.error('[Brainstorm] 添加失败:', error);
      alert('添加失败：' + (error.message || '请重试'));
    } finally {
      setIsAdding(false);
      setAddingTemplateId(null);
    }
  }, [isAdding, contextNodes, addNode, onAddToPolicyTree, onAddSuccess]);

  // 新增：从模板生成国策节点
  const nodeIdCounter = useRef(0);
  function generatePolicyNodeFromTemplate(template, inheritConfig = true) {
    nodeIdCounter.current += 1;
    const uniqueId = `policy-${Date.now()}-${nodeIdCounter.current}`;
    return {
      id: uniqueId,
      type: 'policy',
      position: { x: 0, y: 0 },
      data: {
        id: uniqueId,
        name: template.name,
        description: template.description,
        tier: template.tier,
        parentId: null,
        status: 'inactive',
        enhancement: 0,
        enhancementConfig: inheritConfig ? template.enhancementConfig : {
          mode: 'auto',
          autoConfig: {
            baseValue: '1',
            step: 1,
            unit: '次',
            format: '强化{value}次'
          }
        }
      }
    };
  }

  return (
    <div className="policy-brainstorm">
      <div className="brainstorm-header">
        <h1>🎯 国策模板 Brainstorm</h1>
        <p className="subtitle">
          基于 RSIP 方法论，从零开始构建你的国策树
        </p>
      </div>

      <PrinciplesTip />

      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索国策..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="category-tabs">
          {brainstormCategories.map(cat => (
            <button
              key={cat.id}
              className={`tab ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
        <div className="difficulty-filter">
          <select 
            value={difficultyFilter} 
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="all">全部难度</option>
            <option value="easy">🟢 简单</option>
            <option value="medium">🟡 中等</option>
            <option value="hard">🔴 较难</option>
          </select>
        </div>
      </div>

      <div className="recommendation-banner">
        <span className="banner-icon">👍</span>
        <span className="banner-text">
          新手建议：从标记"👍 推荐"的简单国策开始，遵循"零敲牛皮糖"原则！
        </span>
      </div>

      <div className="policies-grid">
        {filteredPolicies.map(policy => (
          <PolicyCard
            key={policy.id}
            policy={policy}
            isSelected={selectedPolicies.some(p => p.id === policy.id)}
            onSelect={togglePolicy}
            onPreview={setPreviewPolicy}
            onAddToPolicyTree={handleAddToPolicyTree}
            isAdding={isAdding}
            addingTemplateId={addingTemplateId}
          />
        ))}
      </div>

      {previewPolicy && (
        <PolicyDetailModal
          policy={previewPolicy}
          onClose={() => setPreviewPolicy(null)}
          onAdd={addPolicyToTree}
        />
      )}
    </div>
  );
}

export default PolicyBrainstorm;
