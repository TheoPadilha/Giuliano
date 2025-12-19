@echo off
echo ========================================
echo    Deploy Frontend - Zigué Aluga
echo ========================================
echo.

cd frontend\dist

echo [1/3] Compactando arquivos...
tar -czf ..\frontend-dist.tar.gz *

cd ..

echo [2/3] Enviando para servidor...
scp frontend-dist.tar.gz ziguealuga-api@82.180.136.126:~/

echo [3/3] Extraindo no servidor...
ssh ziguealuga-api@82.180.136.126 "cd ~/htdocs && tar -xzf ~/frontend-dist.tar.gz && rm ~/frontend-dist.tar.gz && echo 'Deploy concluido!' && ls -la index.html"

echo.
echo ========================================
echo    Deploy Concluido!
echo ========================================
pause
