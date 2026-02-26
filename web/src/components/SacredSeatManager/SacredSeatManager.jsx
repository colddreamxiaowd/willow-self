/**
 * SacredSeatManager - 神圣座位管理器
 * 
 * 理论基础：CTDP (链式时延协议) 第一代自控技术
 * 核心概念：通过物理位置建立行为约束，将特定座位与特定行为绑定
 * 
 * 灵感来源：知乎文章《自制力问题的数学物理方法》by edmond
 * 文章链接：https://www.zhihu.com/question/19888447/answer/1930799480401293785
 * 
 * 原理说明：
 * - 神圣座位：专门用于执行特定高价值行为的物理位置
 * - 违规记录：当在神圣座位执行非目标行为时记录
 * - 行为白名单：允许在神圣座位上执行的辅助行为
 */

import React, { useState, useCallback } from 'react';
import { useSacredSeatManager } from '../../hooks/useSacredSeatManager';
import SacredSeatCreator from './SacredSeatCreator';
import SacredSeatCard from './SacredSeatCard';
import ViolationHistory from './ViolationHistory';
import ManualViolationRecorder from './ManualViolationRecorder';
import BehaviorWhitelist from './BehaviorWhitelist';
import './SacredSeatManager.css';

function SacredSeatManager({ policies, onClose }) {
  const [showCreator, setShowCreator] = useState(false);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [showViolationRecorder, setShowViolationRecorder] = useState(false);
  const [showBehaviorWhitelist, setShowBehaviorWhitelist] = useState(false);
  const { 
    sacredSeats, 
    createSacredSeat, 
    updateSacredSeat, 
    deleteSacredSeat,
    recordViolation,
    getActiveSeats,
    getViolationHistory,
    allowBehavior,
    removeAllowedBehavior
  } = useSacredSeatManager();

  const activeSeats = getActiveSeats();
  const violationHistory = getViolationHistory();

  const handleCreateSeat = useCallback((seatData) => {
    createSacredSeat(seatData);
    setShowCreator(false);
  }, [createSacredSeat]);

  const handleDeleteSeat = useCallback((seatId) => {
    if (window.confirm('确定要删除这个神圣座位吗？删除后相关的承诺记录将保留。')) {
      deleteSacredSeat(seatId);
      if (selectedSeatId === seatId) {
        setSelectedSeatId(null);
      }
    }
  }, [deleteSacredSeat, selectedSeatId]);

  const handleRecordViolation = useCallback((seatId, reason, note) => {
    recordViolation(seatId, reason, note);
  }, [recordViolation]);

  const handleRecordViolationWithData = useCallback((seatId, violationData) => {
    recordViolation(seatId, violationData);
    setShowViolationRecorder(false);
  }, [recordViolation]);

  const handleAllowBehavior = useCallback((seatId, allowData) => {
    if (allowBehavior) {
      allowBehavior(seatId, allowData);
    }
    setShowViolationRecorder(false);
  }, [allowBehavior]);

  const handleRemoveBehavior = useCallback((seatId, behaviorId) => {
    if (removeAllowedBehavior) {
      removeAllowedBehavior(seatId, behaviorId);
    }
  }, [removeAllowedBehavior]);

  const getPolicyName = useCallback((policyId) => {
    const policy = policies.find(p => p.id === policyId);
    return policy?.data?.name || '未知国策';
  }, [policies]);

  const selectedSeat = selectedSeatId 
    ? sacredSeats.find(s => s.id === selectedSeatId) 
    : null;

  return (
    <div className="sacred-seat-manager">
      <div className="manager-header">
        <h2>🪑 神圣座位管理</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="manager-intro">
        <p>
          <strong>神圣座位</strong>是你主动设定的承诺：在特定的时间节点或物理空间，
          你承诺只做特定的事情。这是自我控制的核心机制。
        </p>
      </div>

      <div className="manager-content">
        <div className="seats-section">
          <div className="section-header">
            <h3>我的神圣座位 ({activeSeats.length})</h3>
            <button 
              className="create-btn"
              onClick={() => setShowCreator(true)}
            >
              + 创建新座位
            </button>
          </div>

          {activeSeats.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">椅子</div>
              <p>还没有创建神圣座位</p>
              <p className="empty-hint">创建一个神圣座位，开始你的自我控制之旅</p>
            </div>
          ) : (
            <div className="seats-list">
              {activeSeats.map(seat => (
                <SacredSeatCard
                  key={seat.id}
                  seat={seat}
                  policyName={getPolicyName(seat.policyId)}
                  isSelected={selectedSeatId === seat.id}
                  onSelect={() => setSelectedSeatId(seat.id)}
                  onDelete={() => handleDeleteSeat(seat.id)}
                  onRecordViolation={handleRecordViolation}
                />
              ))}
            </div>
          )}
        </div>

        {selectedSeat && (
          <div className="seat-detail">
            <div className="detail-actions">
              <button 
                className="action-btn record-btn"
                onClick={() => setShowViolationRecorder(true)}
              >
                记录违规
              </button>
              <button 
                className="action-btn whitelist-btn"
                onClick={() => setShowBehaviorWhitelist(true)}
              >
                行为白名单 ({(selectedSeat.allowedBehaviors || []).length})
              </button>
            </div>
            <ViolationHistory 
              violations={selectedSeat.violations || []}
              policyName={getPolicyName(selectedSeat.policyId)}
            />
          </div>
        )}
      </div>

      {showCreator && (
        <SacredSeatCreator
          policies={policies}
          onCreate={handleCreateSeat}
          onCancel={() => setShowCreator(false)}
        />
      )}

      {showViolationRecorder && selectedSeat && (
        <div className="modal-overlay">
          <ManualViolationRecorder
            sacredSeat={selectedSeat}
            onRecordViolation={handleRecordViolationWithData}
            onAllowBehavior={handleAllowBehavior}
            onClose={() => setShowViolationRecorder(false)}
          />
        </div>
      )}

      {showBehaviorWhitelist && selectedSeat && (
        <div className="modal-overlay">
          <BehaviorWhitelist
            sacredSeat={selectedSeat}
            onRemoveBehavior={handleRemoveBehavior}
            onClose={() => setShowBehaviorWhitelist(false)}
          />
        </div>
      )}
    </div>
  );
}

export default SacredSeatManager;

// 最后更新时间: 2026-02-24 11:20
// 编辑人: Trae AI
// 更新内容:
//   1. 集成手动违规记录器 (ManualViolationRecorder)
//   2. 集成行为白名单 (BehaviorWhitelist)
//   3. 添加"记录违规"和"行为白名单"按钮
