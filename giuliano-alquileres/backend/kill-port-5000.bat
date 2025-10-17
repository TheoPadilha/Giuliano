@echo off
echo ========================================
echo   Limpando porta 5000
echo ========================================
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Encerrando processo PID %%a...
    taskkill /PID %%a /F 2>nul
    if errorlevel 1 (
        echo Erro ao encerrar processo %%a
    ) else (
        echo Processo %%a encerrado com sucesso!
    )
)

echo.
echo ========================================
echo   Porta 5000 liberada!
echo ========================================
echo.
pause
