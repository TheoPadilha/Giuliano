#!/bin/bash

# Script de diagnóstico do servidor de produção
SERVER="ziguealuga-api@82.180.136.126"

echo "🔍 Diagnóstico do servidor de produção"
echo "======================================"
echo ""

ssh $SERVER << 'ENDSSH'
echo "📂 Estrutura de diretórios:"
ls -la ~/htdocs/
echo ""

echo "📊 Status do PM2:"
pm2 status
echo ""

echo "🌐 Backend está rodando?"
cd ~/htdocs/backend
if [ -f "server.js" ]; then
    echo "✅ server.js encontrado"
else
    echo "❌ server.js NÃO encontrado!"
fi
echo ""

echo "🔧 Variáveis de ambiente relevantes:"
echo "CORS_ORIGIN:"
grep "CORS_ORIGIN" .env || echo "❌ CORS_ORIGIN não encontrado!"
echo ""
echo "NODE_ENV:"
grep "NODE_ENV" .env || echo "❌ NODE_ENV não encontrado!"
echo ""
echo "PORT:"
grep "^PORT=" .env || echo "❌ PORT não encontrado!"
echo ""
echo "BACKEND_URL:"
grep "BACKEND_URL" .env || echo "❌ BACKEND_URL não encontrado!"
echo ""

echo "📝 Últimas 30 linhas do log do backend:"
pm2 logs backend --lines 30 --nostream
echo ""

echo "🧪 Testando endpoints:"
echo "Health check:"
curl -sI https://api.ziguealuga.com/health | head -5
echo ""

echo "Featured properties (com CORS):"
curl -sI https://api.ziguealuga.com/api/properties/featured | head -10
echo ""

echo "🔥 Portas em uso:"
netstat -tlnp 2>/dev/null | grep -E ':(3001|5000|80|443)' || ss -tlnp | grep -E ':(3001|5000|80|443)'
echo ""

ENDSSH

echo ""
echo "✅ Diagnóstico concluído!"
