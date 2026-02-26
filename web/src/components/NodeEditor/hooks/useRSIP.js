import { useState, useCallback } from 'react';

const CONTROLLABILITY_THRESHOLD = 70;

export function useRSIP(initialProblem = '') {
  const [currentProblem, setCurrentProblem] = useState(initialProblem);
  const [problemChain, setProblemChain] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [interventionPoint, setInterventionPoint] = useState(null);

  const calculateControllability = useCallback((state) => {
    const { resistance = 5, coupling = 5, maintenance = 5 } = state;
    const score = 10 - (resistance * 0.4 + coupling * 0.3 + maintenance * 0.3);
    return Math.max(0, Math.min(1, score / 10));
  }, []);

  const addPredecessor = useCallback((predecessor) => {
    const controllability = calculateControllability(predecessor);
    const newPredecessor = {
      id: `state_${Date.now()}`,
      description: predecessor.description,
      controllability,
      resistance: predecessor.resistance,
      coupling: predecessor.coupling,
      maintenance: predecessor.maintenance,
      isInterventionPoint: controllability >= CONTROLLABILITY_THRESHOLD / 100,
    };

    setProblemChain(prev => [...prev, newPredecessor]);
    setCurrentProblem(predecessor.description);

    if (controllability >= CONTROLLABILITY_THRESHOLD / 100) {
      setIsComplete(true);
      setInterventionPoint(newPredecessor);
    }

    return newPredecessor;
  }, [calculateControllability]);

  const reset = useCallback(() => {
    setCurrentProblem('');
    setProblemChain([]);
    setIsComplete(false);
    setInterventionPoint(null);
  }, []);

  return {
    currentProblem,
    problemChain,
    isComplete,
    interventionPoint,
    addPredecessor,
    calculateControllability,
    reset,
  };
}

export default useRSIP;

// 最后更新时间: 2026-02-22 14:10
// 编辑人: Trae AI
// 用途: RSIP 递归追问 Hook，实现生活状态可控性计算和干预点识别
