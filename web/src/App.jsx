import React, { useState, useCallback, useEffect } from 'react';
import { ToastProvider, useToast } from './components/Toast';
import { BookContainer } from './components/BookTheme';
import PolicyTreeEditor from './components/PolicyTreeEditor/PolicyTreeEditor';
import { JournalApp } from './components/Journal';
import CheckInApp from './components/checkin/CheckInApp';
import DataImport from './components/DataImport/DataImport';
import ShareExport from './components/ShareExport/ShareExport';
import OnboardingGuide from './components/OnboardingGuide';

import PolicyBrainstorm from './components/PolicyBrainstorm/PolicyBrainstorm';
import { AlertTriangle } from 'lucide-react';
import { PolicyTreeProvider, usePolicyTreeContext } from './contexts/PolicyTreeContext';

const DISCLAIMER = `
⚠️ 重要免责声明

PolicyTree Generator 不是医疗工具，不能替代专业心理治疗或医学建议。
如果您正在经历严重的心理困扰，请寻求专业帮助。

全国心理援助热线：400-161-9995
北京心理危机研究与干预中心：010-82951332
`;

function AppContent() {
  const { show } = useToast();
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [activeMode, setActiveMode] = useState('editor');
  const [showDataImport, setShowDataImport] = useState(false);
  const [showShareExport, setShowShareExport] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { policyTreeData, setPolicyTreeData } = usePolicyTreeContext();
  
  // 检查是否是首次使用（免责声明关闭后）
  useEffect(() => {
    if (!showDisclaimer) {
      const completed = localStorage.getItem('policytree_onboarding_completed');
      // 只要未完成引导就显示，不管有没有数据
      if (!completed) {
        console.log('[Onboarding] 显示引导');
        setShowOnboarding(true);
      } else {
        console.log('[Onboarding] 跳过引导（已完成）');
      }
    }
  }, [showDisclaimer]);
  
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // 引导完成后自动切换到编辑器
    setActiveMode('editor');
  };
  
  // 调试信息
  useEffect(() => {
    console.log('AppContent - policyTreeData:', policyTreeData);
  }, [policyTreeData]);
  
  // 新增：页面切换状态管理
  const [shouldNavigateToPolicyTree, setShouldNavigateToPolicyTree] = useState(false);
  
  const handleImport = useCallback(() => {
    setShowDataImport(true);
  }, []);
  
  const handleExport = useCallback(() => {
    setShowShareExport(true);
  }, []);
  
  // 处理导入的数据
  const handleDataImport = useCallback((data) => {
    try {
      setPolicyTreeData(data);
      if (typeof show === 'function') {
        show('导入成功！', 'success');
      }
      setShowDataImport(false);
    } catch (err) {
      if (typeof show === 'function') {
        show('导入失败：' + err.message, 'error');
      }
    }
  }, [setPolicyTreeData, show]);
  
  // 新增：处理从 PolicyBrainstorm 添加成功后的页面切换
  const handleAddToPolicyTree = useCallback((nodeData) => {
    // 存储待添加的节点数据
    window.pendingPolicyNode = nodeData;
    setShouldNavigateToPolicyTree(true);
  }, []);

  // 处理 PolicyBrainstorm 添加成功
  const handleAddSuccess = useCallback(() => {
    if (typeof show === 'function') {
      show('添加成功！', 'success');
    }
  }, [show]);
  
  // 新增：自动切换到国策树页面
  useEffect(() => {
    if (shouldNavigateToPolicyTree) {
      // 切换到国策树编辑器
      // 注意：数据已经在 Brainstorm 组件中保存到 localStorage 了
      setActiveMode('editor');
      setShouldNavigateToPolicyTree(false);
      
      if (typeof show === 'function') {
        show('国策已添加到国策树！', 'success');
      }
    }
  }, [shouldNavigateToPolicyTree, show]);

  const renderContent = () => {
    switch (activeMode) {
      case 'journal':
        return <JournalApp onClose={() => setActiveMode('editor')} />;
      case 'checkin':
        return <CheckInApp onViewTree={() => setActiveMode('editor')} />;
      case 'brainstorm':
        return <PolicyBrainstorm 
          onAddToPolicyTree={handleAddToPolicyTree}
          onAddSuccess={handleAddSuccess}
        />;
      case 'editor':
      default:
        return <PolicyTreeEditor />;
    }
  };

  if (showDisclaimer) {
    return (
      <div className="disclaimer-container">
        <div className="disclaimer-content">
          <AlertTriangle size={48} className="warning-icon" />
          <h2>使用前请阅读</h2>
          <pre>{DISCLAIMER}</pre>
          <button 
            className="accept-btn"
            onClick={() => setShowDisclaimer(false)}
          >
            我已了解，开始使用
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <BookContainer
        activeMode={activeMode}
        onModeChange={setActiveMode}
        onImport={handleImport}
        onExport={handleExport}
        onHelp={() => {}}
      >
        <div className="page-content">
          {renderContent()}
        </div>
      </BookContainer>

      {showDataImport && (
        <DataImport
          isOpen={showDataImport}
          onImport={handleDataImport}
          onClose={() => setShowDataImport(false)}
        />
      )}

      {showShareExport && (
        <ShareExport
          isOpen={showShareExport}
          treeData={policyTreeData}
          yamlContent={policyTreeData ? JSON.stringify(policyTreeData, null, 2) : ''}
          onClose={() => setShowShareExport(false)}
        />
      )}

      {showOnboarding && (
        <OnboardingGuide
          onComplete={handleOnboardingComplete}
          onSkip={() => setShowOnboarding(false)}
        />
      )}
    </>
  );
}

function App() {
  return (
    <ToastProvider>
      <PolicyTreeProvider>
        <AppContent />
      </PolicyTreeProvider>
    </ToastProvider>
  );
}

export default App;

// 最后更新时间: 2026-02-23 20:45
// 编辑人: Trae AI
// 版本: v0.11 - 修复导入导出功能
// 更新内容:
//   1. DataImport: 正确连接到 PolicyTreeContext，导入的数据会更新 policyTreeData
//   2. ShareExport: 从 PolicyTreeContext 获取 treeData 和 yamlContent
//   3. 添加 handleDataImport 函数处理导入成功逻辑
//   4. 添加 Toast 提示反馈导入结果
