# Generate Awesome - Start All Services
Write-Host "Starting Generate Awesome Application..." -ForegroundColor Green
Write-Host "This will start both the backend (Python) and frontend (Next.js) services" -ForegroundColor Yellow

# Function to start backend in new window
function Start-Backend {
    Write-Host "Starting Backend Server..." -ForegroundColor Blue
    Start-Process powershell -ArgumentList "-File", "$PSScriptRoot\start-backend.ps1"
}

# Function to start frontend in new window
function Start-Frontend {
    Write-Host "Starting Frontend Server..." -ForegroundColor Blue
    Start-Process powershell -ArgumentList "-File", "$PSScriptRoot\start-frontend.ps1"
}

# Start services
Write-Host "`nStarting services in separate windows..." -ForegroundColor Yellow
Start-Backend
Start-Sleep -Seconds 3
Start-Frontend

Write-Host "`nServices are starting up!" -ForegroundColor Green
Write-Host "Backend will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`nPress any key to exit this window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')