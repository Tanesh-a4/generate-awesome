export interface FileData {
  name: string;
  path: string;
  fullPath: string;
  content?: string;
}

export interface GenerationStatus {
  status: 'processing' | 'completed' | 'error';
  message: string;
  result?: any;
  error?: string;
}
