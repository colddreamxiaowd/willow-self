import React from 'react';
import { BookOpen, Upload, Share2, HelpCircle, GitBranch, Calendar, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import '../../styles/BookTheme.css';

function BookmarkButton({ icon: Icon, label, active, onClick, collapsed }) {
  return (
    <button
      className={`bookmark-btn ${active ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`}
      onClick={onClick}
      title={collapsed ? label : ''}
    >
      <Icon className="bookmark-icon" size={18} />
      {!collapsed && <span className="bookmark-label">{label}</span>}
    </button>
  );
}

function Bookmarks({ activeMode, onModeChange, onImport, onExport, onHelp, collapsed, onToggle }) {
  const bookmarks = [
    { id: 'journal', icon: BookOpen, label: '手账模式' },
    { id: 'editor', icon: GitBranch, label: '国策树编辑器' },
    { id: 'brainstorm', icon: Lightbulb, label: '国策Brainstorm' },
    { id: 'checkin', icon: Calendar, label: '今日打卡' },
  ];

  const actionBookmarks = [
    { id: 'import', icon: Upload, label: '导入', action: onImport },
    { id: 'export', icon: Share2, label: '导出', action: onExport },
    { id: 'help', icon: HelpCircle, label: '帮助', action: onHelp },
  ];

  return (
    <div className={`bookmarks-container ${collapsed ? 'collapsed' : ''}`}>
      {/* 折叠/展开切换按钮 */}
      <button 
        className="bookmark-toggle-btn"
        onClick={onToggle}
        title={collapsed ? '展开菜单' : '收起菜单'}
      >
        {collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      <div className="bookmarks-section">
        {!collapsed && <h3 className="bookmarks-section-title">模式</h3>}
        {bookmarks.map((bookmark) => (
          <BookmarkButton
            key={bookmark.id}
            icon={bookmark.icon}
            label={bookmark.label}
            active={activeMode === bookmark.id}
            onClick={() => onModeChange(bookmark.id)}
            collapsed={collapsed}
          />
        ))}
      </div>

      <div className="bookmarks-section">
        {!collapsed && <h3 className="bookmarks-section-title">操作</h3>}
        {actionBookmarks.map((bookmark) => (
          <BookmarkButton
            key={bookmark.id}
            icon={bookmark.icon}
            label={bookmark.label}
            onClick={bookmark.action}
            collapsed={collapsed}
          />
        ))}
      </div>
    </div>
  );
}

export default Bookmarks;

// 最后更新时间: 2026-02-26 22:55
// 编辑人: Trae AI
// 用途: 书签容器组件 - 支持折叠态，包含保存/加载按钮
