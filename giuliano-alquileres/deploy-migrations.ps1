# Script PowerShell para deploy de migrations

Write-Host "📦 Enviando migrations para o servidor..." -ForegroundColor Cyan

# Enviar arquivos de migration
scp "backend/migrations/20251217000001-add-completed-at-to-bookings.js" ziguealuga-api@82.180.136.126:~/htdocs/backend/migrations/
scp "backend/migrations/20251217000002-create-dynamic-pricing.js" ziguealuga-api@82.180.136.126:~/htdocs/backend/migrations/
scp "backend/migrations/20251217000003-add-avatar-to-users.js" ziguealuga-api@82.180.136.126:~/htdocs/backend/migrations/
scp "backend/migrations/20251217000004-create-guest-reviews.js" ziguealuga-api@82.180.136.126:~/htdocs/backend/migrations/

Write-Host ""
Write-Host "✅ Migrations enviadas!" -ForegroundColor Green
Write-Host ""
Write-Host "🔄 Executando migrations no servidor..." -ForegroundColor Cyan

# Conectar e rodar migrations
$commands = @"
cd ~/htdocs/backend
echo '📋 Migrations pendentes:'
npx sequelize-cli db:migrate:status
echo ''
echo '🚀 Rodando migrations...'
npx sequelize-cli db:migrate
echo ''
echo '✅ Migrations concluídas!'
echo ''
echo '🔄 Reiniciando backend...'
pm2 restart backend
echo '✅ Deploy completo!'
"@

ssh ziguealuga-api@82.180.136.126 $commands
