# KalaGanaka One-Click PowerShell Launcher
Write-Host "========================================================" -ForegroundColor Yellow
Write-Host " Starting KalaGanaka - Indian Astronomy & Timekeeping Lab" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. Starting FastAPI Astronomical Backend on port 8000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn app.main:app --port 8000 --app-dir backend --reload"

Write-Host "2. Starting Vite Frontend on port 5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location frontend; npm run dev"

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Opening http://localhost:5173 in browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

