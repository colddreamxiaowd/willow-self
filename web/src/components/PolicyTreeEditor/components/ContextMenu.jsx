import React from 'react';
import './ContextMenu.css';

export function ContextMenu({ x, y, nodeId, onClose, onAddChild, onDelete, onDuplicate, onEdit, onRequestDelete }) {
  const handleAddChild = () => {
    onAddChild(nodeId);
    onClose();
  };

  const handleDelete = () => {
    if (onRequestDelete) {
      onRequestDelete(nodeId);
    } else if (window.confirm('确定删除此国策吗？其子国策也会被删除。')) {
      onDelete(nodeId);
    }
    onClose();
  };

  const handleDuplicate = () => {
    onDuplicate(nodeId);
    onClose();
  };

  const handleEdit = () => {
    onEdit(nodeId);
    onClose();
  };

  return (
    <div 
      className="context-menu" 
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="menu-item" onClick={handleEdit}>
        <span className="icon">✏️</span> 编辑国策
      </div>
      <div className="menu-divider"></div>
      <div className="menu-item" onClick={handleAddChild}>
        <span className="icon">➕</span> 添加子国策
      </div>
      <div className="menu-item" onClick={handleDuplicate}>
        <span className="icon">📋</span> 复制国策
      </div>
      <div className="menu-divider"></div>
      <div className="menu-item delete" onClick={handleDelete}>
        <span className="icon">🗑️</span> 删除国策
      </div>
    </div>
  );
}

// 最后更新时间: 2026-02-24 12:45
// 编辑人: Trae AI
// 更新内容: 添加「编辑国策」菜单项
