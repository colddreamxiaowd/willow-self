/**
 * Jest 测试配置
 * 配置测试环境和全局设置
 */

// 导入 jest-dom 扩展
import '@testing-library/jest-dom';

// 模拟 ReactFlow
jest.mock('reactflow', () => ({
  __esModule: true,
  default: ({ children, ...props }) => (
    <div data-testid="react-flow" {...props}>{children}</div>
  ),
  Background: () => <div data-testid="background" />,
  Controls: () => <div data-testid="controls" />,
  MiniMap: () => <div data-testid="minimap" />,
  useNodesState: (initial) => [initial, jest.fn(), jest.fn()],
  useEdgesState: (initial) => [initial, jest.fn(), jest.fn()],
  MarkerType: {
    ArrowClosed: 'arrowclosed'
  }
}));

// 模拟 lucide-react
jest.mock('lucide-react', () => ({
  FileCode: () => <span data-testid="file-code-icon" />,
  Play: () => <span data-testid="play-icon" />,
  TrendingUp: () => <span data-testid="trending-up-icon" />,
  Star: () => <span data-testid="star-icon" />,
  Zap: () => <span data-testid="zap-icon" />,
  Shield: () => <span data-testid="shield-icon" />,
  AlertTriangle: () => <span data-testid="alert-triangle-icon" />,
  Info: () => <span data-testid="info-icon" />,
  CheckCircle: () => <span data-testid="check-circle-icon" />,
  X: () => <span data-testid="x-icon" />,
  GitBranch: () => <span data-testid="git-branch-icon" />,
  RefreshCw: () => <span data-testid="refresh-cw-icon" />,
  HelpCircle: () => <span data-testid="help-circle-icon" />
}));

// 全局测试配置
global.console = {
  ...console,
  // 忽略特定的警告
  warn: jest.fn(),
  error: jest.fn()
};

// 最后更新时间: 2026-02-21 16:00
// 编辑人: Senior-Code-Review-Engineer
