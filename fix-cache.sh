#!/bin/bash
# Script para corrigir cache e atualizar frontend

echo "========================================="
echo "  Diagnóstico e Correção do Frontend"
echo "========================================="
echo ""

# 1. Verificar configuração do nginx
echo "[1/5] Verificando configuração do nginx..."
echo ""
nginx_config=$(sudo grep -r "ziguealuga.com" /etc/nginx/sites-enabled/ 2>/dev/null | grep "root" | head -1)
echo "Configuração encontrada:"
echo "$nginx_config"
echo ""

# 2. Verificar qual pasta tem os arquivos mais recentes
echo "[2/5] Verificando arquivos em ~/htdocs..."
ls -lh ~/htdocs/*.html 2>/dev/null || echo "Sem arquivos em ~/htdocs"
echo ""

echo "[3/5] Verificando arquivos em /var/www/ziguealuga/frontend/dist..."
ls -lh /var/www/ziguealuga/frontend/dist/*.html 2>/dev/null || echo "Sem arquivos em /var/www"
echo ""

# 3. Verificar conteúdo do index.html
echo "[4/5] Verificando qual versão do JS está no index.html..."
grep -o 'src="/assets/index-[^"]*\.js"' ~/htdocs/index.html 2>/dev/null
grep -o 'src="/assets/index-[^"]*\.js"' /var/www/ziguealuga/frontend/dist/index.html 2>/dev/null
echo ""

# 4. Limpar cache do nginx
echo "[5/5] Limpando cache do nginx..."
if [ -d "/var/cache/nginx" ]; then
    sudo rm -rf /var/cache/nginx/*
    echo "✓ Cache do nginx limpo"
else
    echo "ℹ Sem cache nginx para limpar"
fi

# Recarregar nginx
sudo nginx -t && sudo systemctl reload nginx
echo "✓ Nginx recarregado"
echo ""

echo "========================================="
echo "  Diagnóstico concluído!"
echo "========================================="
echo ""
echo "Agora teste no navegador (CTRL+SHIFT+R para forçar atualização)"
