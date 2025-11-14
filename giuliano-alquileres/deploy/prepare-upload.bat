@echo off
REM ============================================
REM Script para preparar arquivos para upload
REM Execute este script no Windows antes de enviar para a VPS
REM ============================================

echo.
echo ======================================
echo   Preparando arquivos para VPS
echo ======================================
echo.

REM Ir para o diretório do projeto
cd /d "%~dp0\.."

REM Verificar se 7-Zip está instalado
where 7z >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] 7-Zip nao encontrado!
    echo.
    echo Por favor, comprima manualmente as pastas:
    echo   - backend
    echo   - frontend
    echo   - deploy
    echo.
    echo Em um arquivo chamado: ziguealuga.zip
    pause
    exit /b 1
)

echo [1/3] Comprimindo arquivos...
7z a -tzip ziguealuga.zip backend frontend deploy -xr!node_modules -xr!.git -xr!dist

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] Arquivo criado: ziguealuga.zip
    echo.
    echo ======================================
    echo   Proximos passos:
    echo ======================================
    echo.
    echo 1. Envie o arquivo ziguealuga.zip para a VPS usando SFTP/SCP
    echo    Exemplo com WinSCP ou FileZilla
    echo.
    echo 2. Ou use este comando SCP no PowerShell/CMD:
    echo    scp ziguealuga.zip usuario@IP_DA_VPS:/tmp/
    echo.
    echo 3. Conecte via SSH na VPS e siga as instrucoes do README.md
    echo.
) else (
    echo.
    echo [ERRO] Falha ao comprimir arquivos!
    echo Tente comprimir manualmente.
    echo.
)

pause
