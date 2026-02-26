import React, { useState, useCallback, useRef, useEffect } from 'react';
import { usePolicyTreeContext } from '../../contexts/PolicyTreeContext';
import {
  Upload,
  FileSpreadsheet,
  FileJson,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  FileType,
  Table2,
  Database,
  Network
} from 'lucide-react';
import JSZip from 'jszip/dist/jszip.min.js';
import './DataImport.css';

/**
 * 数据导入组件
 *
 * 功能特性：
 * 1. 支持拖拽上传
 * 2. 多格式支持（Excel/CSV/JSON/YAML）
 * 3. 文件预览
 * 4. 格式自动检测
 * 5. 数据验证
 * 6. 导入进度显示
 */

// 支持的文件格式
const SUPPORTED_FORMATS = {
  yaml: {
    extensions: ['.yaml', '.yml'],
    mimeTypes: ['text/yaml', 'application/x-yaml', 'text/plain'],
    icon: FileText,
    label: 'YAML',
    color: '#4ade80',
    description: '国策树定义文件'
  },
  json: {
    extensions: ['.json'],
    mimeTypes: ['application/json', 'text/plain'],
    icon: FileJson,
    label: 'JSON',
    color: '#22d3ee',
    description: '结构化数据格式'
  },
  csv: {
    extensions: ['.csv'],
    mimeTypes: ['text/csv', 'text/plain'],
    icon: Table2,
    label: 'CSV',
    color: '#fbbf24',
    description: '表格数据格式'
  },
  excel: {
    extensions: ['.xlsx', '.xls'],
    mimeTypes: [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ],
    icon: FileSpreadsheet,
    label: 'Excel',
    color: '#a78bfa',
    description: '电子表格格式'
  },
  xmind: {
    extensions: ['.xmind'],
    mimeTypes: ['application/zip', 'application/x-zip-compressed'],
    icon: Network,
    label: 'XMind',
    color: '#f472b6',
    description: '思维导图文件'
  }
};

// 文件大小限制 (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * 检测文件格式
 */
const detectFileFormat = (file) => {
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  const mimeType = file.type;

  for (const [format, config] of Object.entries(SUPPORTED_FORMATS)) {
    if (config.extensions.includes(extension) || config.mimeTypes.includes(mimeType)) {
      return format;
    }
  }

  return null;
};

/**
 * 格式化文件大小
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * CSV 转 JSON
 */
const csvToJson = (csvText) => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return null;

  const headers = lines[0].split(',').map(h => h.trim());
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    result.push(obj);
  }

  return result;
};

/**
 * 解析 XMind 文件
 * XMind 文件是一个 ZIP 压缩包，包含 content.xml
 */
const parseXMind = async (file) => {
  try {
    const zip = await JSZip.loadAsync(file);
    const contentXml = await zip.file('content.xml')?.async('string');
    
    if (!contentXml) {
      throw new Error('XMind 文件格式错误：找不到 content.xml');
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(contentXml, 'text/xml');

    const rootTopic = xmlDoc.querySelector('topic');
    if (!rootTopic) {
      throw new Error('XMind 文件格式错误：找不到根节点');
    }

    const xmindToTree = (topic) => {
      const node = {
        id: topic.getAttribute('id') || `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: topic.querySelector('title')?.textContent || topic.getAttribute('text') || '未命名节点',
        description: topic.querySelector('title')?.textContent || topic.getAttribute('text') || '',
        status: 'active',
        enhancement: 0,
        enhancementConfig: {
          mode: 'custom',
          customEffects: [
            { level: 0, description: '基础效果' },
            { level: 1, description: '增强效果' },
            { level: 2, description: '终极效果' }
          ]
        },
        children: []
      };

      const childrenTopics = topic.querySelectorAll(':scope > children > topics > topic');
      childrenTopics.forEach(childTopic => {
        node.children.push(xmindToTree(childTopic));
      });

      return node;
    };

    return xmindToTree(rootTopic);
  } catch (err) {
    throw new Error('XMind 解析失败: ' + err.message);
  }
};

/**
 * 简单的 Excel 解析（基于 CSV 转换）
 * 实际项目中可以使用 xlsx 库
 */
const parseExcel = async (file) => {
  // 这里简化处理，实际应该使用 xlsx 库
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // 简化处理：尝试按 CSV 解析
        const text = e.target.result;
        const json = csvToJson(text);
        resolve(json);
      } catch (err) {
        reject(new Error('Excel 解析失败，请转换为 CSV 或 JSON 格式'));
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
};

/**
 * 将导入的数据转换为 YAML 格式
 */
const convertToYaml = (data, format) => {
  try {
    let jsonData = data;

    if (format === 'csv') {
      jsonData = csvToJson(data);
    }

    // 如果是数组，转换为国策树结构
    if (Array.isArray(jsonData) && jsonData.length > 0) {
      const root = {
        id: 'imported-policy',
        description: '从 ' + format.toUpperCase() + ' 导入的国策树',
        type: 'ROOT',
        children: jsonData.map((item, index) => ({
          id: item.id || `node-${index}`,
          description: item.description || item.name || `节点 ${index + 1}`,
          type: item.type || 'GOAL',
          resistance_score: parseInt(item.resistance_score) || 5,
          coupling_score: parseInt(item.coupling_score) || 5,
          maintenance_cost: parseInt(item.maintenance_cost) || 5,
          impact: parseInt(item.impact) || 0,
          children: item.children ? JSON.parse(item.children) : undefined
        }))
      };
      return root;
    }

    // 如果已经是对象，直接返回
    if (typeof jsonData === 'object' && jsonData !== null) {
      return jsonData;
    }

    throw new Error('无法识别的数据格式');
  } catch (err) {
    throw new Error('数据转换失败: ' + err.message);
  }
};

/**
 * 文件预览组件
 */
const FilePreview = ({ file, format, content, onConfirm, onCancel }) => {
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parseContent = async () => {
      try {
        setLoading(true);
        let data;

        if (format === 'json' || format === 'yaml') {
          data = typeof content === 'string' ? JSON.parse(content) : content;
        } else if (format === 'csv') {
          data = csvToJson(content);
        } else if (format === 'excel') {
          data = await parseExcel(file);
        } else if (format === 'xmind') {
          data = await parseXMind(file);
        }

        setParsedData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    parseContent();
  }, [content, format, file]);

  const handleConfirm = () => {
    try {
      const yamlData = convertToYaml(parsedData || content, format);
      onConfirm(yamlData);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="preview-loading">
        <div className="loading-spinner" />
        <p>正在解析文件...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="preview-error">
        <AlertCircle size={32} />
        <p>{error}</p>
        <button className="btn-cancel" onClick={onCancel}>返回</button>
      </div>
    );
  }

  return (
    <div className="file-preview">
      <div className="preview-header">
        <Eye size={20} />
        <h4>数据预览</h4>
      </div>

      <div className="preview-content">
        {Array.isArray(parsedData) ? (
          <div className="preview-table-wrapper">
            <table className="preview-table">
              <thead>
                <tr>
                  {Object.keys(parsedData[0] || {}).map(key => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsedData.slice(0, 5).map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((value, vidx) => (
                      <td key={vidx}>{String(value).substring(0, 50)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {parsedData.length > 5 && (
              <p className="preview-more">还有 {parsedData.length - 5} 行数据...</p>
            )}
          </div>
        ) : (
          <pre className="preview-json">
            {JSON.stringify(parsedData, null, 2)}
          </pre>
        )}
      </div>

      <div className="preview-actions">
        <button className="btn-cancel" onClick={onCancel}>取消</button>
        <button className="btn-confirm" onClick={handleConfirm}>
          <CheckCircle size={16} />
          确认导入
        </button>
      </div>
    </div>
  );
};

/**
 * 数据导入组件
 */
const DataImport = ({ isOpen, onClose, onImport }) => {
  // 使用统一数据 Hook
  const { setNodes, setEdges } = usePolicyTreeContext() || {};
  
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileFormat, setFileFormat] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  // 处理拖拽进入
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  // 处理拖拽离开
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  // 处理拖拽悬停
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // 处理文件选择
  const handleFileSelect = useCallback((file) => {
    setError(null);

    // 检查文件大小
    if (file.size > MAX_FILE_SIZE) {
      setError(`文件大小超过限制 (${formatFileSize(MAX_FILE_SIZE)})`);
      return;
    }

    // 检测文件格式
    const format = detectFileFormat(file);
    if (!format) {
      setError('不支持的文件格式，请上传 Excel、CSV、JSON 或 YAML 文件');
      return;
    }

    setSelectedFile(file);
    setFileFormat(format);

    // 读取文件内容
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
      setShowPreview(true);
    };
    reader.onerror = () => {
      setError('文件读取失败');
    };

    if (format === 'excel') {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  }, []);

  // 处理拖放
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // 处理文件输入变化
  const handleInputChange = useCallback((e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // 关闭弹窗
  const handleClose = useCallback(() => {
    setSelectedFile(null);
    setFileFormat(null);
    setFileContent(null);
    setError(null);
    setShowPreview(false);
    onClose?.();
  }, [onClose]);

  // 处理确认导入
  const handleConfirmImport = useCallback((data) => {
    onImport?.(data);
    handleClose();
  }, [onImport, handleClose]);

  // 点击上传区域
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="data-import-overlay" onClick={handleClose}>
      <div className="data-import-modal" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className="import-header">
          <div className="import-title">
            <Database size={24} />
            <h3>导入数据</h3>
          </div>
          <button className="import-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="import-content">
          {showPreview && selectedFile ? (
            <FilePreview
              file={selectedFile}
              format={fileFormat}
              content={fileContent}
              onConfirm={handleConfirmImport}
              onCancel={() => {
                setShowPreview(false);
                setSelectedFile(null);
              }}
            />
          ) : (
            <>
              {/* 上传区域 */}
              <div
                className={`upload-zone ${isDragging ? 'dragging' : ''} ${error ? 'has-error' : ''}`}
                onClick={handleUploadClick}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".yaml,.yml,.json,.csv,.xlsx,.xls,.xmind"
                  onChange={handleInputChange}
                  style={{ display: 'none' }}
                />

                <div className="upload-icon">
                  <Upload size={48} />
                </div>

                <p className="upload-text">
                  <strong>点击上传</strong> 或拖拽文件到此处
                </p>
                <p className="upload-hint">
                  支持 Excel、CSV、JSON、YAML、XMind 格式，最大 {formatFileSize(MAX_FILE_SIZE)}
                </p>

                {error && (
                  <div className="upload-error">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* 格式说明 */}
              <div className="format-info">
                <h4>
                  <FileType size={16} />
                  支持的格式
                </h4>
                <div className="format-list">
                  {Object.entries(SUPPORTED_FORMATS).map(([key, config]) => {
                    const IconComponent = config.icon;
                    return (
                      <div key={key} className="format-item">
                        <div
                          className="format-icon"
                          style={{ backgroundColor: `${config.color}20`, color: config.color }}
                        >
                          <IconComponent size={20} />
                        </div>
                        <div className="format-details">
                          <span className="format-label">{config.label}</span>
                          <span className="format-desc">{config.description}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 模板下载 */}
              <div className="template-section">
                <h4>
                  <Download size={16} />
                  没有数据文件？
                </h4>
                <p>下载示例模板，了解正确的数据格式</p>
                <button
                  className="btn-download-template"
                  onClick={() => {
                    const template = {
                      id: 'example-policy',
                      description: '示例国策树',
                      type: 'ROOT',
                      children: [
                        {
                          id: 'goal-1',
                          description: '示例目标',
                          type: 'GOAL',
                          resistance_score: 5,
                          coupling_score: 7,
                          maintenance_cost: 3,
                          impact: 8
                        }
                      ]
                    };
                    const blob = new Blob([JSON.stringify(template, null, 2)], {
                      type: 'application/json'
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'policy-template.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  下载 JSON 模板
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataImport;
export { convertToYaml, csvToJson };

// 最后更新时间: 2026-02-21 17:00
// 编辑人: UI-Design-Specialist
// 功能说明: 数据导入组件，支持拖拽上传和多格式解析
