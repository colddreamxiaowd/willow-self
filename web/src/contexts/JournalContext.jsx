import React, { createContext, useReducer, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'journal-projects';

const initialState = {
  projects: [],
  currentProject: null,
  isLoading: true,
  error: null
};

function journalReducer(state, action) {
  switch (action.type) {
    case 'LOAD_PROJECTS':
      return { ...state, projects: action.payload, isLoading: false };
    case 'CREATE_PROJECT':
      return { 
        ...state, 
        projects: [action.payload, ...state.projects],
        currentProject: action.payload
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.id ? action.payload : p
        ),
        currentProject: state.currentProject?.id === action.payload.id 
          ? action.payload 
          : state.currentProject
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        currentProject: state.currentProject?.id === action.payload 
          ? null 
          : state.currentProject
      };
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}

export const JournalContext = createContext();

export function JournalProvider({ children }) {
  const [state, dispatch] = useReducer(journalReducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const projects = JSON.parse(saved);
        dispatch({ type: 'LOAD_PROJECTS', payload: projects });
      } else {
        dispatch({ type: 'LOAD_PROJECTS', payload: [] });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.projects));
    }
  }, [state.projects, state.isLoading]);

  const createProject = useCallback((project) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: 'CREATE_PROJECT', payload: newProject });
    return newProject;
  }, []);

  const updateProject = useCallback((project) => {
    const updated = {
      ...project,
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: 'UPDATE_PROJECT', payload: updated });
  }, []);

  const deleteProject = useCallback((id) => {
    dispatch({ type: 'DELETE_PROJECT', payload: id });
  }, []);

  const setCurrentProject = useCallback((project) => {
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
  }, []);

  return (
    <JournalContext.Provider value={{
      ...state,
      createProject,
      updateProject,
      deleteProject,
      setCurrentProject
    }}>
      {children}
    </JournalContext.Provider>
  );
}

// 最后更新时间: 2026-02-22 16:45
// 编辑人: Trae AI
