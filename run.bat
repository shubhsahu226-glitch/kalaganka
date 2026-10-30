@echo off
echo ========================================================
echo  Starting KalaGanaka - Indian Astronomy & Timekeeping Lab
echo ========================================================
echo.
echo 1. Starting FastAPI Astronomical Backend on port 8000...
start "KalaGanaka Backend" cmd /k "python -m uvicorn app.main:app --port 8000 --app-dir backend --reload"

echo 2. Starting Vite Frontend on port 5173...
start "KalaGanaka Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Waiting for servers to initialize...
timeout /t 3 /nobreak > nul

echo.
echo Opening KalaGanaka in your browser...
start http://localhost:5173

echo.
echo KalaGanaka is running! Keep the backend and frontend terminal windows open.
pause

