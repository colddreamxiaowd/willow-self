import React, { useState } from 'react';
import '../../styles/BookTheme.css';
import BookPage from './BookPage';
import BookSpine from './BookSpine';
import Bookmarks from './Bookmarks';

function BookContainer({ children, activeMode, onModeChange, onImport, onExport, onHelp }) {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(true);

  const toggleMenu = () => {
    setIsMenuCollapsed(!isMenuCollapsed);
  };

  return (
    <div className={`book-container ${isMenuCollapsed ? 'menu-collapsed' : 'menu-expanded'}`}>
      {/* 左页 - 内容区域 */}
      <BookPage position="left">
        {children}
      </BookPage>

      {/* 书脊 */}
      <BookSpine />

      {/* 右页 - 书签栏 */}
      <BookPage position="right" collapsed={isMenuCollapsed}>
        <Bookmarks
          activeMode={activeMode}
          onModeChange={onModeChange}
          onImport={onImport}
          onExport={onExport}
          onHelp={onHelp}
          collapsed={isMenuCollapsed}
          onToggle={toggleMenu}
        />
      </BookPage>
    </div>
  );
}

export default BookContainer;

// 最后更新时间: 2026-02-26 22:53
// 编辑人: Trae AI
// 用途: 书籍容器组件，包含左页、书脊、右页，支持右侧书签栏折叠
