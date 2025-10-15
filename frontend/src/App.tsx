import React, { useState } from 'react';
import './App.css';
import PromptInput from './components/PromptInput';
import ProjectViewer from './components/ProjectViewer'
import { FileData } from './types';

function App() {
  const [generatedFiles, setGeneratedFiles] = useState<FileData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);

  const handleGenerationStart = (requestId: string) => {
    setCurrentRequestId(requestId);
    setIsGenerating(true);
  };

  const handleGenerationComplete = (files: FileData[]) => {
    setGeneratedFiles(files);
    setIsGenerating(false);
    setCurrentRequestId(null);
  };

  const handleGenerationError = () => {
    setIsGenerating(false);
    setCurrentRequestId(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🤖 Generate Awesome</h1>
        <p>Generate and edit your projects with AI assistance</p>
      </header>
      
      <main className="App-main">
        <PromptInput 
          onGenerationStart={handleGenerationStart}
          onGenerationComplete={handleGenerationComplete}
          onGenerationError={handleGenerationError}
          isGenerating={isGenerating}
          requestId={currentRequestId}
        />
        
        {(generatedFiles.length > 0 || isGenerating) && (
          <ProjectViewer 
            files={generatedFiles}
            isGenerating={isGenerating}
          />
        )}
      </main>
    </div>
  );
}

export default App;
