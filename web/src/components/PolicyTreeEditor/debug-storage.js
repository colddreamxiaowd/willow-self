// 调试存储功能的辅助脚本

export function debugStorage() {
  console.log('=== 调试存储功能 ===');

  // 1. 检查 localStorage 中是否有数据
  const saved = localStorage.getItem('policytree_editor_data');
  console.log('1. localStorage 数据存在:', !!saved);

  if (saved) {
    try {
      const data = JSON.parse(saved);
      console.log('2. 数据版本:', data.version);
      console.log('3. 保存时间:', data.timestamp);
      console.log('4. 节点数量:', data.nodes?.length);
      console.log('5. 边数量:', data.edges?.length);
      console.log('6. 视口信息:', data.viewport);

      // 检查节点数据是否完整
      if (data.nodes && data.nodes.length > 0) {
        console.log('7. 第一个节点:', data.nodes[0]);
      }
    } catch (e) {
      console.error('解析数据失败:', e);
    }
  } else {
    console.log('没有保存的数据');
  }

  return !!saved;
}

export function forceSaveTestData() {
  console.log('=== 强制保存测试数据 ===');

  const testData = {
    version: '2.1',
    timestamp: new Date().toISOString(),
    nodes: [
      {
        id: 'test-node-1',
        type: 'policyNode',
        position: { x: 0, y: 0 },
        data: {
          name: '测试国策',
          description: '这是一个测试国策',
          status: 'active',
          level: 0
        }
      }
    ],
    edges: [],
    viewport: { x: 0, y: 0, zoom: 1 }
  };

  localStorage.setItem('policytree_editor_data', JSON.stringify(testData));
  console.log('测试数据已保存');
  debugStorage();
}

export function clearStorage() {
  console.log('=== 清除存储 ===');
  localStorage.removeItem('policytree_editor_data');
  console.log('存储已清除');
}

// 在浏览器控制台中可以使用这些函数：
// import { debugStorage, forceSaveTestData, clearStorage } from './debug-storage';
// debugStorage();
