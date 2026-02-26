import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import YamlEditor from './YamlEditor';
import { DEFAULT_YAML } from '../utils';

/**
 * YamlEditor 组件测试套件
 */

describe('YamlEditor', () => {
  const mockOnChange = jest.fn();
  const mockOnParse = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('渲染测试', () => {
    test('应该正确渲染组件', () => {
      render(
        <YamlEditor
          value=""
          onChange={mockOnChange}
          onParse={mockOnParse}
          loading={false}
        />
      );

      expect(screen.getByText('YAML 编辑器')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /解析/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    test('应该显示默认 YAML 内容当 value 为空', () => {
      render(
        <YamlEditor
          value=""
          onChange={mockOnChange}
          onParse={mockOnParse}
          loading={false}
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue(DEFAULT_YAML);
    });

    test('应该显示传入的 value 值', () => {
      const customValue = 'id: test\ndescription: 测试';
      render(
        <YamlEditor
          value={customValue}
          onChange={mockOnChange}
          onParse={mockOnParse}
          loading={false}
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue(customValue);
    });

    test('应该正确显示行数和字符数', () => {
      const testValue = 'line1\nline2\nline3';
      render(
        <YamlEditor
          value={testValue}
          onChange={mockOnChange}
          onParse={mockOnParse}
          loading={false}
        />
      );

      expect(screen.getByText('3 行')).toBeInTheDocument();
      expect(screen.getByText('16 字符')).toBeInTheDocument();
    });
  });

  describe('交互测试', () => {
    test('应该在输入时调用 onChange', async () => {
      render(
        <YamlEditor
          value=""
          onChange={mockOnChange}
          onParse={mockOnParse}
          loading={false}
        />
      );

      const textarea = screen.getByRole('textbox');
      await userEvent.clear(textarea);
      await userEvent.type(textarea, 'test input');

      expect(mockOnChange).toHaveBeenCalled();
    });

    test('应该在点击解析按钮时调用 onParse', () => {
      render(
        <YamlEditor
          value=""
          onChange={mockOnChange}
          onParse={mockOnParse}
          loading={false}
        />
      );

      const parseButton = screen.getByRole('button', { name: /解析/i });
      fireEvent.click(parseButton);

      expect(mockOnParse).toHaveBeenCalledTimes(1);
    });

    test('解析按钮在 loading 状态下应该被禁用', () => {
      render(
        <YamlEditor
          value=""
          onChange={mockOnChange}
          onParse={mockOnParse}
          loading={true}
        />
      );

      const parseButton = screen.getByRole('button', { name: /解析中/i });
      expect(parseButton).toBeDisabled();
      expect(screen.getByText('解析中...')).toBeInTheDocument();
    });
  });

  describe('边界情况', () => {
    test('应该处理 null value', () => {
      render(
        <YamlEditor
          value={null}
          onChange={mockOnChange}
          onParse={mockOnParse}
          loading={false}
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue(DEFAULT_YAML);
    });

    test('应该处理 undefined value', () => {
      render(
        <YamlEditor
          value={undefined}
          onChange={mockOnChange}
          onParse={mockOnParse}
          loading={false}
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue(DEFAULT_YAML);
    });

    test('应该在没有 onChange 回调时不抛出错误', () => {
      render(
        <YamlEditor
          value="test"
          onChange={null}
          onParse={mockOnParse}
          loading={false}
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(() => {
        fireEvent.change(textarea, { target: { value: 'new value' } });
      }).not.toThrow();
    });

    test('应该在没有 onParse 回调时不抛出错误', () => {
      render(
        <YamlEditor
          value="test"
          onChange={mockOnChange}
          onParse={null}
          loading={false}
        />
      );

      const parseButton = screen.getByRole('button', { name: /解析/i });
      expect(() => {
        fireEvent.click(parseButton);
      }).not.toThrow();
    });
  });

  describe('可访问性', () => {
    test('textarea 应该有正确的 aria-label', () => {
      render(
        <YamlEditor
          value=""
          onChange={mockOnChange}
          onParse={mockOnParse}
          loading={false}
        />
      );

      expect(screen.getByLabelText('YAML 编辑器')).toBeInTheDocument();
    });

    test('按钮应该有正确的 aria-label', () => {
      render(
        <YamlEditor
          value=""
          onChange={mockOnChange}
          onParse={mockOnParse}
          loading={false}
        />
      );

      expect(screen.getByRole('button', { name: '解析 YAML' })).toBeInTheDocument();
    });
  });
});

// 最后更新时间: 2026-02-21 16:00
// 编辑人: Senior-Code-Review-Engineer
