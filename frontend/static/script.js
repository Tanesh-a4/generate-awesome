// Global variables
let currentJobId = null;
let statusCheckInterval = null;

// DOM elements
const elements = {
    // Sections
    inputSection: document.getElementById('inputSection'),
    loadingSection: document.getElementById('loadingSection'),
    resultsSection: document.getElementById('resultsSection'),
    errorSection: document.getElementById('errorSection'),
    
    // Form elements
    projectForm: document.getElementById('projectForm'),
    projectPrompt: document.getElementById('projectPrompt'),
    recursionLimit: document.getElementById('recursionLimit'),
    generateBtn: document.getElementById('generateBtn'),
    advancedToggle: document.getElementById('advancedToggle'),
    advancedOptions: document.getElementById('advancedOptions'),
    
    // Loading elements
    loadingMessage: document.getElementById('loadingMessage'),
    progressFill: document.getElementById('progressFill'),
    cancelBtn: document.getElementById('cancelBtn'),
    
    // Results elements
    projectName: document.getElementById('projectName'),
    projectDescription: document.getElementById('projectDescription'),
    projectTechstack: document.getElementById('projectTechstack'),
    projectFeatures: document.getElementById('projectFeatures'),
    projectFiles: document.getElementById('projectFiles'),
    implementationSteps: document.getElementById('implementationSteps'),
    rawOutput: document.getElementById('rawOutput'),
    rawOutputHeader: document.getElementById('rawOutputHeader'),
    rawOutputContent: document.getElementById('rawOutputContent'),
    
    // Action buttons
    downloadBtn: document.getElementById('downloadBtn'),
    newProjectBtn: document.getElementById('newProjectBtn'),
    retryBtn: document.getElementById('retryBtn'),
    
    // Error elements
    errorMessage: document.getElementById('errorMessage'),
    errorDetails: document.getElementById('errorDetails')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    showSection('input');
});

function initializeEventListeners() {
    // Form submission
    elements.projectForm.addEventListener('submit', handleFormSubmit);
    
    // Advanced options toggle
    elements.advancedToggle.addEventListener('click', toggleAdvancedOptions);
    
    // Action buttons
    elements.cancelBtn.addEventListener('click', cancelGeneration);
    elements.newProjectBtn.addEventListener('click', startNewProject);
    elements.retryBtn.addEventListener('click', retryGeneration);
    elements.downloadBtn.addEventListener('click', downloadResults);
    
    // Raw output collapsible
    elements.rawOutputHeader.addEventListener('click', toggleRawOutput);
    
    // Auto-resize textarea
    elements.projectPrompt.addEventListener('input', autoResizeTextarea);
}

function showSection(section) {
    // Hide all sections
    elements.inputSection.classList.add('hidden');
    elements.loadingSection.classList.add('hidden');
    elements.resultsSection.classList.add('hidden');
    elements.errorSection.classList.add('hidden');
    
    // Show selected section
    switch(section) {
        case 'input':
            elements.inputSection.classList.remove('hidden');
            break;
        case 'loading':
            elements.loadingSection.classList.remove('hidden');
            break;
        case 'results':
            elements.resultsSection.classList.remove('hidden');
            break;
        case 'error':
            elements.errorSection.classList.remove('hidden');
            break;
    }
}

function toggleAdvancedOptions() {
    const isVisible = elements.advancedOptions.classList.contains('show');
    if (isVisible) {
        elements.advancedOptions.classList.remove('show');
        elements.advancedToggle.innerHTML = '<i class="fas fa-cog"></i> Advanced Options';
    } else {
        elements.advancedOptions.classList.add('show');
        elements.advancedToggle.innerHTML = '<i class="fas fa-cog"></i> Hide Advanced';
    }
}

function autoResizeTextarea() {
    const textarea = elements.projectPrompt;
    textarea.style.height = 'auto';
    textarea.style.height = Math.max(120, textarea.scrollHeight) + 'px';
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(elements.projectForm);
    const prompt = formData.get('prompt').trim();
    const recursionLimit = parseInt(formData.get('recursion_limit')) || 100;
    
    if (!prompt) {
        alert('Please enter a project description');
        return;
    }
    
    try {
        showSection('loading');
        updateLoadingMessage('Sending request to AI agent...');
        updateProgress(10);
        
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                recursion_limit: recursionLimit
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        currentJobId = data.job_id;
        updateLoadingMessage('Project generation started...');
        updateProgress(20);
        
        // Start polling for status
        startStatusPolling();
        
    } catch (error) {
        console.error('Error starting generation:', error);
        showError('Failed to start project generation', error.message);
    }
}

function startStatusPolling() {
    if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
    }
    
    statusCheckInterval = setInterval(checkJobStatus, 2000);
    checkJobStatus(); // Check immediately
}

async function checkJobStatus() {
    if (!currentJobId) return;
    
    try {
        const response = await fetch(`/api/status/${currentJobId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        updateLoadingMessage(data.progress || 'Processing...');
        
        // Update progress based on status
        if (data.status === 'running') {
            updateProgress(Math.min(80, 30 + Math.random() * 40));
        } else if (data.status === 'completed') {
            updateProgress(100);
            clearInterval(statusCheckInterval);
            statusCheckInterval = null;
            
            setTimeout(() => {
                displayResults(data.result);
            }, 1000);
            
        } else if (data.status === 'error') {
            clearInterval(statusCheckInterval);
            statusCheckInterval = null;
            showError('Generation failed', data.error, data.traceback);
        }
        
    } catch (error) {
        console.error('Error checking status:', error);
        clearInterval(statusCheckInterval);
        statusCheckInterval = null;
        showError('Connection error', 'Failed to check generation status');
    }
}

function updateLoadingMessage(message) {
    elements.loadingMessage.textContent = message;
}

function updateProgress(percentage) {
    elements.progressFill.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
}

function cancelGeneration() {
    if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
        statusCheckInterval = null;
    }
    currentJobId = null;
    showSection('input');
}

function displayResults(result) {
    try {
        showSection('results');
        
        // Display plan information
        if (result.plan) {
            elements.projectName.textContent = result.plan.name || 'N/A';
            elements.projectDescription.textContent = result.plan.description || 'N/A';
            elements.projectTechstack.textContent = result.plan.techstack || 'N/A';
            
            // Display features
            elements.projectFeatures.innerHTML = '';
            if (result.plan.features && result.plan.features.length > 0) {
                result.plan.features.forEach(feature => {
                    const li = document.createElement('li');
                    li.textContent = feature;
                    elements.projectFeatures.appendChild(li);
                });
            } else {
                elements.projectFeatures.innerHTML = '<li>No features specified</li>';
            }
            
            // Display files
            elements.projectFiles.innerHTML = '';
            if (result.plan.files && result.plan.files.length > 0) {
                result.plan.files.forEach(file => {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-item';
                    fileItem.innerHTML = `
                        <i class="fas fa-file-code file-icon"></i>
                        <span class="file-path">${file.path}</span>
                        <span class="file-purpose">${file.purpose}</span>
                    `;
                    elements.projectFiles.appendChild(fileItem);
                });
            } else {
                elements.projectFiles.innerHTML = '<div class="file-item">No files specified</div>';
            }
        }
        
        // Display implementation steps
        elements.implementationSteps.innerHTML = '';
        if (result.task_plan && result.task_plan.implementation_steps) {
            result.task_plan.implementation_steps.forEach((step, index) => {
                const stepItem = document.createElement('div');
                stepItem.className = 'step-item';
                stepItem.innerHTML = `
                    <div class="step-header">
                        <div class="step-number">${index + 1}</div>
                        <div class="step-file">${step.filepath}</div>
                    </div>
                    <div class="step-description">${step.task_description}</div>
                `;
                elements.implementationSteps.appendChild(stepItem);
            });
        } else {
            elements.implementationSteps.innerHTML = '<div class="step-item">No implementation steps available</div>';
        }
        
        // Display raw output
        elements.rawOutput.textContent = JSON.stringify(result, null, 2);
        
        // Load and display actual project files
        loadProjectFiles();
        
    } catch (error) {
        console.error('Error displaying results:', error);
        showError('Display error', 'Failed to display results properly');
    }
}

async function loadProjectFiles() {
    if (!currentJobId) return;
    
    try {
        const response = await fetch(`/api/project-files/${currentJobId}`);
        const data = await response.json();
        
        if (data.files && data.files.length > 0) {
            // Update the files display with actual generated files
            const filesContainer = elements.projectFiles;
            filesContainer.innerHTML = '';
            
            data.files.forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <i class="fas fa-file-code file-icon"></i>
                    <span class="file-path">${file.path}</span>
                    <span class="file-purpose">${file.size_human}</span>
                `;
                filesContainer.appendChild(fileItem);
            });
            
            // Update download button text to show it's a complete project
            elements.downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Project ZIP';
        }
    } catch (error) {
        console.error('Error loading project files:', error);
    }
}

function showError(title, message, details = null) {
    showSection('error');
    elements.errorMessage.textContent = message;
    
    if (details) {
        elements.errorDetails.textContent = details;
        elements.errorDetails.parentElement.style.display = 'block';
    } else {
        elements.errorDetails.parentElement.style.display = 'none';
    }
}

function startNewProject() {
    // Reset form
    elements.projectForm.reset();
    elements.projectPrompt.style.height = 'auto';
    
    // Reset state
    currentJobId = null;
    if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
        statusCheckInterval = null;
    }
    
    // Show input section
    showSection('input');
}

function retryGeneration() {
    showSection('input');
}

function downloadResults() {
    if (!currentJobId) return;
    
    // Show loading state
    elements.downloadBtn.disabled = true;
    elements.downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing Download...';
    
    // Create a temporary link to download the ZIP file
    const downloadLink = document.createElement('a');
    downloadLink.href = `/api/download/${currentJobId}`;
    downloadLink.download = `generated_project_${currentJobId}.zip`;
    
    // Add to DOM, click, and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Reset button state after a delay
    setTimeout(() => {
        elements.downloadBtn.disabled = false;
        elements.downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
    }, 2000);
}

function toggleRawOutput() {
    const header = elements.rawOutputHeader;
    const content = elements.rawOutputContent;
    
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        header.classList.remove('expanded');
    } else {
        content.classList.add('expanded');
        header.classList.add('expanded');
    }
}

// Utility functions
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

// Handle page visibility change (pause polling when tab is hidden)
document.addEventListener('visibilitychange', function() {
    if (document.hidden && statusCheckInterval) {
        clearInterval(statusCheckInterval);
        statusCheckInterval = null;
    } else if (!document.hidden && currentJobId && !statusCheckInterval) {
        startStatusPolling();
    }
});