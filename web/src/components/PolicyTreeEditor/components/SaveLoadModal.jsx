// web/src/components/PolicyTreeEditor/components/SaveLoadModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Trash2, Check, Archive, Eye } from 'lucide-react';
import './SaveLoadModal.css';

/**
 * 存档管理弹窗组件
 * @param {Object} props
 * @param {boolean} props.isOpen - 弹窗是否打开
 * @param {Function} props.onClose - 关闭回调
 * @param {Object} props.storage - usePolicyTreeStorage 返回的对象
 * @param {Function} props.onPreview - 预览回调
 */
const SaveLoadModal = ({ isOpen, onClose, storage, onPreview }) => {
  const [metadata, setMetadata] = useState([]);
  const [renamingSlot, setRenamingSlot] = useState(null);
  const [newName, setNewName] = useState('');

  // 刷新元数据
  const refreshMetadata = () => {
    setMetadata(storage.getSavesMetadata());
  };

  useEffect(() => {
    if (isOpen) {
      refreshMetadata();
      setRenamingSlot(null);
      setNewName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 处理保存到指定槽位
  const handleSave = (id) => {
    // 如果该槽位已占用，默认先进入重命名流程（或直接覆盖）
    const existing = metadata.find(m => m.id === id);
    if (existing) {
      setRenamingSlot(id);
      setNewName(existing.name);
    } else {
      setRenamingSlot(id);
      setNewName(`存档 ${id}`);
    }
  };

  // 确认保存
  const confirmSave = (id) => {
    const finalName = newName.trim() || `存档 ${id}`;
    const success = storage.saveToSlot(id, finalName);
    if (success) {
      refreshMetadata();
      setRenamingSlot(null);
    }
  };

  // 处理加载
  const handleLoad = (id) => {
    const success = storage.loadFromSlot(id);
    if (success) {
      onClose();
    }
  };

  // 处理删除
  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这个存档吗？此操作无法撤销。')) {
      const success = storage.deleteSlot(id);
      if (success) {
        refreshMetadata();
      }
    }
  };

  // 渲染槽位列表
  const renderSlots = () => {
    const slots = [];
    for (let i = 1; i <= storage.MAX_SLOTS; i++) {
      const slotId = i.toString();
      const slot = metadata.find(m => m.id === slotId);
      const isRenaming = renamingSlot === slotId;

      slots.push(
        <div key={slotId} className={`save-slot ${slot ? 'occupied' : 'empty'}`}>
          {isRenaming ? (
            <div className="rename-container">
              <input
                autoFocus
                type="text"
                className="rename-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && confirmSave(slotId)}
                placeholder="输入存档名称..."
              />
              <button className="slot-btn btn-confirm" onClick={() => confirmSave(slotId)}>
                <Check size={16} /> 确认
              </button>
              <button className="slot-btn btn-cancel" onClick={() => setRenamingSlot(null)}>
                取消
              </button>
            </div>
          ) : (
            <>
              <div className="slot-info">
                <div className={`slot-name ${!slot ? 'slot-empty' : ''}`}>
                  {slot ? slot.name : `槽位 ${slotId} (空)`}
                </div>
                {slot && (
                  <div className="slot-meta">
                    <span>🕒 {new Date(slot.timestamp).toLocaleString()}</span>
                    <span>🌳 {slot.nodeCount} 个国策</span>
                  </div>
                )}
              </div>
              <div className="slot-actions">
                {slot ? (
                  <>
                    <button className="slot-btn btn-load" onClick={() => onPreview(slotId)} title="预览存档内容">
                      <Eye size={14} /> 预览
                    </button>
                    <button className="slot-btn btn-load" onClick={() => handleLoad(slotId)}>
                      <Upload size={14} /> 加载
                    </button>
                    <button className="slot-btn btn-save" onClick={() => handleSave(slotId)}>
                      <Save size={14} /> 覆盖
                    </button>
                    <button className="slot-btn btn-delete" onClick={(e) => handleDelete(slotId, e)}>
                      <Trash2 size={14} />
                    </button>
                  </>
                ) : (
                  <button className="slot-btn btn-save" onClick={() => handleSave(slotId)}>
                    <Save size={14} /> 保存到此位
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      );
    }
    return slots;
  };

  return (
    <div className="save-load-modal-overlay" onClick={onClose}>
      <div className="save-load-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><Archive size={24} /> 国策档案库</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-content">
          <div className="slots-grid">
            {renderSlots()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveLoadModal;
