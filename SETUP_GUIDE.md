# 🚀 Quick Setup Guide - Agentic AI Project Generator

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm (comes with Node.js)
- Git (optional)

## Step-by-Step Setup

### 1️⃣ Backend Setup

1. **Install Python Dependencies**

   ```powershell
   pip install -r requirements.txt
   ```
2. **Set Up Environment Variables**
   Create a `.env` file in the root directory with:

   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

   Get your API key from: https://console.groq.com/
3. **Verify Installation**

   ```powershell
   python -c "import flask, flask_cors; print('Backend dependencies OK!')"
   ```

### 2️⃣ Frontend Setup

1. **Navigate to Frontend Directory**

   ```powershell
   cd frontend
   ```
2. **Install Node Dependencies**

   ```powershell
   npm install
   ```

   This will install:

   - React 18
   - TypeScript
   - Monaco Editor
   - Axios
   - Lucide React icons
3. **Verify Installation**

   ```powershell
   npm list --depth=0
   ```

### 3️⃣ Running the Application

#### Option A: Use PowerShell Scripts (Easiest!)

**Start everything at once:**

```powershell
.\start-all.ps1
```

**Or start individually:**

```powershell
# Terminal 1 - Backend
.\start-backend.ps1

# Terminal 2 - Frontend
.\start-frontend.ps1
```

#### Option B: Manual Start

**Terminal 1 - Backend:**

```powershell
python app.py
```

Server starts at http://localhost:5000

**Terminal 2 - Frontend:**

```powershell
cd frontend
npm start
```

App opens at http://localhost:3000

## 🎯 First Time Usage

1. **Open your browser** to http://localhost:3000
2. **Enter a prompt** in the text area, for example:

   ```
   Build a colorful modern todo app in HTML, CSS, and JS
   ```
3. **Click "Generate Project"** and wait for the AI to create your files
4. **Browse files** in the file explorer on the left
5. **Click any file** to view and edit it
6. **Make changes** and click "Save" to update
7. **Preview HTML files** by clicking the "Preview" button

## 📁 Project Structure

```
agentic_ai/
├── agent/                    # AI agent logic
│   ├── generated_project/   # Generated files appear here
│   ├── graph.py
│   ├── prompts.py
│   ├── states.py
│   └── tools.py
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── App.tsx
│   │   └── types.ts
│   └── package.json
├── app.py                   # Flask API server
├── main.py                  # CLI interface (alternative)
├── requirements.txt         # Python dependencies
├── start-all.ps1           # Start both servers
├── start-backend.ps1       # Start backend only
└── start-frontend.ps1      # Start frontend only
```

## ✅ Verification Checklist

Before using the app, verify:

- [X] Python 3.8+ installed: `python --version`
- [X] Node.js 16+ installed: `node --version`
- [X] Python packages installed: `pip list | Select-String flask`
- [X] GROQ_API_KEY set in `.env` file
- [X] Frontend dependencies installed: `ls frontend/node_modules`
- [X] Backend runs without errors: `python app.py` (Ctrl+C to stop)
- [X] Frontend builds: `cd frontend; npm start` (Ctrl+C to stop)

## 🐛 Common Issues & Solutions

### Issue: "Module 'flask_cors' not found"

**Solution:**

```powershell
pip install flask-cors
```

### Issue: "Port 5000 already in use"

**Solution:**
Edit `app.py`, change:

```python
app.run(debug=True, port=5000)
```

to:

```python
app.run(debug=True, port=5001)
```

Then update `API_BASE_URL` in frontend components.

### Issue: "CORS error in browser console"

**Solution:**

1. Verify backend is running
2. Check that `flask-cors` is installed
3. Clear browser cache

### Issue: "npm install fails"

**Solution:**

```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Issue: "No files generated"

**Solution:**

1. Check if `agent/generated_project/` exists
2. Verify GROQ_API_KEY is valid
3. Check backend console for errors

### Issue: "React app won't start"

**Solution:**

```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .cache
npm cache clean --force
npm install
npm start
```

## 🎨 Customization

### Change Color Scheme

Edit `frontend/src/App.css`:

```css
background: linear-gradient(135deg, #your-color-1, #your-color-2);
```

### Change Editor Theme

Edit `frontend/src/components/ProjectViewer.tsx`:

```typescript
theme="vs-dark"  // or "vs-light", "hc-black"
```

### Add More File Types

Edit the `getLanguageFromFilename` function in `ProjectViewer.tsx`

## 📚 Next Steps

1. **Try different prompts:**

   - "Create a portfolio website with dark mode"
   - "Build a calculator app with modern UI"
   - "Make a weather dashboard with charts"
2. **Explore editing:**

   - Modify colors in CSS files
   - Change text content
   - Add new features
3. **Experiment with the agent:**

   - Check `agent/prompts.py` to see how prompts work
   - Review `agent/graph.py` to understand the workflow

## 💡 Tips

- Use specific, detailed prompts for better results
- The AI works best with web technologies (HTML, CSS, JS)
- You can ask for specific libraries or frameworks
- Save your work frequently when editing
- Preview HTML files to see your changes live

## 🆘 Need Help?

- Check the logs in both terminal windows
- Review the browser console (F12) for frontend errors
- Ensure both servers are running simultaneously
- Verify your `.env` file has a valid API key

## 🎉 You're Ready!

Run `.\start-all.ps1` and start creating amazing projects with AI!

Happy Coding! 🚀
