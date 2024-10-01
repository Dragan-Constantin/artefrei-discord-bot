@echo off
:loop
echo Starting the Node.js app...
npm start
if %ERRORLEVEL% == 0 (
    echo The Node.js app exited with code 0, restarting...
    goto loop
) else (
    echo The Node.js app exited with a non-zero exit code (%ERRORLEVEL%). Stopping.
    pause
)