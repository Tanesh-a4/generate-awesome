import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { FileData } from '../types';
import { 
  File, 
  Folder, 
  Save, 
  Download, 
  Trash2, 
  Eye,
  Loader2,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import './ProjectViewer.css';

interface ProjectViewerProps {
  files: FileData[];
  isGenerating: boolean;
}

const API_BASE_URL = 'http://localhost:5000/api';

const ProjectViewer: React.FC<ProjectViewerProps> = ({ files, isGenerating }) => {
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [originalContent, setOriginalContent] = useState<string>('');
  const [isModified, setIsModified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['']));

  // Organize files into a tree structure
  const fileTree = React.useMemo(() => {
    const tree: { [key: string]: FileData[] } = { '': [] };
    
    files.forEach((file) => {
      const parts = file.path.split('/');
      if (parts.length === 1) {
        tree[''].push(file);
      } else {
        const folder = parts.slice(0, -1).join('/');
        if (!tree[folder]) {
          tree[folder] = [];
        }
        tree[folder].push(file);
      }
    });
    
    return tree;
  }, [files]);

  const folders = Object.keys(fileTree).filter(f => f !== '').sort();

  useEffect(() => {
    if (selectedFile) {
      loadFileContent(selectedFile);
    }
  }, [selectedFile]);

  const loadFileContent = async (file: FileData) => {
    try {
      const response = await axios.get<{ content: string }>(
        `${API_BASE_URL}/file/${file.path}`
      );
      setFileContent(response.data.content);
      setOriginalContent(response.data.content);
      setIsModified(false);
    } catch (error) {
      console.error('Error loading file:', error);
    }
  };

  const handleFileSelect = (file: FileData) => {
    if (isModified) {
      const confirmed = window.confirm(
        'You have unsaved changes. Do you want to discard them?'
      );
      if (!confirmed) return;
    }
    setSelectedFile(file);
  };

  const handleContentChange = (value: string | undefined) => {
    if (value !== undefined) {
      setFileContent(value);
      setIsModified(value !== originalContent);
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    setIsSaving(true);
    try {
      await axios.put(`${API_BASE_URL}/file/${selectedFile.path}`, {
        content: fileContent,
      });
      setOriginalContent(fileContent);
      setIsModified(false);
      alert('File saved successfully!');
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Error saving file. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    if (!selectedFile) return;

    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePreview = () => {
    // Open the entire project preview, not just one file
    const previewUrl = 'http://localhost:5000/preview/';
    window.open(previewUrl, '_blank');
  };

  const handlePreviewFile = () => {
    // Preview a specific file (for non-HTML files or specific file preview)
    if (!selectedFile) return;
    const previewUrl = `http://localhost:5000/preview/${selectedFile.path}`;
    window.open(previewUrl, '_blank');
  };

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folder)) {
      newExpanded.delete(folder);
    } else {
      newExpanded.add(folder);
    }
    setExpandedFolders(newExpanded);
  };

  const getLanguageFromFilename = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      html: 'html',
      css: 'css',
      json: 'json',
      md: 'markdown',
      xml: 'xml',
      yaml: 'yaml',
      yml: 'yaml',
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  if (isGenerating) {
    return (
      <div className="project-viewer loading">
        <Loader2 className="loading-icon spinning" size={48} />
        <p>Generating your project...</p>
      </div>
    );
  }

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="project-viewer">
      <div className="file-explorer">
        <div className="explorer-header">
          <h3>📁 Project Files</h3>
          <button
            onClick={handlePreview}
            className="preview-project-button"
            title="Preview entire project in browser"
          >
            <Eye size={16} />
            Preview Project
          </button>
        </div>
        <div className="file-list">
          {/* Root files */}
          {fileTree[''].map((file) => (
            <div
              key={file.path}
              className={`file-item ${selectedFile?.path === file.path ? 'selected' : ''}`}
              onClick={() => handleFileSelect(file)}
            >
              <File size={16} />
              <span>{file.name}</span>
            </div>
          ))}
          
          {/* Folders */}
          {folders.map((folder) => (
            <div key={folder}>
              <div
                className="folder-item"
                onClick={() => toggleFolder(folder)}
              >
                {expandedFolders.has(folder) ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
                <Folder size={16} />
                <span>{folder}</span>
              </div>
              
              {expandedFolders.has(folder) && (
                <div className="folder-contents">
                  {fileTree[folder].map((file) => (
                    <div
                      key={file.path}
                      className={`file-item ${selectedFile?.path === file.path ? 'selected' : ''}`}
                      onClick={() => handleFileSelect(file)}
                    >
                      <File size={16} />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="editor-panel">
        {selectedFile ? (
          <>
            <div className="editor-header">
              <div className="file-info">
                <File size={18} />
                <span className="file-name">{selectedFile.name}</span>
                {isModified && <span className="modified-badge">●</span>}
              </div>
              <div className="editor-actions">
                <button
                  onClick={handleSave}
                  disabled={!isModified || isSaving}
                  className="action-button save"
                  title="Save file"
                >
                  {isSaving ? <Loader2 className="spinning" size={18} /> : <Save size={18} />}
                  Save
                </button>
                <button
                  onClick={handleDownload}
                  className="action-button"
                  title="Download file"
                >
                  <Download size={18} />
                  Download
                </button>
                {(selectedFile.name.endsWith('.html') || 
                  selectedFile.name.endsWith('.htm')) && (
                  <button
                    onClick={handlePreview}
                    className="action-button"
                    title="Preview in browser"
                  >
                    <Eye size={18} />
                    Preview
                  </button>
                )}
              </div>
            </div>
            
            <div className="editor-container">
              <Editor
                height="100%"
                language={getLanguageFromFilename(selectedFile.name)}
                value={fileContent}
                onChange={handleContentChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </>
        ) : (
          <div className="no-file-selected">
            <File size={64} className="placeholder-icon" />
            <p>Select a file to view and edit</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectViewer;
