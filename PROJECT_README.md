# Agentic AI Project Generator

An intelligent AI-powered project generator that creates complete web projects from natural language descriptions.

## Quick Start

### Backend Setup

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up your environment variables in `.env`:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. Run the Flask backend:
   ```bash
   python app.py
   ```
   Backend runs on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React app:
   ```bash
   npm start
   ```
   Frontend opens at http://localhost:3000

## What's New

### 🎨 Modern React Frontend
- Clean, intuitive UI with gradient design
- Real-time project generation status
- Integrated Monaco code editor (VS Code editor)
- File explorer with folder navigation
- Live file editing with change detection
- Download and preview capabilities

### 🔧 Backend API
- RESTful Flask API
- Asynchronous project generation
- Status polling for long-running operations
- File management (read, write, delete)
- CORS enabled for frontend communication

## Architecture

```
agentic_ai/
├── agent/                      # AI agent logic
│   ├── graph.py               # LangGraph workflow
│   ├── prompts.py             # AI prompts
│   ├── states.py              # State definitions
│   ├── tools.py               # Agent tools
│   └── generated_project/     # Output directory
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── App.tsx           # Main app
│   │   └── types.ts          # TypeScript types
│   └── package.json
├── app.py                     # Flask backend API
├── main.py                    # CLI interface
└── requirements.txt
```

## Features

### AI Agent
- **Planner Agent**: Breaks down project requirements
- **Architect Agent**: Creates implementation plan
- **Coder Agent**: Generates actual code files

### Frontend
- **Prompt Input**: Natural language project description
- **Real-time Status**: Generation progress tracking
- **File Explorer**: Tree view of generated files
- **Code Editor**: Monaco editor with syntax highlighting
- **Edit & Save**: Modify generated files
- **Download**: Export individual files
- **Preview**: View HTML files in browser

## API Endpoints

- `POST /api/generate` - Start project generation
- `GET /api/status/:requestId` - Check generation status
- `GET /api/files` - List all generated files
- `GET /api/file/:filepath` - Get file content
- `PUT /api/file/:filepath` - Update file content
- `DELETE /api/file/:filepath` - Delete a file
- `GET /api/preview/:filepath` - Preview a file

## Usage Examples

### Via Web Interface
1. Open http://localhost:3000
2. Enter: "Build a modern landing page for a tech startup"
3. Click "Generate Project"
4. Edit files in the browser
5. Download or preview results

### Via CLI
```bash
python main.py
# Enter your prompt when asked
```

## Technologies

**Backend:**
- Flask - Web framework
- LangChain - LLM orchestration
- LangGraph - Agent workflow
- Groq - LLM provider

**Frontend:**
- React 18 - UI framework
- TypeScript - Type safety
- Monaco Editor - Code editing
- Axios - HTTP client
- Lucide React - Icons

## Environment Variables

Create a `.env` file:
```
GROQ_API_KEY=your_api_key_here
```

## Development

### Backend
```bash
python app.py  # Run in debug mode
```

### Frontend
```bash
cd frontend
npm start      # Development server with hot reload
npm run build  # Production build
```

## Troubleshooting

**Backend won't start:**
- Check if port 5000 is available
- Verify GROQ_API_KEY is set in .env
- Ensure all dependencies are installed

**Frontend can't connect:**
- Verify backend is running on port 5000
- Check browser console for CORS errors
- Ensure proxy is configured in package.json

**No files generated:**
- Check agent/generated_project/ directory
- Review backend console for agent errors
- Verify API key is valid

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
