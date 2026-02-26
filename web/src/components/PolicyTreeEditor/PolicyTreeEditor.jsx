/**
 * PolicyTreeEditor - 国策树编辑器
 *
 * 理论基础：RSIP (递归稳态迭代协议) 第二代自控技术
 * 核心概念：将人生目标可视化为树状结构，通过"点亮国策"激励自己
 *
 * 灵感来源：知乎文章《自制力问题的数学物理方法》by edmond
 * 文章链接：https://www.zhihu.com/question/19888447/answer/1930799480401293785
 *
 * 核心功能：
 * - 可视化国策树编辑
 * - 国策激活/取消激活
 * - 自动布局算法
 * - 多层级目标管理
 * - 阻力/耦合度评估
 */

import React, { useCallback, useMemo, useEffect, useState, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';

import PolicyNode from './nodes/PolicyNode';
import { ContextMenu } from './components/ContextMenu';
import SaveLoadModal from './components/SaveLoadModal';
import { Maximize2, Minimize2, EyeOff } from 'lucide-react';
import { useVirtualScroll } from './hooks/useVirtualScroll';
import { calculateTreeLayout, nodesToTree } from './utils/treeLayout';
import { usePolicyTreeStorage } from './hooks/usePolicyTreeStorage';
import ActivationRitualModal from '../ActivationRitual/ActivationRitualModal';
import { getRuntimeMode, RUNTIME_MODE } from '../../utils/constants';
import { usePolicyTreeContext } from '../../contexts/PolicyTreeContext.jsx';
import { useToast } from '../Toast.jsx';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog.jsx';
import './styles/nodes.css';

const nodeTypes = {
  policy: PolicyNode,
};

// 初始树形数据结构
const initialTreeData = {
  id: 'root-1',
  name: '水密隔舱',
  description: '当出现不可抗力意外事件时，可主动触发此国策，临时冻结受影响国策',
  status: 'active',
  enhancement: 0,
  enhancementConfig: {
    mode: 'custom',
    customEffects: [
      { level: 0, description: '1天容错期' },
      { level: 1, description: '2天容错期' },
      { level: 2, description: '3天容错期' }
    ]
  },
  children: [
    {
      id: 'policy-1',
      name: '先发制人',
      description: '起床后30分钟内禁止使用手机',
      status: 'active',
      enhancement: 2,
      enhancementConfig: {
        mode: 'auto',
        autoConfig: {
          baseValue: '30',
          step: 15,
          unit: '分钟',
          format: '起床后{value}分钟禁用手机'
        }
      },
      children: [
        {
          id: 'policy-1-1',
          name: '手机隔离',
          description: '将手机放在卧室外充电',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '卧室外',
              step: 1,
              unit: '距离',
              format: '手机放在{value}充电'
            }
          }
        },
        {
          id: 'policy-1-2',
          name: '飞行模式',
          description: '起床后开启飞行模式',
          status: 'inactive',
          enhancement: 0,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '30',
              step: 15,
              unit: '分钟',
              format: '起床后{value}分钟飞行模式'
            }
          }
        }
      ]
    },
    {
      id: 'policy-2',
      name: '夜幕降临',
      description: '23:00后屏幕调为黑白模式',
      status: 'active',
      enhancement: 1,
      enhancementConfig: {
        mode: 'auto',
        autoConfig: {
          baseValue: '23:00',
          step: -15,
          unit: '时间',
          format: '{value}屏幕黑白'
        }
      },
      children: [
        {
          id: 'policy-2-1',
          name: '灰度模式',
          description: '设置手机自动进入灰度显示模式',
          status: 'active',
          enhancement: 1,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '23:00',
              step: -15,
              unit: '时间',
              format: '{value}自动灰度'
            }
          }
        }
      ]
    },
    {
      id: 'policy-3',
      name: '预备仪式',
      description: '睡前30分钟开始睡前准备流程',
      status: 'inactive',
      enhancement: 0,
      enhancementConfig: {
        mode: 'auto',
        autoConfig: {
          baseValue: '30',
          step: 10,
          unit: '分钟',
          format: '睡前{value}分钟准备'
        }
      },
      children: [
        {
          id: 'policy-3-1',
          name: '洗漱准备',
          description: '睡前完成洗漱等身体准备',
          status: 'inactive',
          enhancement: 0,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '30',
              step: 5,
              unit: '分钟',
              format: '提前{value}分钟洗漱'
            }
          }
        }
      ]
    },
    {
      id: 'policy-4',
      name: '神圣座位',
      description: '指定专门的学习/工作位置',
      status: 'inactive',
      enhancement: 0,
      enhancementConfig: {
        mode: 'custom',
        customEffects: [
          { level: 0, description: '1个神圣座位' },
          { level: 1, description: '2个神圣座位' },
          { level: 2, description: '3个神圣座位' }
        ]
      },
      children: [
        {
          id: 'policy-4-1',
          name: '书桌整理',
          description: '保持书桌整洁，只放当前任务相关物品',
          status: 'inactive',
          enhancement: 0,
          enhancementConfig: {
            mode: 'auto',
            autoConfig: {
              baseValue: '3',
              step: 1,
              unit: '件',
              format: '桌上最多{value}件物品'
            }
          }
        }
      ]
    }
  ]
};

// 使用 calculateTreeLayout 生成初始节点和边
const { nodes: initialNodes, edges: initialEdges } = calculateTreeLayout(initialTreeData);

// 从 localStorage 同步加载数据的辅助函数
// 注意：不使用模块级缓存，确保每次都能获取最新数据
function loadSavedDataFromStorage() {
  console.log('>>> loadSavedDataFromStorage 被调用');

  try {
    const saved = localStorage.getItem('policytree_editor_data');
    console.log('>>> localStorage 数据存在:', !!saved);

    if (saved) {
      console.log('>>> 原始数据长度:', saved.length);
      const data = JSON.parse(saved);
      console.log('>>> 有 nodes:', !!data.nodes, '数量:', data.nodes?.length);
      console.log('>>> 有 edges:', !!data.edges, '数量:', data.edges?.length);

      if (data.nodes && data.edges) {
        console.log('>>> 返回保存的数据');
        return {
          nodes: data.nodes,
          edges: data.edges,
          viewport: data.viewport || null,
          isFirstVisit: false
        };
      } else if (data.tree) {
        const { nodes, edges } = calculateTreeLayout(data.tree);
        console.log('从本地存储加载初始数据（旧格式）');
        return { nodes, edges, viewport: null, isFirstVisit: false };
      }
    }
  } catch (error) {
    console.error('>>> 加载保存的数据失败:', error);
  }
  console.log('>>> 返回 null');
  return null;
}

// 内部组件 - 使用 useReactFlow
function PolicyTreeEditorInner({ initialTree }) {
  // 获取 PolicyTreeContext（统一数据源）
  const { policyTreeData: contextTreeData, nodes: contextNodes, edges: contextEdges, setNodes: setContextNodes, setEdges: setContextEdges } = usePolicyTreeContext();
  
  // Toast 提示
  const toast = useToast();
  
  // 快捷键相关状态
  const [clipboard, setClipboard] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  
  // 确认对话框状态
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: null
  });

  // 关闭确认对话框
  const handleCancelConfirm = useCallback(() => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  }, []);
  
  // 在组件渲染前立即从 localStorage 加载数据
  // 使用 useState 的懒加载初始化，确保只在组件创建时执行一次
  const initialData = useState(() => {
    console.log('=== [Editor] 组件创建，立即加载数据 ===');

    if (initialTree) {
      console.log('[Editor] 使用外部传入的模板数据');
      const { nodes, edges } = calculateTreeLayout(initialTree);
      return { nodes, edges, viewport: null, isFirstVisit: true };
    }

    const savedData = loadSavedDataFromStorage();
    if (savedData) {
      console.log('[Editor] 从 localStorage 加载数据，节点数:', savedData.nodes.length);
      console.log('[Editor] 从 localStorage 加载的节点列表:', savedData.nodes.map(n => n.data?.name));
      return { nodes: savedData.nodes, edges: savedData.edges, viewport: savedData.viewport, isFirstVisit: false };
    }

    console.log('[Editor] 没有保存的数据，使用默认数据');
    return { nodes: initialNodes, edges: initialEdges, viewport: null, isFirstVisit: true };
  })[0]; // 只取第一个值，即初始数据对象

  // 使用加载的数据初始化 React Flow
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.edges);

  // 首次访问标记和视口状态
  const isFirstVisitRef = useRef(initialData.isFirstVisit);
  const savedViewportRef = useRef(initialData.viewport);
  const { fitView, getViewport, setViewport, screenToFlowPosition } = useReactFlow();
  const containerRef = useRef(null);

  // 今日打卡状态
  const [todayCheckIns, setTodayCheckIns] = useState({});
  
  // 当 context 中的数据变化时（例如导入），更新本地数据
  // 注意：只有当 context 数据是外部导入且本地没有数据时才更新，避免覆盖 localStorage 中的数据
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (contextTreeData && nodes.length === 0) {
      console.log('[Editor] 检测到外部导入的数据，更新本地数据');
      const { nodes: newNodes, edges: newEdges } = calculateTreeLayout(contextTreeData);
      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [contextTreeData]);
  
  // 辅助函数：计算树节点总数
  function countNodes(node) {
    let count = 1;
    if (node.children) {
      node.children.forEach(child => {
        count += countNodes(child);
      });
    }
    return count;
  }

  // 当本地数据变化时，同步到 PolicyTreeContext（用于导出和持久化）
  useEffect(() => {
    if (nodes.length > 0 && contextNodes) {
      // 同步节点数据到 Context（通过 setNodes 触发 store 保存）
      const isDifferent = JSON.stringify(nodes) !== JSON.stringify(contextNodes);
      if (isDifferent) {
        console.log('[Editor] 检测到节点变化，同步到 Context');
        setContextNodes(nodes);
      }
    }
  }, [nodes, contextNodes, setContextNodes]);

  // 使用存储 Hook（传入 getViewport 以保存视口位置）
  const storage = usePolicyTreeStorage(nodes, edges, setNodes, setEdges, getViewport);
  const { saveToStorage, loadFromStorage, exportToYaml, importFromYaml, saveViewState, loadViewState, performMigration } = storage;

  // 执行数据迁移（仅在组件挂载时执行一次）
  useEffect(() => {
    performMigration();
  }, [performMigration]);

  // 手动强制加载保存的数据（用于调试）
  const forceLoadSavedData = useCallback(() => {
    console.log('=== 手动强制加载数据 ===');
    const savedData = loadSavedDataFromStorage();
    if (savedData) {
      console.log('加载数据，节点数:', savedData.nodes.length);
      setNodes(savedData.nodes);
      setEdges(savedData.edges);
      savedViewportRef.current = savedData.viewport;
      isFirstVisitRef.current = false;
      return true;
    }
    console.log('没有保存的数据');
    return false;
  }, [setNodes, setEdges]);

  // 暴露到全局用于调试
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__POLICYTREE__ = {
        forceLoadSavedData,
        saveToStorage,
        loadFromStorage,
        getNodes: () => nodes,
        getEdges: () => edges
      };
      console.log('PolicyTree 调试API已暴露到 window.__POLICYTREE__');
    }
  }, [forceLoadSavedData, saveToStorage, loadFromStorage, nodes, edges]);

  // 加载今日打卡状态
  useEffect(() => {
    const loadTodayCheckIns = () => {
      try {
        const today = new Date().toDateString();
        const checkInsKey = `policytree_checkins_${today}`;
        const saved = localStorage.getItem(checkInsKey);
        if (saved) {
          const checkIns = JSON.parse(saved);
          const checkInMap = {};
          checkIns.forEach(record => {
            if (record.policyId) {
              checkInMap[record.policyId] = record.status;
            }
          });
          setTodayCheckIns(checkInMap);
        }
      } catch (error) {
        console.error('加载今日打卡状态失败:', error);
      }
    };

    loadTodayCheckIns();

    // 监听存储变化，实时同步
    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith('policytree_checkins_')) {
        loadTodayCheckIns();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 监听页面可见性变化，当用户从其他页面（如打卡页面）返回时重新加载数据
  useEffect(() => {
    const handleVisibilityChange = () => {
      console.log('>>> visibilitychange 事件触发，状态:', document.visibilityState);
      if (document.visibilityState === 'visible') {
        console.log('>>> 页面重新可见，检查国策树数据更新...');
        console.log('>>> 当前 nodes 长度:', nodes.length);
        try {
          const saved = localStorage.getItem('policytree_editor_data');
          console.log('>>> 从 localStorage 读取数据:', saved ? '有数据' : '无数据');
          if (saved) {
            const data = JSON.parse(saved);
            console.log('>>> localStorage 中 nodes 长度:', data.nodes?.length);
            console.log('>>> localStorage 中 timestamp:', data.timestamp);
            if (data.nodes && data.edges) {
              // 检查数据是否有变化（比较第一个节点的状态）
              const currentFirstNode = nodes[0];
              const savedFirstNode = data.nodes[0];
              console.log('>>> 当前第一个节点:', currentFirstNode?.data?.name, '状态:', currentFirstNode?.data?.status);
              console.log('>>> 保存的第一个节点:', savedFirstNode?.data?.name, '状态:', savedFirstNode?.data?.status);
              if (currentFirstNode && savedFirstNode) {
                const hasChanges = JSON.stringify(currentFirstNode.data) !== JSON.stringify(savedFirstNode.data);
                console.log('>>> 数据是否有变化:', hasChanges);
                if (hasChanges) {
                  console.log('>>> 检测到国策树数据变化，同步更新...');
                  setNodes(data.nodes);
                  setEdges(data.edges);
                } else {
                  console.log('>>> 数据无变化，跳过同步');
                }
              }
            }
          }
        } catch (error) {
          console.error('>>> 同步国策树数据失败:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [setNodes, setEdges, nodes]);

  // 首次访问时居中（无动画），刷新时恢复保存的视口
  useEffect(() => {
    console.log('=== 视口初始化 ===');
    console.log('isFirstVisit:', isFirstVisitRef.current);
    console.log('nodes count:', nodes.length);

    // 加载上次保存的视图状态
    const savedViewState = loadViewState();

    // 使用 requestAnimationFrame 确保 ReactFlow 完全渲染后再设置视口
    const rafId = requestAnimationFrame(() => {
      setTimeout(() => {
        if (savedViewState?.focusedNodeId) {
          // 有上次聚焦的节点：定位到该节点
          console.log('>>> 恢复上次查看的节点:', savedViewState.focusedNodeId);
          const targetNode = nodes.find(n => n.id === savedViewState.focusedNodeId);
          if (targetNode) {
            try {
              // 定位到节点中心
              const { x, y } = targetNode.position;
              const nodeWidth = targetNode.width || 200;
              const nodeHeight = targetNode.height || 100;
              setViewport({
                x: -x + window.innerWidth / 2 - nodeWidth / 2,
                y: -y + window.innerHeight / 2 - nodeHeight / 2,
                zoom: savedViewState.zoom || 1
              }, { duration: 300 });
              console.log('>>> 已定位到节点:', targetNode.data.name);
            } catch (e) {
              console.error('定位到节点错误:', e);
            }
          } else {
            // 节点不存在，使用默认视口
            console.log('>>> 上次查看的节点已不存在，使用默认视口');
            fitView({ padding: 0.2, duration: 300 });
          }
        } else if (isFirstVisitRef.current) {
          // 首次访问：居中显示，无动画
          console.log('>>> 首次访问，执行 fitView 居中');
          try {
            const result = fitView({
              padding: 0.2,
              duration: 0,
              includeHiddenNodes: true
            });
            console.log('fitView 结果:', result);
          } catch (e) {
            console.error('fitView 错误:', e);
          }
          isFirstVisitRef.current = false;
        } else if (savedViewportRef.current) {
          // 有保存的视口：恢复
          console.log('>>> 恢复保存的视口:', savedViewportRef.current);
          try {
            setViewport(savedViewportRef.current, { duration: 0 });
          } catch (e) {
            console.error('setViewport 错误:', e);
          }
        } else {
          // 没有保存的视口，但也不是首次访问（可能是旧数据）
          console.log('>>> 无保存视口，执行 fitView');
          fitView({ padding: 0.2, duration: 0 });
        }
      }, 50);
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitView, setViewport, nodes.length, loadViewState]);

  // 右键菜单状态
  const [contextMenu, setContextMenu] = useState(null);
  
  // 编辑状态
  const [editingNode, setEditingNode] = useState(null);
  const [editData, setEditData] = useState(null);

  // 激活仪式弹窗状态
  const [activationModalOpen, setActivationModalOpen] = useState(false);
  const [activationNode, setActivationNode] = useState(null);

  // 存档管理弹窗状态
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // 禅修模式（全屏）状态
  const [isZenMode, setIsZenMode] = useState(false);

  // 预览模式数据
  const [previewData, setPreviewData] = useState(null);

  // 双击检测状态
  const lastClickRef = useRef({ time: 0, x: 0, y: 0 });
  const DOUBLE_CLICK_DELAY = 300; // 双击时间间隔（毫秒）
  const DOUBLE_CLICK_DISTANCE = 10; // 双击位置容差（像素）

  // 处理画布点击 - 检测双击
  const handlePaneClick = useCallback((event) => {
    const now = Date.now();
    const { time: lastTime, x: lastX, y: lastY } = lastClickRef.current;
    
    // 计算时间差和距离
    const timeDiff = now - lastTime;
    const distance = Math.sqrt(
      Math.pow(event.clientX - lastX, 2) + 
      Math.pow(event.clientY - lastY, 2)
    );
    
    // 检查是否是双击
    if (timeDiff < DOUBLE_CLICK_DELAY && distance < DOUBLE_CLICK_DISTANCE) {
      console.log('[handlePaneClick] 检测到双击');
      
      try {
        // 使用 ReactFlow 的 project 方法将屏幕坐标转换为画布坐标
        const { x, y } = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY
        });
        
        const newId = `policy-${Date.now()}`;
        const newNode = {
          id: newId,
          type: 'policy',
          position: { x, y },
          draggable: true,
          data: {
            id: newId,
            name: '新国策',
            description: '点击编辑描述',
            tier: 0,
            status: 'inactive',
            parentId: null,
            enhancement: 0,
            enhancementConfig: {
              mode: 'auto',
              direction: 'none',
              autoConfig: {
                baseValue: '1',
                step: 0,
                unit: '',
                format: '效果{value}'
              }
            }
          }
        };
        
        setNodes(nds => [...nds, newNode]);
        toast.success('已添加新节点');
      } catch (error) {
        console.error('[handlePaneClick] 双击处理错误:', error);
      }
      
      // 重置点击状态
      lastClickRef.current = { time: 0, x: 0, y: 0 };
    } else {
      // 记录本次点击
      lastClickRef.current = { 
        time: now, 
        x: event.clientX, 
        y: event.clientY 
      };
    }
  }, [setNodes, toast, screenToFlowPosition]);

  // 双击空白处添加新节点（保留原函数供其他组件使用）
  const handlePaneDoubleClick = useCallback((event) => {
    console.log('[handlePaneDoubleClick] 双击事件触发', { clientX: event.clientX, clientY: event.clientY });
    
    try {
      // 使用 ReactFlow 的 project 方法将屏幕坐标转换为画布坐标
      const { x, y } = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });
      console.log('[handlePaneDoubleClick] 转换后的坐标:', { x, y });
      
      const newId = `policy-${Date.now()}`;
      const newNode = {
        id: newId,
        type: 'policy',
        position: { x, y },
        draggable: true,  // 确保节点可拖动
        data: {
          id: newId,
          name: '新国策',
          description: '点击编辑描述',
          tier: 0,
          status: 'inactive',
          parentId: null,
          enhancement: 0,
          enhancementConfig: {
            mode: 'auto',
            direction: 'none',
            autoConfig: {
              baseValue: '1',
              step: 0,
              unit: '',
              format: '效果{value}'
            }
          }
        }
      };
      
      console.log('[handlePaneDoubleClick] 创建新节点:', newNode);
      setNodes(nds => {
        const updated = [...nds, newNode];
        console.log('[handlePaneDoubleClick] 节点更新后数量:', updated.length);
        return updated;
      });
      toast.success('已添加新节点');
    } catch (error) {
      console.error('[handlePaneDoubleClick] 错误:', error);
    }
  }, [setNodes, toast, screenToFlowPosition]);

  // 获取所有后代节点
  const getAllDescendants = useCallback((nodeId, edgesList) => {
    const descendants = [];
    const childEdges = edgesList.filter(e => e.source === nodeId);
    
    childEdges.forEach(edge => {
      descendants.push(edge.target);
      descendants.push(...getAllDescendants(edge.target, edgesList));
    });
    
    return descendants;
  }, []);

  // 检查节点是否可以点亮
  const canActivate = useCallback((nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return false;

    // 根节点可以直接点亮
    if (node.data.tier === 0) return true;

    // 找到父节点
    const parentEdge = edges.find(e => e.target === nodeId);
    if (!parentEdge) return true;

    const parentNode = nodes.find(n => n.id === parentEdge.source);
    return parentNode?.data?.status === 'active';
  }, [nodes, edges]);

  // 处理右键点击
  const handleNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      nodeId: node.id
    });
  }, []);

  // 关闭右键菜单
  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // 添加子国策
  const handleAddChild = useCallback((parentId) => {
    const newId = `policy-${Date.now()}`;
    const parentNode = nodes.find(n => n.id === parentId);
    
    if (!parentNode) return;

    // 计算新节点位置（在父节点下方）
    const childCount = nodes.filter(n => {
      const edge = edges.find(e => e.source === parentId && e.target === n.id);
      return edge !== undefined;
    }).length;

    const newNode = {
      id: newId,
      type: 'policy',
      position: {
        x: parentNode.position.x + (childCount - 1) * 300,
        y: parentNode.position.y + 180
      },
      data: {
        id: newId,
        name: '新国策',
        description: '点击编辑描述',
        tier: parentNode.data.tier + 1,
        status: 'inactive',
        parentId: parentId,
        enhancement: 0,
        enhancementConfig: {
          mode: 'auto',
          direction: 'none',
          autoConfig: {
            baseValue: '1',
            step: 0,
            unit: '',
            format: '效果{value}'
          }
        }
      }
    };

    const newEdge = {
      id: `e-${parentId}-${newId}`,
      source: parentId,
      target: newId,
      animated: true,
      style: { stroke: '#999', strokeWidth: 2 }
    };

    setNodes(nds => [...nds, newNode]);
    setEdges(eds => [...eds, newEdge]);

    // 自动进入编辑状态
    setEditingNode(newId);
    setEditData(newNode.data);
  }, [nodes, edges, setNodes, setEdges]);

  // 删除国策
  const handleDeleteNode = useCallback((nodeId) => {
    // 获取所有子节点
    const descendants = getAllDescendants(nodeId, edges);
    const allNodesToDelete = [nodeId, ...descendants];

    // 删除节点
    setNodes(nds => nds.filter(n => !allNodesToDelete.includes(n.id)));

    // 删除相关边
    setEdges(eds => eds.filter(e => 
      !allNodesToDelete.includes(e.source) && 
      !allNodesToDelete.includes(e.target)
    ));

    // 如果正在编辑该节点，退出编辑状态
    if (editingNode === nodeId) {
      setEditingNode(null);
      setEditData(null);
    }
  }, [edges, editingNode, setNodes, setEdges, getAllDescendants]);

  // 显示删除确认对话框
  const handleRequestDelete = useCallback((nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    const descendants = getAllDescendants(nodeId, edges);
    const childCount = descendants.length;
    
    setConfirmDialog({
      isOpen: true,
      title: '确认删除国策',
      message: childCount > 0
        ? `确定删除国策「${node?.data?.name || '未知'}」吗？\n\n⚠️ 警告：此国策有 ${childCount} 个子国策，删除后它们也将被删除。`
        : `确定删除国策「${node?.data?.name || '未知'}」吗？`,
      type: 'warning',
      onConfirm: () => {
        handleDeleteNode(nodeId);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        toast.success('国策已删除');
      },
      onCancel: () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  }, [nodes, edges, getAllDescendants, handleDeleteNode, toast]);

  // 复制国策
  const handleDuplicateNode = useCallback((nodeId) => {
    const nodeToCopy = nodes.find(n => n.id === nodeId);
    if (!nodeToCopy) return;

    const newId = `policy-${Date.now()}`;
    const newNode = {
      ...nodeToCopy,
      id: newId,
      position: {
        x: nodeToCopy.position.x + 50,
        y: nodeToCopy.position.y + 50
      },
      data: {
        ...nodeToCopy.data,
        id: newId,
        name: `${nodeToCopy.data.name} (复制)`
      }
    };

    setNodes(nds => [...nds, newNode]);
  }, [nodes, setNodes]);

  // 开始编辑
  const startEditing = useCallback((nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setEditingNode(nodeId);
      setEditData({ ...node.data });
    }
  }, [nodes]);

  // 保存编辑
  const saveEditing = useCallback(() => {
    if (!editingNode || !editData) return;

    setNodes(nds => nds.map(node => {
      if (node.id === editingNode) {
        return {
          ...node,
          data: {
            ...node.data,
            ...editData
          }
        };
      }
      return node;
    }));

    setEditingNode(null);
    setEditData(null);
  }, [editingNode, editData, setNodes]);

  // 取消编辑
  const cancelEditing = useCallback(() => {
    setEditingNode(null);
    setEditData(null);
  }, []);

  // 更新编辑数据
  const updateEditData = useCallback((field, value) => {
    setEditData(prev => prev ? { ...prev, [field]: value } : null);
  }, []);

  // 处理状态变更（带级联）
  const handleNodeStatusChange = useCallback((nodeId, newStatus, commitment = null) => {
    // 如果要点亮，检查父节点
    if (newStatus === 'active') {
      if (!canActivate(nodeId)) {
        toast.warning('请先点亮父国策');
        return;
      }
    }

    // 更新当前节点状态
    setNodes(nds => {
      const updatedNodes = nds.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              status: newStatus,
              commitment: commitment || node.data.commitment
            }
          };
        }
        return node;
      });

      // 如果要熄灭，级联熄灭所有子节点
      if (newStatus === 'inactive') {
        const descendants = getAllDescendants(nodeId, edges);
        return updatedNodes.map(node => {
          if (descendants.includes(node.id)) {
            return {
              ...node,
              data: { ...node.data, status: 'inactive' }
            };
          }
          return node;
        });
      }

      return updatedNodes;
    });

    // RSIP模式下记录今日点亮的国策
    const runtimeMode = getRuntimeMode();
    if (runtimeMode === RUNTIME_MODE.RSIP && newStatus === 'active') {
      const today = new Date().toDateString();
      const todayActivatedKey = `policytree_activated_${today}`;
      localStorage.setItem(todayActivatedKey, nodeId);
    }

    // 立即保存数据（延迟执行，等待状态更新完成）
    setTimeout(() => {
      saveToStorage();
      console.log('状态变更已自动保存');
    }, 100);
  }, [canActivate, edges, getAllDescendants, setNodes, saveToStorage]);

  // 处理激活确认（从仪式弹窗）
  const handleActivationConfirm = useCallback((nodeId, commitment) => {
    handleNodeStatusChange(nodeId, 'active', commitment);
    setActivationModalOpen(false);
    setActivationNode(null);
  }, [handleNodeStatusChange]);

  // 处理节点双击 - 直接切换状态（无弹窗）
  // React Flow 11.x 传递 (event, node) 两个参数
  const handleNodeDoubleClick = useCallback((event, node) => {
    const nodeId = node?.id;
    if (!nodeId) return;
    
    const foundNode = nodes.find(n => n.id === nodeId);
    if (!foundNode) return;

    // 如果已经是激活状态，则取消激活
    if (node.data.status === 'active') {
      handleNodeStatusChange(nodeId, 'inactive');
      return;
    }

    // 检查是否可以激活
    if (!canActivate(nodeId)) {
      toast.warning('请先点亮父国策');
      return;
    }

    // RSIP模式下检查今日是否已点亮国策
    const runtimeMode = getRuntimeMode();
    if (runtimeMode === RUNTIME_MODE.RSIP) {
      const today = new Date().toDateString();
      const todayActivatedKey = `policytree_activated_${today}`;
      const todayActivated = localStorage.getItem(todayActivatedKey);

      if (todayActivated) {
        const activatedPolicy = nodes.find(n => n.id === todayActivated);
        toast.warning(`RSIP模式：每天只能点亮一个国策。今日已点亮：${activatedPolicy?.data?.name || '未知国策'}，请明天再点亮新的国策。`);
        return;
      }
    }

    // 直接激活，不显示弹窗
    handleNodeStatusChange(nodeId, 'active');
  }, [nodes, canActivate, handleNodeStatusChange, toast]);

  // 禅修模式切换
  const toggleZenMode = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsZenMode(true);
        setIsSidebarCollapsed(true);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsZenMode(false);
      }
    }
  }, []);

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsZenMode(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 点击外部保存编辑
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!editingNode) return;

      const editArea = event.target.closest('.edit-area');
      const policyNode = event.target.closest('.policy-node');
      
      // 如果点击编辑区域或当前编辑的节点，不处理
      if (editArea) return;
      if (policyNode && policyNode.dataset.nodeId === editingNode) return;

      // 点击外部，保存并退出编辑
      saveEditing();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingNode, saveEditing]);

  // 保存当前状态到历史记录
  const saveToHistory = useCallback(() => {
    const currentState = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    };
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(currentState);
      if (newHistory.length > 50) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [nodes, edges, historyIndex]);

  // 撤销操作
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(prev => prev - 1);
      toast.info('已撤销');
    }
  }, [history, historyIndex, setNodes, setEdges, toast]);

  // 重做操作
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(prev => prev + 1);
      toast.info('已重做');
    }
  }, [history, historyIndex, setNodes, setEdges, toast]);

  // 复制节点
  const handleCopy = useCallback(() => {
    if (selectedNodeId) {
      const nodeToCopy = nodes.find(n => n.id === selectedNodeId);
      if (nodeToCopy) {
        setClipboard(JSON.parse(JSON.stringify(nodeToCopy)));
        toast.success('已复制节点');
      }
    }
  }, [selectedNodeId, nodes, toast]);

  // 粘贴节点
  const handlePaste = useCallback(() => {
    if (clipboard) {
      const newId = `policy-${Date.now()}`;
      const newNode = {
        ...clipboard,
        id: newId,
        position: {
          x: clipboard.position.x + 50,
          y: clipboard.position.y + 50
        },
        data: {
          ...clipboard.data,
          id: newId,
          name: `${clipboard.data.name} (粘贴)`
        }
      };
      
      saveToHistory();
      setNodes(nds => [...nds, newNode]);
      toast.success('已粘贴节点');
    }
  }, [clipboard, setNodes, saveToHistory, toast]);

  // 保存提示
  const handleSaveShortcut = useCallback(() => {
    toast.success('已自动保存');
  }, [toast]);

  // 快捷键监听
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 忽略输入框内的快捷键
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // ESC 键保存编辑
      if (e.key === 'Escape' && editingNode) {
        saveEditing();
        return;
      }

      // Ctrl/Cmd 组合键
      if (e.ctrlKey || e.metaKey) {
        // Ctrl+S: 保存
        if (e.key === 's') {
          e.preventDefault();
          handleSaveShortcut();
        }
        // Ctrl+C: 复制
        else if (e.key === 'c' && selectedNodeId) {
          e.preventDefault();
          handleCopy();
        }
        // Ctrl+V: 粘贴
        else if (e.key === 'v' && clipboard) {
          e.preventDefault();
          handlePaste();
        }
        // Ctrl+Z: 撤销
        else if (e.key === 'z') {
          e.preventDefault();
          handleUndo();
        }
        // Ctrl+Y: 重做
        else if (e.key === 'y') {
          e.preventDefault();
          handleRedo();
        }
      }

      // Delete/Backspace: 删除选中节点
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId && !editingNode) {
        e.preventDefault();
        handleRequestDelete(selectedNodeId);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editingNode, saveEditing, selectedNodeId, clipboard, handleSaveShortcut, handleCopy, handlePaste, handleUndo, handleRedo, handleRequestDelete]);

  // 追踪最后聚焦的节点
  const lastFocusedNodeRef = useRef(null);
  
  // 使用 ref 跟踪最新的 nodes 和 edges，避免卸载时的闭包问题
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  
  // 同步 ref 与 state
  useEffect(() => {
    nodesRef.current = nodes;
    console.log('[Editor] nodesRef 已同步，节点数:', nodes.length);
  }, [nodes]);
  
  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);
  

  
  // 新增：接收外部节点的功能
  // 注意：数据已经在 Brainstorm 组件中保存到 localStorage 了
  // 这个函数只负责更新 Editor 组件的 React state
  const addExternalNode = useCallback((nodeData) => {
    console.log('=== [Editor] addExternalNode 被调用 ===');
    console.log('[Editor] 新节点ID:', nodeData.id);
    console.log('[Editor] 新节点名称:', nodeData.data?.name);
    
    // 从 localStorage 读取最新数据
    const existingData = localStorage.getItem('policytree_editor_data');
    const parsedExisting = existingData ? JSON.parse(existingData) : null;
    const currentNodes = parsedExisting?.nodes || [];
    
    console.log('[Editor] 从 localStorage 读取的节点数:', currentNodes.length);
    console.log('[Editor] 从 localStorage 读取的节点列表:', currentNodes.map(n => n.data?.name));
    
    // 检查是否已存在相同 ID 的节点（避免重复添加）
    if (currentNodes.find(n => n.id === nodeData.id)) {
      console.log('[Editor] 节点已存在，跳过添加:', nodeData.id);
      return;
    }
    
    // 更新 React state（不保存到 localStorage，因为数据已经在 Brainstorm 中保存了）
    setNodes(currentNodes);
    
    // 同步更新 ref
    nodesRef.current = currentNodes;
    
    console.log('[Editor] 已更新 React state');
    console.log('=== [Editor] addExternalNode 结束 ===');
  }, [setNodes]);
  
  // 将 addExternalNode 暴露到 window 对象
  useEffect(() => {
    window.addExternalNode = addExternalNode;
    return () => {
      delete window.addExternalNode;
    };
  }, [addExternalNode]);
  
  // 处理节点点击，记录当前查看的节点
  const handleNodeClick = useCallback((event, node) => {
    lastFocusedNodeRef.current = node.id;
    setSelectedNodeId(node.id);
  }, []);

  // 组件卸载时保存当前视图状态（不再保存节点数据，由 Hook 统一管理）
  useEffect(() => {
    return () => {
      // 保存视图状态
      const viewport = getViewport();
      saveViewState({
        focusedNodeId: lastFocusedNodeRef.current,
        zoom: viewport?.zoom || 1,
        timestamp: new Date().toISOString()
      });
    };
  }, [saveViewState, getViewport]);

  // 使用虚拟滚动（当节点数超过 20 时启用）
  const useVirtualization = nodes.length > 20;
  const { visibleNodes } = useVirtualScroll(
    nodes,
    containerRef,
    150
  );

  // 计算每个节点的子节点数量
  const getChildCount = useCallback((nodeId) => {
    return edges.filter(e => e.source === nodeId).length;
  }, [edges]);

  // 为节点数据添加回调函数
  const nodesWithCallbacks = useMemo(() => {
    const displayNodes = useVirtualization ? visibleNodes : nodes;
    return displayNodes.map(node => ({
      ...node,
      draggable: node.draggable !== false, // 确保 draggable 属性被保留，默认为 true
      data: {
        ...node.data,
        onUpdate: (nodeId, newData) => {
          setNodes(nds =>
            nds.map(n => {
              if (n.id === nodeId) {
                return { ...n, data: { ...n.data, ...newData } };
              }
              return n;
            })
          );
        },
        onStatusChange: handleNodeStatusChange,
        isEditing: editingNode === node.id,
        editData: editingNode === node.id ? editData : null,
        startEditing,
        updateEditData,
        saveEditing,
        cancelEditing,
        canActivate: canActivate(node.id),
        childCount: getChildCount(node.id),
        todayCheckIn: todayCheckIns[node.id],
        addExternalNode: addExternalNode,
        toast
      }
    }));
  }, [nodes, visibleNodes, useVirtualization, editingNode, editData, handleNodeStatusChange, startEditing, updateEditData, saveEditing, cancelEditing, canActivate, setNodes, getChildCount, todayCheckIns, addExternalNode]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // 组合处理画布点击：双击检测 + 关闭右键菜单
  const handlePaneClickCombined = useCallback((event) => {
    // 先执行双击检测
    handlePaneClick(event);
    // 再关闭右键菜单
    closeContextMenu();
  }, [handlePaneClick, closeContextMenu]);

  // 预览存档内容
  const handlePreviewSave = useCallback((id) => {
    const slotData = localStorage.getItem(`policytree_save_${id}`);
    if (slotData) {
      try {
        const data = JSON.parse(slotData);
        if (data.nodes && data.edges) {
          setPreviewData(data);
          setIsSaveModalOpen(false);
          toast.success('进入预览模式');
        }
      } catch (e) {
        console.error('预览加载失败:', e);
      }
    }
  }, [toast]);

  // 退出预览模式
  const exitPreview = useCallback(() => {
    setPreviewData(null);
    setIsSaveModalOpen(true); // 返回存档列表
  }, []);

  return (
    <div className="policy-tree-editor-container" style={{ display: 'flex', height: '100vh', width: '100%', position: 'relative', overflow: 'hidden' }}>
      <div 
        ref={containerRef} 
        className="flow-wrapper" 
        style={{ flex: 1, height: '100%', position: 'relative', background: '#f5f5f0' }}
      >
        {previewData && (
          <div style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: '#FEF3C7',
            border: '1px solid #F59E0B',
            padding: '10px 20px',
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <span style={{ fontWeight: 700, color: '#92400E' }}>👁️ 正在预览存档</span>
            <button 
              onClick={exitPreview}
              style={{
                background: '#F59E0B',
                color: 'white',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '15px',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <EyeOff size={14} /> 退出预览
            </button>
          </div>
        )}

        <ReactFlow
          nodes={previewData ? previewData.nodes : nodesWithCallbacks}
          edges={previewData ? previewData.edges : edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={handleNodeContextMenu}
        onNodeClick={handleNodeClick}
        onNodeDoubleClick={handleNodeDoubleClick}
        onPaneClick={handlePaneClickCombined}
        nodeTypes={nodeTypes}
        minZoom={0.3}
        maxZoom={1.5}

        // 性能优化配置
        onlyRenderVisibleElements={true}
        nodeExtent={[[-5000, -5000], [5000, 5000]]}
        snapToGrid={false}
        selectNodesOnDrag={true}
        selectionOnDrag={true}

        // 拖动配置
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}

        attributionPosition="bottom-left"
      >
        <Background color="#ccc" gap={20} size={1} />
        <Controls showZoom={true} showFitView={true} showInteractive={false} />
        <MiniMap
          nodeColor={(node) => {
            switch (node.data?.status) {
              case 'active': return 'rgb(41, 178, 74)';
              case 'extinguished': return 'rgb(100, 67, 67)';
              default: return 'rgb(67, 67, 67)';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.2)"
          style={{
            backgroundColor: '#f5f5f0',
            border: '1px solid #ccc'
          }}
        />
      </ReactFlow>

      {/* 工具栏 */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        display: 'flex',
        gap: 10,
        zIndex: 10
      }}>
        <button
          onClick={() => setIsSaveModalOpen(true)}
          style={{
            padding: '8px 16px',
            background: '#6B8E6B',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          保存
        </button>
        <button
          onClick={() => setIsSaveModalOpen(true)}
          style={{
            padding: '8px 16px',
            background: '#8B7D6B',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          加载
        </button>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          nodeId={contextMenu.nodeId}
          onClose={closeContextMenu}
          onAddChild={handleAddChild}
          onDelete={handleDeleteNode}
          onRequestDelete={handleRequestDelete}
          onDuplicate={handleDuplicateNode}
          onEdit={startEditing}
        />
      )}

      {/* 确认对话框 */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText="确认删除"
        cancelText="取消"
        onConfirm={confirmDialog.onConfirm}
        onCancel={handleCancelConfirm}
      />

      {/* 激活仪式弹窗 - 已禁用，改为直接点击切换 */}
      {/* <ActivationRitualModal
        isOpen={activationModalOpen}
        onClose={() => {
          setActivationModalOpen(false);
          setActivationNode(null);
        }}
        policy={activationNode?.data}
        onConfirm={handleActivationConfirm}
      /> */}

      {/* 存档管理弹窗 */}
      <SaveLoadModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        storage={storage}
        onPreview={handlePreviewSave}
      />

      {/* 禅修模式（全屏）按钮 */}
      <button
        onClick={toggleZenMode}
        title={isZenMode ? "退出禅修模式" : "开启禅修模式"}
        style={{
          position: 'absolute',
          bottom: 25,
          right: 25,
          width: 50,
          height: 50,
          borderRadius: '50%',
          background: isZenMode ? '#6B8E6B' : 'rgba(255, 255, 255, 0.8)',
          border: '1px solid #dcdcdc',
          color: isZenMode ? 'white' : '#666',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 100,
          transition: 'all 0.3s'
        }}
      >
        {isZenMode ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
      </button>
      </div>
    </div>
  );
}

// 外部组件 - 提供 ReactFlowProvider
function PolicyTreeEditor({ initialTree }) {
  return (
    <ReactFlowProvider>
      <PolicyTreeEditorInner initialTree={initialTree} />
    </ReactFlowProvider>
  );
}

export default PolicyTreeEditor;
