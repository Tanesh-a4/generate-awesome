'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Download, Eye } from "lucide-react";

interface GeneratedProject {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
  js: string;
  createdAt: string;
}

interface ProjectPreviewProps {
  project: GeneratedProject;
}

export default function ProjectPreview({ project }: ProjectPreviewProps) {
  const [activeTab, setActiveTab] = useState('preview');

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
    console.log(`${type} copied to clipboard`);
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadProject = () => {
    const bodyContent = extractBodyContent(project.html);
    // Create HTML file with embedded CSS and JS for easy download
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.name}</title>
    <style>
${project.css}
    </style>
</head>
<body>
${bodyContent}
    <script>
${project.js}
    </script>
</body>
</html>`;

    downloadFile(fullHtml, `${project.name.toLowerCase().replace(/\s+/g, '-')}.html`);
  };

  const extractBodyContent = (html: string) => {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return bodyMatch ? bodyMatch[1] : html;
  };

  // Create a blob URL for the iframe source
  const createPreviewUrl = () => {
    const bodyContent = extractBodyContent(project.html);
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.name}</title>
    <style>
${project.css}
    </style>
</head>
<body>
${bodyContent}
    <script>
${project.js}
    </script>
</body>
</html>`;
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    return URL.createObjectURL(blob);
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="js">JavaScript</TabsTrigger>
          </TabsList>
          <Button onClick={downloadProject} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Project
          </Button>
        </div>

        <TabsContent value="preview" className="space-y-0">
          <div className="border rounded-lg overflow-hidden">
            <iframe
              src={createPreviewUrl()}
              className="w-full h-96"
              title={`Preview of ${project.name}`}
              sandbox="allow-scripts"
            />
          </div>
        </TabsContent>

        <TabsContent value="html" className="space-y-0">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 z-10"
              onClick={() => copyToClipboard(project.html, 'HTML')}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{project.html}</code>
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="css" className="space-y-0">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 z-10"
              onClick={() => copyToClipboard(project.css, 'CSS')}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{project.css}</code>
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="js" className="space-y-0">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 z-10"
              onClick={() => copyToClipboard(project.js, 'JavaScript')}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{project.js}</code>
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}