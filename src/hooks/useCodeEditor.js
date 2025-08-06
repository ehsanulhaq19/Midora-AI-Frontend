// hooks/useCodeEditor.js
import { useState, useCallback } from 'react';

export const useCodeEditor = () => {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorCode, setEditorCode] = useState('');
  const [editorLanguage, setEditorLanguage] = useState('text');
  const [editingMessageIndex, setEditingMessageIndex] = useState(null);
  const [versions, setVersions] = useState([]);

  const openEditor = useCallback((code, language, messageIndex) => {
    setEditorCode(code);
    setEditorLanguage(language);
    setEditingMessageIndex(messageIndex);
    setEditorOpen(true);

    // Save version history
    const newVersion = {
      id: Date.now(),
      code: code,
      timestamp: new Date().toISOString(),
      description: 'Original version'
    };
    setVersions(prev => [newVersion, ...prev.slice(0, 4)]); // Keep last 5 versions
  }, []);

  const closeEditor = useCallback(() => {
    setEditorOpen(false);
    setEditingMessageIndex(null);
    setEditorCode('');
    setEditorLanguage('text');
  }, []);

  const saveCode = useCallback(() => {
    setEditingMessageIndex(null);
  }, []);

  const updateCode = useCallback((newCode) => {
    setEditorCode(newCode);
  }, []);

  const createVersion = useCallback((description = 'Manual save') => {
    const newVersion = {
      id: Date.now(),
      code: editorCode,
      timestamp: new Date().toISOString(),
      description
    };
    setVersions(prev => [newVersion, ...prev.slice(0, 4)]);
    return newVersion;
  }, [editorCode]);

  const restoreVersion = useCallback((version) => {
    setEditorCode(version.code);
  }, []);

  const getEditorStats = useCallback(() => {
    const lines = editorCode.split('\n').length;
    const characters = editorCode.length;
    const words = editorCode.trim() ? editorCode.trim().split(/\s+/).length : 0;

    return {
      lines,
      characters,
      words,
      language: editorLanguage
    };
  }, [editorCode, editorLanguage]);

  return {
    // State
    editorOpen,
    editorCode,
    editorLanguage,
    editingMessageIndex,
    versions,

    // Actions
    openEditor,
    closeEditor,
    saveCode,
    updateCode,
    createVersion,
    restoreVersion,

    // Computed
    editorStats: getEditorStats(),
    hasVersions: versions.length > 0,
    isEditing: editingMessageIndex !== null
  };
};