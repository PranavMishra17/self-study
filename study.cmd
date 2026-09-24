@echo off
rem Double-click this instead of index.html.
rem
rem Progress is stored by the browser against the exact address the page was
rem opened from. Opening index.html directly gives it a file:// address, which
rem is a different store from http://localhost:8000 and will look empty. This
rem always uses the same address, so the progress is always the same progress.

cd /d "%~dp0"

rem Start the server only if nothing is already listening on 8000.
netstat -ano | findstr /r /c:"TCP.*:8000 .*LISTENING" >nul 2>&1
if errorlevel 1 (
  start "self-study server" /min cmd /c "python -m http.server 8000 --bind 127.0.0.1"
  rem give it a moment to bind before the browser asks for the page
  ping -n 2 127.0.0.1 >nul
)

start "" "http://localhost:8000/index.html"
