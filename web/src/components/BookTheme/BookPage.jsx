import React from 'react';
import '../../styles/BookTheme.css';

function BookPage({ children, position, collapsed, className = '' }) {
  const positionClass = position === 'left' ? 'left-page' : 'right-page';
  const collapsedClass = collapsed ? 'collapsed' : '';

  return (
    <div className={`book-page ${positionClass} ${collapsedClass} ${className}`}>
      {children}
    </div>
  );
}

export default BookPage;

// 最后更新时间: 2026-02-26 22:54
// 编辑人: Trae AI
// 用途: 书页组件，左页显示内容，右页显示书签，支持折叠态
