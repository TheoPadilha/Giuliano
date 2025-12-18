#!/bin/bash

echo "📦 Enviando migrations para o servidor..."

# Enviar arquivos de migration
scp backend/migrations/20251217000001-add-completed-at-to-bookings.js ziguealuga-api@82.180.136.126:~/htdocs/backend/migrations/
scp backend/migrations/20251217000002-create-dynamic-pricing.js ziguealuga-api@82.180.136.126:~/htdocs/backend/migrations/
scp backend/migrations/20251217000003-add-avatar-to-users.js ziguealuga-api@82.180.136.126:~/htdocs/backend/migrations/
scp backend/migrations/20251217000004-create-guest-reviews.js ziguealuga-api@82.180.136.126:~/htdocs/backend/migrations/

echo ""
echo "✅ Migrations enviadas!"
echo ""
echo "🔄 Executando migrations no servidor..."

# Conectar e rodar migrations
ssh ziguealuga-api@82.180.136.126 << 'ENDSSH'
cd ~/htdocs/backend
echo "📋 Migrations pendentes:"
npx sequelize-cli db:migrate:status
echo ""
echo "🚀 Rodando migrations..."
npx sequelize-cli db:migrate
echo ""
echo "✅ Migrations concluídas!"
echo ""
echo "🔄 Reiniciando backend..."
pm2 restart backend
echo "✅ Deploy completo!"
ENDSSH
