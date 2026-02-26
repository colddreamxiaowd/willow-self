import { useState, useEffect, useCallback } from 'react';

export function useVirtualScroll(nodes, containerRef, itemHeight = 150) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const [scrollTop, setScrollTop] = useState(0);

  const calculateVisibleRange = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const viewportHeight = containerRect.height;

    // 计算可见范围（上下各预留 2 个缓冲）
    const buffer = 2;
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
    const end = Math.min(
      nodes.length,
      Math.ceil((scrollTop + viewportHeight) / itemHeight) + buffer
    );

    setVisibleRange({ start, end });
  }, [nodes.length, scrollTop, itemHeight, containerRef]);

  useEffect(() => {
    calculateVisibleRange();
  }, [calculateVisibleRange, nodes]);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  const visibleNodes = nodes.slice(visibleRange.start, visibleRange.end);

  return {
    visibleNodes,
    visibleRange,
    handleScroll,
    totalHeight: nodes.length * itemHeight
  };
}
