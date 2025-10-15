# Start Backend Server
Write-Host "🚀 Starting Agentic AI Backend..." -ForegroundColor Cyan
Write-Host ""

# Check if virtual environment exists
if (Test-Path "D:/agentic_ai/.venv/Scripts/Activate.ps1") {
    Write-Host "Activating virtual environment..." -ForegroundColor Green
    & "venv\Scripts\Activate.ps1"
}

# Check if flask-cors is installed
$flaskCorsInstalled = pip list | Select-String "flask-cors"
if (-not $flaskCorsInstalled) {
    Write-Host "Installing flask-cors..." -ForegroundColor Yellow
    pip install flask-cors
}

Write-Host ""
Write-Host "Starting Flask server on http://localhost:5000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

python app.py
