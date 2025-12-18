#!/bin/bash

# Script para corrigir CORS no servidor de produção
SERVER="ziguealuga-api@82.180.136.126"
BACKEND_DIR="~/htdocs/backend"

echo "🔧 Corrigindo CORS no servidor de produção..."
echo ""

# Conectar e executar comandos
ssh $SERVER << 'ENDSSH'
cd ~/htdocs/backend

# Fazer backup do .env atual
cp .env .env.backup-$(date +%Y%m%d-%H%M%S)

# Verificar se CORS_ORIGIN existe
if grep -q "CORS_ORIGIN" .env; then
    echo "✅ CORS_ORIGIN encontrado no .env"
    echo "Valor atual:"
    grep "CORS_ORIGIN" .env
    echo ""

    # Atualizar valor
    sed -i 's|^CORS_ORIGIN=.*|CORS_ORIGIN=https://ziguealuga.com,https://www.ziguealuga.com,https://api.ziguealuga.com|' .env
    echo "✅ CORS_ORIGIN atualizado!"
else
    echo "⚠️ CORS_ORIGIN não encontrado, adicionando..."
    echo "" >> .env
    echo "# CORS - Origens permitidas" >> .env
    echo "CORS_ORIGIN=https://ziguealuga.com,https://www.ziguealuga.com,https://api.ziguealuga.com" >> .env
    echo "✅ CORS_ORIGIN adicionado!"
fi

echo ""
echo "Novo valor:"
grep "CORS_ORIGIN" .env
echo ""

# Verificar se NODE_ENV está em production
if grep -q "NODE_ENV=production" .env; then
    echo "✅ NODE_ENV está em production"
else
    echo "⚠️ NODE_ENV não está em production, corrigindo..."
    if grep -q "NODE_ENV=" .env; then
        sed -i 's|^NODE_ENV=.*|NODE_ENV=production|' .env
    else
        echo "NODE_ENV=production" >> .env
    fi
fi

echo ""
echo "🔄 Reiniciando backend..."
pm2 restart backend

echo ""
echo "⏳ Aguardando 3 segundos..."
sleep 3

echo ""
echo "📊 Status do PM2:"
pm2 status

echo ""
echo "📝 Últimas 20 linhas do log:"
pm2 logs backend --lines 20 --nostream

echo ""
echo "🧪 Testando endpoint de health:"
curl -I https://api.ziguealuga.com/health

ENDSSH

echo ""
echo "✅ Processo concluído!"
echo ""
echo "🌐 Teste o frontend agora em: https://ziguealuga.com"
