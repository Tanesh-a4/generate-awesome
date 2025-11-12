# Frontend startup script
Write-Host "Starting Generate Awesome Frontend..." -ForegroundColor Green

# Check if pnpm is installed
if (!(Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "pnpm not found. Installing pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
}

# Navigate to frontend directory
Set-Location "$PSScriptRoot\frontend"

# Install dependencies if node_modules doesn't exist
if (!(Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    pnpm install
}

# Start the development server
Write-Host "Starting development server on http://localhost:3000" -ForegroundColor Green
pnpm run dev