import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Loader2 } from 'lucide-react';
import { FileData, GenerationStatus } from '../types';
import './PromptInput.css';

interface PromptInputProps {
  onGenerationStart: (requestId: string) => void;
  onGenerationComplete: (files: FileData[]) => void;
  onGenerationError: () => void;
  isGenerating: boolean;
  requestId: string | null;
}

const API_BASE_URL = 'http://localhost:5000/api';

const PromptInput: React.FC<PromptInputProps> = ({
  onGenerationStart,
  onGenerationComplete,
  onGenerationError,
  isGenerating,
  requestId,
}) => {
  const [prompt, setPrompt] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!requestId) return;

    const checkStatus = async () => {
      try {
        const response = await axios.get<GenerationStatus>(
          `${API_BASE_URL}/status/${requestId}`
        );
        
        setStatusMessage(response.data.message);

        if (response.data.status === 'completed') {
          // Fetch the generated files
          const filesResponse = await axios.get<{ files: FileData[] }>(
            `${API_BASE_URL}/files`
          );
          onGenerationComplete(filesResponse.data.files);
          setStatusMessage('Project generated successfully! ✨');
        } else if (response.data.status === 'error') {
          setStatusMessage(`Error: ${response.data.error || 'Unknown error'}`);
          onGenerationError();
        } else if (response.data.status === 'processing') {
          // Continue polling
          setTimeout(checkStatus, 2000);
        }
      } catch (error) {
        console.error('Error checking status:', error);
        setStatusMessage('Error checking generation status');
        onGenerationError();
      }
    };

    checkStatus();
  }, [requestId, onGenerationComplete, onGenerationError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim() || isGenerating) return;

    setStatusMessage('Starting generation...');

    try {
      const response = await axios.post<{ request_id: string; status: string; message: string }>(
        `${API_BASE_URL}/generate`,
        { prompt }
      );

      onGenerationStart(response.data.request_id);
    } catch (error) {
      console.error('Error starting generation:', error);
      setStatusMessage('Error starting generation. Please try again.');
      onGenerationError();
    }
  };

  return (
    <div className="prompt-input-container">
      <form onSubmit={handleSubmit} className="prompt-form">
        <div className="input-wrapper">
          <textarea
            className="prompt-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your project... (e.g., 'Build a colorful modern todo app in HTML, CSS, and JS')"
            rows={4}
            disabled={isGenerating}
          />
          <button
            type="submit"
            className="submit-button"
            disabled={!prompt.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="icon spinning" size={20} />
                Generating...
              </>
            ) : (
              <>
                <Send className="icon" size={20} />
                Generate Project
              </>
            )}
          </button>
        </div>
      </form>
      
      {statusMessage && (
        <div className={`status-message ${isGenerating ? 'processing' : 'completed'}`}>
          {isGenerating && <Loader2 className="status-icon spinning" size={16} />}
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default PromptInput;
