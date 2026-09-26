@echo off
setlocal
cd /d "%~dp0"
where python >nul 2>nul
if errorlevel 1 (
  echo Python 3 is required. Install it from https://www.python.org/downloads/
  pause
  exit /b 1
)
echo.
echo Starting FileFlow...
echo Open: http://127.0.0.1:5500
start "FileFlow" http://127.0.0.1:5500
python server.py
pause
