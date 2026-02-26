import { useContext } from 'react';
import { JournalContext } from '../contexts/JournalContext';

export function useJournal() {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
}

// 最后更新时间: 2026-02-22 16:45
// 编辑人: Trae AI
