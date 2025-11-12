'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sparkles, Code, Eye, Download, Plus, Loader2, CheckCircle, XCircle } from "lucide-react";
import ProjectPreview from "@/components/project-preview";

interface GeneratedProject {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
  js: string;
  createdAt: string;
  status?: string;
}

interface GenerationProgress {
  requestId: string | null;
  status: 'idle' | 'processing' | 'completed' | 'error';
  message: string;
  progress: number;
}

export default function Dashboard() {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [generatedProjects, setGeneratedProjects] = useState<GeneratedProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<GeneratedProject | null>(null);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
    requestId: null,
    status: 'idle',
    message: '',
    progress: 0
  });

  // Poll for status updates
  const pollStatus = async (requestId: string) => {
    let attempts = 0;
    const maxAttempts = 120; // 10 minutes with 5-second intervals
    
    const progressMessages = [
      "AI is analyzing your requirements...",
      "Planning the project structure...",
      "Designing the user interface...",
      "Writing HTML structure...",
      "Crafting beautiful CSS styles...",
      "Adding interactive JavaScript...",
      "Optimizing and finalizing...",
      "Almost ready..."
    ];
    
    let messageIndex = 0;
    
    const poll = async () => {
      try {
        const response = await fetch(`/api/status/${requestId}`);
        
        if (response.ok) {
          const statusData = await response.json();
          
          // Update message based on progress
          if (statusData.status === 'processing') {
            const newProgress = Math.min(90, 20 + (attempts * 3));
            const newMessageIndex = Math.floor(newProgress / 12);
            
            setGenerationProgress(prev => ({
              ...prev,
              status: statusData.status,
              message: statusData.message || progressMessages[Math.min(newMessageIndex, progressMessages.length - 1)],
              progress: newProgress
            }));
          } else {
            setGenerationProgress(prev => ({
              ...prev,
              status: statusData.status,
              message: statusData.message,
              progress: statusData.status === 'completed' ? 100 : prev.progress
            }));
          }

          if (statusData.status === 'completed') {
            await handleCompletedGeneration(requestId);
            return;
          } else if (statusData.status === 'error') {
            setGenerationProgress(prev => ({
              ...prev,
              status: 'error',
              message: statusData.error || statusData.message || 'Generation failed'
            }));
            return;
          }
        } else {
          // Handle HTTP errors
          console.error('Status check failed with status:', response.status);
          if (response.status === 404) {
            setGenerationProgress(prev => ({
              ...prev,
              status: 'error',
              message: 'Generation request not found'
            }));
            return;
          }
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000); // Poll every 5 seconds
        } else {
          setGenerationProgress(prev => ({
            ...prev,
            status: 'error',
            message: 'Generation timeout - please try again'
          }));
        }
      } catch (error) {
        console.error('Status polling error:', error);
        // On network errors, try a few times before giving up
        setGenerationProgress(prev => ({
          ...prev,
          message: 'Checking status...'
        }));
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000);
        } else {
          setGenerationProgress(prev => ({
            ...prev,
            status: 'error',
            message: 'Connection lost - please check if the backend is running and try again'
          }));
        }
      }
    };

    poll();
  };

  // Handle completed generation
  const handleCompletedGeneration = async (requestId: string) => {
    try {
      // Fetch the generated files
      const filesResponse = await fetch('/api/files');
      if (filesResponse.ok) {
        const filesData = await filesResponse.json();
        
        // Create project from generated files
        const newProject = await createProjectFromFiles(filesData.files);
        setGeneratedProjects(prev => [newProject, ...prev]);
        setProjectName('');
        setProjectDescription('');
        
        setGenerationProgress({
          requestId: null,
          status: 'idle',
          message: '',
          progress: 0
        });
      }
    } catch (error) {
      console.error('Error handling completed generation:', error);
      setGenerationProgress(prev => ({
        ...prev,
        status: 'error',
        message: 'Failed to retrieve generated files'
      }));
    }
  };

  // Create project object from backend files
  const createProjectFromFiles = async (files: any[]) => {
    let html = '', css = '', js = '';
    
    for (const file of files) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000'}/api/file/${file.path}`);
        if (response.ok) {
          const fileData = await response.json();
          
          if (file.name.endsWith('.html')) {
            html = fileData.content;
          } else if (file.name.endsWith('.css')) {
            css = fileData.content;
          } else if (file.name.endsWith('.js')) {
            js = fileData.content;
          }
        }
      } catch (error) {
        console.error(`Error fetching file ${file.path}:`, error);
      }
    }

    return {
      id: Date.now().toString(),
      name: projectName,
      description: projectDescription,
      html,
      css,
      js,
      createdAt: new Date().toISOString(),
      status: 'completed'
    };
  };

  const handleGenerate = async () => {
    if (!projectName.trim() || !projectDescription.trim()) {
      alert('Please fill in both project name and description');
      return;
    }

    setGenerationProgress({
      requestId: null,
      status: 'processing',
      message: 'Initializing AI project generation...',
      progress: 10
    });
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectName,
          description: projectDescription,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.request_id) {
          // Backend is available - start polling
          setGenerationProgress(prev => ({
            ...prev,
            requestId: data.request_id,
            message: 'AI is analyzing your requirements...',
            progress: 20
          }));
          
          pollStatus(data.request_id);
        } else {
          // Handle mock response (when backend unavailable)
          const newProject = data;
          setGeneratedProjects(prev => [newProject, ...prev]);
          setProjectName('');
          setProjectDescription('');
          setGenerationProgress({
            requestId: null,
            status: 'idle',
            message: '',
            progress: 0
          });
        }
      } else {
        throw new Error('Failed to start generation');
      }
    } catch (error) {
      console.error('Error generating project:', error);
      setGenerationProgress({
        requestId: null,
        status: 'error',
        message: 'Failed to start generation - please try again',
        progress: 0
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">Project Generator Dashboard</h1>
          <p className="text-xl text-center text-muted-foreground">Create stunning websites with AI in seconds</p>
        </div>

        <Tabs defaultValue="generate" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Generate New Project
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              My Projects ({generatedProjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Generate New Project
                </CardTitle>
                <CardDescription>
                  Describe your project and let AI create it for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    placeholder="e.g., Personal Portfolio, Landing Page, Todo App"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    disabled={generationProgress.status === 'processing'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Project Description</Label>
                  <Textarea
                    id="projectDescription"
                    placeholder="Describe what you want your project to look like and what features it should have..."
                    rows={4}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    disabled={generationProgress.status === 'processing'}
                  />
                </div>
                <Button 
                  onClick={handleGenerate} 
                  disabled={generationProgress.status === 'processing'}
                  className="w-full"
                  size="lg"
                >
                  {generationProgress.status === 'processing' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {generationProgress.message}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Project
                    </>
                  )}
                </Button>
                
                {generationProgress.status === 'processing' && (
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out relative" 
                          style={{ width: `${generationProgress.progress}%` }}
                        >
                          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>0%</span>
                        <span className="font-medium">{generationProgress.progress}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm font-medium">{generationProgress.message}</p>
                    </div>
                  </div>
                )}
                
                {generationProgress.status === 'error' && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                    <XCircle className="h-4 w-4" />
                    <p className="text-sm">{generationProgress.message}</p>
                  </div>
                )}
                
                {generationProgress.status === 'completed' && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <p className="text-sm">Project generated successfully!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {generatedProjects.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Code className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                  <p className="text-muted-foreground">Generate your first project to get started!</p>
                </div>
              ) : (
                generatedProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedProject(project)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh]">
                            <DialogHeader>
                              <DialogTitle>{project.name}</DialogTitle>
                              <DialogDescription>{project.description}</DialogDescription>
                            </DialogHeader>
                            <ProjectPreview project={project} />
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Created {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}