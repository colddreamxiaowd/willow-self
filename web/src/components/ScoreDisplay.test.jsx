import React from 'react';
import { render, screen } from '@testing-library/react';
import ScoreDisplay from './ScoreDisplay';

/**
 * ScoreDisplay 组件测试套件
 */

describe('ScoreDisplay', () => {
  const mockCalculateScore = jest.fn((node) => {
    return (node.coupling_score || 5) * 2;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('渲染测试', () => {
    test('当 treeData 为 null 时应该返回 null', () => {
      const { container } = render(
        <ScoreDisplay treeData={null} calculateScore={mockCalculateScore} />
      );
      expect(container.firstChild).toBeNull();
    });

    test('当 treeData 为 undefined 时应该返回 null', () => {
      const { container } = render(
        <ScoreDisplay treeData={undefined} calculateScore={mockCalculateScore} />
      );
      expect(container.firstChild).toBeNull();
    });

    test('应该正确渲染统计信息', () => {
      const treeData = {
        id: 'root',
        description: '根节点',
        coupling_score: 8,
        children: [
          { id: 'child1', description: '子节点1', coupling_score: 6 },
          { id: 'child2', description: '子节点2', coupling_score: 4 }
        ]
      };

      render(
        <ScoreDisplay treeData={treeData} calculateScore={mockCalculateScore} />
      );

      expect(screen.getByText('评分统计')).toBeInTheDocument();
      expect(screen.getByText('总节点数')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument(); // 总节点数
      expect(screen.getByText('平均分')).toBeInTheDocument();
      expect(screen.getByText('最高分')).toBeInTheDocument();
    });

    test('应该显示等级分布', () => {
      const treeData = {
        id: 'root',
        description: '根节点',
        coupling_score: 8,
        resistance_score: 3,
        impact: 1
      };

      render(
        <ScoreDisplay treeData={treeData} calculateScore={mockCalculateScore} />
      );

      expect(screen.getByText('优选国策')).toBeInTheDocument();
      expect(screen.getByText('高杠杆')).toBeInTheDocument();
      expect(screen.getByText('防御型')).toBeInTheDocument();
      expect(screen.getByText('进取型')).toBeInTheDocument();
    });

    test('应该显示 Top 5 节点', () => {
      const treeData = {
        id: 'root',
        description: '根节点',
        coupling_score: 8,
        children: [
          { id: 'child1', description: '子节点1', coupling_score: 6 },
          { id: 'child2', description: '子节点2', coupling_score: 4 }
        ]
      };

      render(
        <ScoreDisplay treeData={treeData} calculateScore={mockCalculateScore} />
      );

      expect(screen.getByText('Top 5 高分节点')).toBeInTheDocument();
    });

    test('应该显示公式提示', () => {
      const treeData = {
        id: 'root',
        description: '根节点'
      };

      render(
        <ScoreDisplay treeData={treeData} calculateScore={mockCalculateScore} />
      );

      expect(screen.getByText(/Score = /)).toBeInTheDocument();
    });
  });

  describe('数据计算', () => {
    test('应该正确计算统计数据', () => {
      const treeData = {
        id: 'root',
        description: '根节点',
        coupling_score: 10,
        children: [
          { id: 'child1', description: '子节点1', coupling_score: 8 },
          { id: 'child2', description: '子节点2', coupling_score: 6 },
          { id: 'child3', description: '子节点3', coupling_score: 4 }
        ]
      };

      render(
        <ScoreDisplay treeData={treeData} calculateScore={mockCalculateScore} />
      );

      // 总节点数应该是 4
      expect(screen.getByText('4')).toBeInTheDocument();

      // 验证 calculateScore 被正确调用
      expect(mockCalculateScore).toHaveBeenCalled();
    });

    test('应该处理没有 children 的节点', () => {
      const treeData = {
        id: 'root',
        description: '根节点',
        coupling_score: 5
      };

      render(
        <ScoreDisplay treeData={treeData} calculateScore={mockCalculateScore} />
      );

      expect(screen.getByText('1')).toBeInTheDocument(); // 总节点数
    });
  });

  describe('边界情况', () => {
    test('应该处理空的 children 数组', () => {
      const treeData = {
        id: 'root',
        description: '根节点',
        children: []
      };

      render(
        <ScoreDisplay treeData={treeData} calculateScore={mockCalculateScore} />
      );

      expect(screen.getByText('1')).toBeInTheDocument(); // 总节点数
    });

    test('应该处理深层嵌套的树', () => {
      const treeData = {
        id: 'root',
        description: '根节点',
        children: [
          {
            id: 'child',
            description: '子节点',
            children: [
              { id: 'grandchild', description: '孙节点' }
            ]
          }
        ]
      };

      render(
        <ScoreDisplay treeData={treeData} calculateScore={mockCalculateScore} />
      );

      expect(screen.getByText('3')).toBeInTheDocument(); // 总节点数
    });
  });
});

// 最后更新时间: 2026-02-21 16:00
// 编辑人: Senior-Code-Review-Engineer
