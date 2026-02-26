import React, { useState, useCallback, useEffect } from 'react';
import { usePolicyTreeContext } from '../../contexts/PolicyTreeContext';
import {
  X,
  Share2,
  Download,
  Image as ImageIcon,
  Link as LinkIcon,
  FileCode,
  CheckCircle,
  Copy,
  ExternalLink,
  QrCode,
  Mail,
  MessageCircle,
  Loader2,
  AlertCircle,
  Network
} from 'lucide-react';
import JSZip from 'jszip';
import './ShareExport.css';

/**
 * 分享导出组件
 *
 * 功能特性：
 * 1. 图片导出（国策树可视化截图）
 * 2. 链接分享（生成可分享链接）
 * 3. YAML 导出
 * 4. JSON 导出
 * 5. 二维码分享
 * 6. 社交分享
 */

// 导出格式配置
const EXPORT_FORMATS = {
  image: {
    id: 'image',
    label: '图片',
    description: '导出为 PNG 图片',
    icon: ImageIcon,
    color: '#4ade80',
    fileExtension: 'png'
  },
  yaml: {
    id: 'yaml',
    label: 'YAML',
    description: '导出 YAML 源文件',
    icon: FileCode,
    color: '#fbbf24',
    fileExtension: 'yaml'
  },
  json: {
    id: 'json',
    label: 'JSON',
    description: '导出 JSON 格式',
    icon: FileCode,
    color: '#22d3ee',
    fileExtension: 'json'
  },
  xmind: {
    id: 'xmind',
    label: 'XMind',
    description: '导出为 XMind 思维导图',
    icon: Network,
    color: '#f472b6',
    fileExtension: 'xmind'
  },
  full: {
    id: 'full',
    label: '完整数据',
    description: '包含神圣座位和稳态数据',
    icon: FileCode,
    color: '#a78bfa',
    fileExtension: 'json'
  }
};

// 分享方式配置
const SHARE_METHODS = {
  link: {
    id: 'link',
    label: '复制链接',
    icon: LinkIcon,
    color: '#a78bfa'
  },
  qr: {
    id: 'qr',
    label: '二维码',
    icon: QrCode,
    color: '#f472b6'
  },
  email: {
    id: 'email',
    label: '邮件',
    icon: Mail,
    color: '#60a5fa'
  }
};

/**
 * 将数据转换为 YAML 字符串
 */
const convertToYaml = (data, indent = 0) => {
  if (!data || typeof data !== 'object') return String(data);

  const spaces = '  '.repeat(indent);
  const lines = [];

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      lines.push(`${spaces}${key}:`);
    } else if (Array.isArray(value)) {
      lines.push(`${spaces}${key}:`);
      value.forEach(item => {
        if (typeof item === 'object') {
          lines.push(`${spaces}-`);
          lines.push(convertToYaml(item, indent + 1).replace(/^/gm, '  '));
        } else {
          lines.push(`${spaces}- ${item}`);
        }
      });
    } else if (typeof value === 'object') {
      lines.push(`${spaces}${key}:`);
      lines.push(convertToYaml(value, indent + 1));
    } else {
      lines.push(`${spaces}${key}: ${value}`);
    }
  }

  return lines.join('\n');
};

/**
 * 下载文件
 */
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * 将国策树转换为 XMind 格式
 */
const treeToXMind = (treeData) => {
  const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const nodeToXMindTopic = (node, indent = 0) => {
    const spaces = '  '.repeat(indent);
    const id = node.id || generateId();
    const title = node.name || node.description || '未命名节点';
    
    let xml = `${spaces}<topic id="${id}">\n`;
    xml += `${spaces}  <title>${escapeXml(title)}</title>\n`;
    
    if (node.children && node.children.length > 0) {
      xml += `${spaces}  <children>\n`;
      xml += `${spaces}    <topics>\n`;
      node.children.forEach(child => {
        xml += nodeToXMindTopic(child, indent + 3);
      });
      xml += `${spaces}    </topics>\n`;
      xml += `${spaces}  </children>\n`;
    }
    
    xml += `${spaces}</topic>\n`;
    return xml;
  };
  
  const escapeXml = (str) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };
  
  const rootId = treeData.id || generateId();
  const rootTitle = treeData.name || treeData.description || '国策树';
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<map version="1.0">\n';
  xml += `  <topic id="${rootId}">\n`;
  xml += `    <title>${escapeXml(rootTitle)}</title>\n`;
  
  if (treeData.children && treeData.children.length > 0) {
    xml += '    <children>\n';
    xml += '      <topics>\n';
    treeData.children.forEach(child => {
      xml += nodeToXMindTopic(child, 3);
    });
    xml += '      </topics>\n';
    xml += '    </children>\n';
  }
  
  xml += '  </topic>\n';
  xml += '</map>';
  
  return xml;
};

/**
 * 导出 XMind 文件
 */
const exportXMind = async (treeData) => {
  try {
    console.log('exportXMind - treeData:', treeData);
    
    if (!treeData) {
      throw new Error('没有数据可以导出');
    }

    // 生成唯一 ID
    const generateId = () => `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;

    // 将国策树转换为 XMind JSON 格式
    const convertToXMindTopic = (node) => {
      // 标题使用节点名称
      const title = node.name || '未命名节点';
      
      // 构建备注内容：显示描述和增强效果
      let noteContent = '';
      
      // 添加描述
      if (node.description && node.description !== node.name) {
        noteContent = node.description;
      }
      
      // 添加增强效果
      if (node.enhancementConfig?.customEffects) {
        const effectsText = node.enhancementConfig.customEffects
          .map(e => `等级${e.level}: ${e.description}`)
          .join('\n');
        if (noteContent) {
          noteContent += '\n\n【增强效果】\n' + effectsText;
        } else {
          noteContent = '【增强效果】\n' + effectsText;
        }
      }
      
      const topic = {
        id: node.id || generateId(),
        title: title,
        notes: noteContent ? {
          plain: {
            content: noteContent
          }
        } : {}
      };

      if (node.children && node.children.length > 0) {
        topic.children = {
          attached: node.children.map(child => convertToXMindTopic(child))
        };
      }

      return topic;
    };

    // 创建 XMind content.json 格式
    const xmindContent = [{
      id: generateId(),
      title: treeData.name || treeData.description || '国策树',
      rootTopic: convertToXMindTopic(treeData)
    }];

    const jsonContent = JSON.stringify(xmindContent, null, 2);
    console.log('exportXMind - jsonContent:', jsonContent);

    // 创建 manifest.json
    const manifestContent = JSON.stringify({
      "file-entries": {
        "content.json": {},
        "metadata.json": {}
      }
    }, null, 2);

    // 创建 metadata.json
    const metadataContent = JSON.stringify({
      "creator": {
        "name": "PolicyTree Generator",
        "version": "1.0.0"
      },
      "created": new Date().toISOString(),
      "modified": new Date().toISOString()
    }, null, 2);

    const zip = new JSZip();
    zip.file('content.json', jsonContent);
    zip.file('manifest.json', manifestContent);
    zip.file('metadata.json', metadataContent);

    const content = await zip.generateAsync({ 
      type: 'blob', 
      mimeType: 'application/vnd.xmind.workbook' 
    });

    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `policy-tree-${Date.now()}.xmind`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return true;
  } catch (err) {
    console.error('导出 XMind 失败:', err);
    alert('导出 XMind 失败: ' + err.message);
    return false;
  }
};

/**
 * 导出图片组件
 */
const ImageExport = ({ treeData, yamlContent, onExport }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const generateImage = useCallback(async () => {
    setIsExporting(true);
    try {
      // 获取国策树容器
      const treeContainer = document.querySelector('.policy-tree-container');
      if (!treeContainer) {
        throw new Error('找不到国策树可视化区域');
      }

      // 使用 html2canvas 或类似库生成图片
      // 这里简化处理，实际项目中应该使用 html2canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const rect = treeContainer.getBoundingClientRect();

      canvas.width = rect.width;
      canvas.height = rect.height;

      // 绘制背景
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制标题
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('PolicyTree', 20, 40);

      // 绘制描述
      ctx.fillStyle = '#9ca3af';
      ctx.font = '14px sans-serif';
      const description = treeData?.description || '国策树可视化';
      ctx.fillText(description, 20, 70);

      // 绘制时间戳
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.fillText(`生成时间: ${new Date().toLocaleString('zh-CN')}`, 20, canvas.height - 20);

      const dataUrl = canvas.toDataURL('image/png');
      setPreviewUrl(dataUrl);

      // 自动下载
      const link = document.createElement('a');
      link.download = `policy-tree-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      onExport?.('image', true);
    } catch (err) {
      console.error('导出图片失败:', err);
      onExport?.('image', false, err.message);
    } finally {
      setIsExporting(false);
    }
  }, [treeData, onExport]);

  return (
    <div className="export-section">
      <h4>
        <ImageIcon size={18} />
        导出图片
      </h4>
      <p>将国策树可视化导出为 PNG 图片，方便分享和展示</p>

      {previewUrl && (
        <div className="image-preview">
          <img src={previewUrl} alt="预览" />
        </div>
      )}

      <button
        className="btn-export"
        onClick={generateImage}
        disabled={isExporting}
      >
        {isExporting ? (
          <><Loader2 size={18} className="spin" /> 生成中...</>
        ) : (
          <><Download size={18} /> 导出图片</>
        )}
      </button>
    </div>
  );
};

/**
 * 导出代码组件
 */
const CodeExport = ({ treeData, yamlContent, format, onExport }) => {
  const [copied, setCopied] = useState(false);
  const config = EXPORT_FORMATS[format];
  const IconComponent = config.icon;

  const getFullExportData = () => {
    const fullData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      treeData: treeData,
      sacredSeats: [],
      steadyStates: {},
      checkInHistory: []
    };

    try {
      const savedSeats = localStorage.getItem('policytree_sacred_seats_v2');
      if (savedSeats) {
        fullData.sacredSeats = JSON.parse(savedSeats);
      }
    } catch (e) {
      console.warn('读取神圣座位数据失败:', e);
    }

    try {
      const savedRecords = localStorage.getItem('policytree_checkin_records');
      if (savedRecords) {
        fullData.checkInHistory = JSON.parse(savedRecords);
      }
    } catch (e) {
      console.warn('读取打卡记录失败:', e);
    }

    return fullData;
  };

  const getContent = () => {
    if (format === 'yaml') {
      return yamlContent || convertToYaml(treeData);
    }
    if (format === 'json') {
      return JSON.stringify(treeData, null, 2);
    }
    if (format === 'full') {
      return JSON.stringify(getFullExportData(), null, 2);
    }
    return '';
  };

  const handleDownload = () => {
    console.log('handleDownload - format:', format);
    console.log('handleDownload - treeData:', treeData);
    
    if (format === 'xmind') {
      if (!treeData) {
        console.error('handleDownload - 没有数据可以导出 XMind');
        alert('没有数据可以导出，请先在国策树编辑器中创建或导入数据');
        return;
      }
      exportXMind(treeData).then(success => {
        console.log('handleDownload - XMind 导出结果:', success);
        onExport?.(format, success);
      });
      return;
    }
    
    const content = getContent();
    console.log('handleDownload - content length:', content?.length);
    
    if (!content) {
      console.error('handleDownload - 没有内容可以导出');
      alert('没有数据可以导出，请先在国策树编辑器中创建或导入数据');
      return;
    }
    
    const filename = `policy-tree-${Date.now()}.${config.fileExtension}`;
    const mimeType = format === 'json' || format === 'full' ? 'application/json' : 'text/yaml';
    downloadFile(content, filename, mimeType);
    onExport?.(format, true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="export-section">
      <h4>
        <IconComponent size={18} style={{ color: config.color }} />
        导出 {config.label}
      </h4>
      <p>{config.description}</p>

      {format !== 'xmind' && (
        <div className="code-preview">
          <pre>{getContent().substring(0, 500)}</pre>
          {getContent().length > 500 && (
            <div className="code-overlay">...</div>
          )}
        </div>
      )}

      <div className="export-actions">
        {format !== 'xmind' && (
          <button className="btn-copy" onClick={handleCopy}>
            {copied ? (
              <><CheckCircle size={16} /> 已复制</>
            ) : (
              <><Copy size={16} /> 复制</>
            )}
          </button>
        )}
        <button
          className="btn-export"
          onClick={handleDownload}
          style={{ backgroundColor: config.color }}
        >
          <Download size={16} />
          下载 {config.label}
        </button>
      </div>
    </div>
  );
};

/**
 * 链接分享组件
 */
const LinkShare = ({ treeData, yamlContent }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateLink = useCallback(async () => {
    setGenerating(true);
    try {
      // 将数据编码到 URL 中
      const data = {
        tree: treeData,
        yaml: yamlContent,
        timestamp: Date.now()
      };
      const encoded = btoa(JSON.stringify(data));
      const url = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
      setShareUrl(url);
    } catch (err) {
      console.error('生成链接失败:', err);
    } finally {
      setGenerating(false);
    }
  }, [treeData, yamlContent]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  useEffect(() => {
    generateLink();
  }, [generateLink]);

  return (
    <div className="share-section">
      <h4>
        <LinkIcon size={18} />
        分享链接
      </h4>
      <p>生成一个可分享的链接，其他人可以通过链接查看你的国策树</p>

      {generating ? (
        <div className="generating">
          <Loader2 size={24} className="spin" />
          <span>生成链接中...</span>
        </div>
      ) : shareUrl ? (
        <div className="share-link-box">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="share-link-input"
          />
          <button
            className={`btn-copy-link ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? (
              <><CheckCircle size={16} /> 已复制</>
            ) : (
              <><Copy size={16} /> 复制</>
            )}
          </button>
        </div>
      ) : (
        <div className="share-error">
          <AlertCircle size={20} />
          <span>生成链接失败，请重试</span>
        </div>
      )}

      <div className="share-hint">
        提示：分享链接包含完整数据，无需服务器存储
      </div>
    </div>
  );
};

/**
 * 二维码分享组件
 */
const QRShare = ({ treeData }) => {
  const [qrUrl, setQrUrl] = useState('');
  const [generating, setGenerating] = useState(false);

  const generateQR = useCallback(async () => {
    setGenerating(true);
    try {
      // 生成分享链接
      const data = {
        tree: treeData,
        timestamp: Date.now()
      };
      const encoded = btoa(JSON.stringify(data));
      const shareUrl = `${window.location.origin}${window.location.pathname}?share=${encoded}`;

      // 使用 QRCode API 生成二维码
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;
      setQrUrl(qrApiUrl);
    } catch (err) {
      console.error('生成二维码失败:', err);
    } finally {
      setGenerating(false);
    }
  }, [treeData]);

  useEffect(() => {
    generateQR();
  }, [generateQR]);

  return (
    <div className="share-section">
      <h4>
        <QrCode size={18} />
        二维码分享
      </h4>
      <p>扫描二维码即可在移动设备上查看国策树</p>

      {generating ? (
        <div className="generating">
          <Loader2 size={24} className="spin" />
          <span>生成二维码中...</span>
        </div>
      ) : qrUrl ? (
        <div className="qr-code">
          <img src={qrUrl} alt="分享二维码" />
          <p>使用手机扫描二维码查看</p>
        </div>
      ) : (
        <div className="share-error">
          <AlertCircle size={20} />
          <span>生成二维码失败</span>
        </div>
      )}
    </div>
  );
};

/**
 * 社交分享组件
 */
const SocialShare = ({ treeData }) => {
  const shareText = `查看我的国策树：${treeData?.description || 'PolicyTree 可视化'}`;

  const handleShare = (platform) => {
    const data = {
      tree: treeData,
      timestamp: Date.now()
    };
    const encoded = btoa(JSON.stringify(data));
    const shareUrl = `${window.location.origin}${window.location.pathname}?share=${encoded}`;

    let url = '';
    switch (platform) {
      case 'weibo':
        url = `https://service.weibo.com/share/share.php?title=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent('分享国策树')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
        break;
      default:
        return;
    }

    if (platform === 'email') {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="share-section">
      <h4>
        <Share2 size={18} />
        社交分享
      </h4>
      <p>分享到社交媒体或发送给朋友</p>

      <div className="social-buttons">
        <button
          className="btn-social weibo"
          onClick={() => handleShare('weibo')}
        >
          <MessageCircle size={20} />
          微博
        </button>
        <button
          className="btn-social twitter"
          onClick={() => handleShare('twitter')}
        >
          <ExternalLink size={20} />
          Twitter
        </button>
        <button
          className="btn-social email"
          onClick={() => handleShare('email')}
        >
          <Mail size={20} />
          邮件
        </button>
      </div>
    </div>
  );
};

/**
 * 分享导出主组件
 */
const ShareExport = ({ isOpen, onClose, treeData: propTreeData, yamlContent: propYaml }) => {
  const [activeTab, setActiveTab] = useState('export');
  const [exportFormat, setExportFormat] = useState('yaml');
  const [shareMethod, setShareMethod] = useState('link');

  // 直接从 localStorage 获取完整数据
  const [localStorageData, setLocalStorageData] = useState(null);
  
  // 组件挂载时从 localStorage 读取
  useEffect(() => {
    try {
      const data = localStorage.getItem('policytree_editor_data');
      if (data) {
        const parsed = JSON.parse(data);
        setLocalStorageData(parsed);
        console.log('ShareExport - 从 localStorage 加载数据:', parsed.nodes?.length, '个节点');
      }
    } catch (error) {
      console.error('ShareExport - 读取 localStorage 失败:', error);
    }
  }, []);
  
  // 优先使用 props，其次使用 localStorage
  const treeData = propTreeData || localStorageData;
  const yamlContent = propYaml;

  // 调试信息
  useEffect(() => {
    console.log('ShareExport - treeData:', treeData);
    console.log('ShareExport - hasData:', treeData && Object.keys(treeData).length > 0);
  }, [treeData]);

  if (!isOpen) return null;

  const hasData = treeData && Object.keys(treeData).length > 0;

  return (
    <div className="share-export-overlay" onClick={onClose}>
      <div className="share-export-modal" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className="share-export-header">
          <div className="share-export-title">
            <Share2 size={24} />
            <h3>分享与导出</h3>
          </div>
          <button className="share-export-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* 标签页 */}
        <div className="share-export-tabs">
          <button
            className={`tab ${activeTab === 'export' ? 'active' : ''}`}
            onClick={() => setActiveTab('export')}
          >
            <Download size={16} />
            导出
          </button>
          <button
            className={`tab ${activeTab === 'share' ? 'active' : ''}`}
            onClick={() => setActiveTab('share')}
          >
            <LinkIcon size={16} />
            分享
          </button>
        </div>

        {/* 内容区域 */}
        <div className="share-export-content">
          {!hasData ? (
            <div className="no-data">
              <AlertCircle size={48} />
              <h4>还没有数据</h4>
              <p>请先解析 YAML 数据，然后再进行导出或分享</p>
            </div>
          ) : activeTab === 'export' ? (
            <div className="export-panel">
              {/* 导出格式选择 */}
              <div className="format-selector">
                {Object.entries(EXPORT_FORMATS).map(([key, config]) => (
                  <button
                    key={key}
                    className={`format-btn ${exportFormat === key ? 'active' : ''}`}
                    onClick={() => setExportFormat(key)}
                  >
                    <config.icon size={18} style={{ color: config.color }} />
                    <span>{config.label}</span>
                  </button>
                ))}
              </div>

              {/* 导出内容 */}
              {exportFormat === 'image' ? (
                <ImageExport treeData={treeData} yamlContent={yamlContent} />
              ) : (
                <CodeExport
                  treeData={treeData}
                  yamlContent={yamlContent}
                  format={exportFormat}
                />
              )}
              
              {exportFormat === 'full' && (
                <div className="export-info">
                  <h5>📦 完整数据包含</h5>
                  <ul>
                    <li>国策树结构数据</li>
                    <li>神圣座位配置</li>
                    <li>打卡历史记录</li>
                    <li>稳态分析数据</li>
                  </ul>
                  <p className="info-hint">
                    可用于数据备份或迁移到其他设备
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="share-panel">
              {/* 分享方式选择 */}
              <div className="share-method-selector">
                {Object.entries(SHARE_METHODS).map(([key, config]) => (
                  <button
                    key={key}
                    className={`method-btn ${shareMethod === key ? 'active' : ''}`}
                    onClick={() => setShareMethod(key)}
                  >
                    <config.icon size={18} style={{ color: config.color }} />
                    <span>{config.label}</span>
                  </button>
                ))}
              </div>

              {/* 分享内容 */}
              {shareMethod === 'link' && (
                <LinkShare treeData={treeData} yamlContent={yamlContent} />
              )}
              {shareMethod === 'qr' && <QRShare treeData={treeData} />}
              {shareMethod === 'email' && <SocialShare treeData={treeData} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareExport;
export { downloadFile, convertToYaml };

// 最后更新时间: 2026-02-21 17:15
// 编辑人: UI-Design-Specialist
// 功能说明: 分享导出组件，支持图片导出、链接分享和二维码
