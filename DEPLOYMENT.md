# Deployment Guide: Agentic AI Project Planner

## Overview
This guide covers deploying your AI project planner using:
- **Vercel** for the frontend (static files)
- **Render** for the Flask backend API

## Prerequisites
1. GitHub account
2. Vercel account (free tier available)
3. Render account (free tier available)
4. Groq API key

## 🚀 Deployment Steps

### Part 1: Prepare Your Repository

1. **Create a GitHub repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/agentic-ai.git
   git push -u origin main
   ```

2. **Update .gitignore**
   ```
   # Python-generated files
   __pycache__/
   *.py[oc]
   build/
   dist/
   wheels/
   *.egg-info
   
   # Virtual environments
   .venv
   
   # Environment variables
   .env
   
   # Generated projects
   generated_project/
   ```

### Part 2: Deploy Backend on Render

1. **Go to Render Dashboard**
   - Visit https://render.com
   - Sign up/login with GitHub

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select your `agentic-ai` repository

3. **Configure Service Settings**
   ```
   Name: agentic-ai-backend
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: python app.py
   ```

4. **Set Environment Variables**
   - In Render dashboard, go to "Environment"
   - Add these variables:
     ```
     GROQ_API_KEY=your_actual_groq_api_key
     FLASK_ENV=production
     PORT=5000
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL: `https://your-app-name.onrender.com`

### Part 3: Deploy Frontend on Vercel

1. **Update vercel.json**
   Replace `your-render-app.onrender.com` with your actual Render URL:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "static/**",
         "use": "@vercel/static"
       }
     ],
     "routes": [
       {
         "src": "/static/(.*)",
         "dest": "/static/$1"
       },
       {
         "src": "/api/(.*)",
         "dest": "https://YOUR-ACTUAL-RENDER-URL.onrender.com/api/$1"
       },
       {
         "src": "/(.*)",
         "dest": "/templates/index.html"
       }
     ]
   }
   ```

2. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Sign up/login with GitHub

3. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Select root directory

4. **Configure Project**
   ```
   Framework Preset: Other
   Build Command: (leave empty)
   Output Directory: (leave empty)
   Install Command: (leave empty)
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)
   - Your frontend will be live at: `https://your-project.vercel.app`

### Part 4: Update Frontend API Calls

You need to update your frontend to call the Render backend:

1. **Update script.js**
   Find the API calls and update the base URL:
   ```javascript
   // Replace localhost calls with your Render URL
   const API_BASE_URL = 'https://your-render-app.onrender.com';
   
   // Update fetch calls
   const response = await fetch(`${API_BASE_URL}/api/generate`, {
     // ... rest of the code
   });
   ```

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit API keys to GitHub
   - Use .env.example as a template
   - Set environment variables in deployment platforms

2. **CORS Configuration**
   Add CORS support to your Flask app:
   ```python
   from flask_cors import CORS
   
   app = Flask(__name__)
   CORS(app, origins=['https://your-vercel-domain.vercel.app'])
   ```

3. **API Rate Limiting**
   Consider adding rate limiting for production use.

## 📁 Folder Organization for Deployment

```
your-project/
├── app.py                 # Flask backend (deploy to Render)
├── requirements.txt       # Python dependencies
├── render.yaml           # Render configuration
├── vercel.json           # Vercel configuration
├── .env.example          # Environment template
├── static/               # Frontend assets (deploy to Vercel)
│   ├── script.js
│   └── style.css
├── templates/            # HTML templates (deploy to Vercel)
│   └── index.html
└── agent/               # AI agent code (deploy to Render)
    ├── graph.py
    ├── prompts.py
    ├── states.py
    └── tools.py
```

## 🔧 Troubleshooting

### Common Issues:

1. **Backend not starting on Render**
   - Check build logs for dependency errors
   - Verify `requirements.txt` has all dependencies
   - Ensure `PORT` environment variable is set

2. **Frontend can't reach backend**
   - Verify Render URL in `vercel.json`
   - Check CORS configuration
   - Test backend endpoints directly

3. **Groq API errors**
   - Verify `GROQ_API_KEY` is set correctly
   - Check API key has sufficient credits
   - Test API key with curl/Postman

4. **Render free tier limitations**
   - Service spins down after 15 minutes of inactivity
   - First request after sleep may take 1-2 minutes
   - Consider upgrading for production use

## 🚀 Going Live

1. **Custom Domain (Optional)**
   - Configure custom domain in Vercel
   - Update CORS settings accordingly

2. **Monitoring**
   - Use Render and Vercel dashboards for logs
   - Set up error tracking (Sentry, etc.)

3. **Scaling**
   - Monitor usage and upgrade plans as needed
   - Consider adding Redis for job storage

## 💡 Tips

- **Development**: Keep running locally with `python app.py`
- **Testing**: Test backend API endpoints before frontend deployment
- **Updates**: Push to GitHub to auto-deploy on both platforms
- **Logs**: Check deployment logs if something breaks

Your app will be accessible at:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-render-app.onrender.com`

## 🎯 Next Steps

1. Deploy backend to Render first
2. Note the Render URL
3. Update `vercel.json` with correct backend URL
4. Deploy frontend to Vercel
5. Test the complete application