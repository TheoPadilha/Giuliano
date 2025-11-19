#!/bin/bash
# ============================================
# Script de Deploy com RSYNC (muito mais rápido!)
# Execute no Git Bash ou WSL
# ============================================

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "========================================"
echo "   Deploy com RSYNC - Zigué Aluga"
echo "========================================"
echo ""

# Configurações do servidor (EDITE AQUI!)
SERVER_USER="ziguealuga-api"
SERVER_HOST="82.180.136.126"
SERVER_PATH="~/htdocs"

# Perguntar confirmação
echo -e "${YELLOW}Servidor:${NC} $SERVER_USER@$SERVER_HOST:$SERVER_PATH"
echo ""
read -p "Continuar com o deploy? (s/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Ss]$ ]]
then
    echo "Deploy cancelado."
    exit 1
fi

echo ""
echo "========================================"
echo "   [1/3] Fazendo backup do .env"
echo "========================================"
echo ""

# Fazer backup do .env em produção
ssh $SERVER_USER@$SERVER_HOST "cd $SERVER_PATH/backend && cp .env .env.backup-\$(date +%Y%m%d-%H%M%S) 2>/dev/null || echo 'Sem .env para backup'"

echo ""
echo "========================================"
echo "   [2/3] Sincronizando BACKEND"
echo "========================================"
echo ""

# Sync Backend (exclui node_modules, .env, uploads)
rsync -avz --delete \
  --exclude 'node_modules/' \
  --exclude '.env' \
  --exclude '.env.*' \
  --exclude 'uploads/' \
  --exclude '*.log' \
  --exclude '.git/' \
  ../backend/ $SERVER_USER@$SERVER_HOST:$SERVER_PATH/backend/

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend sincronizado com sucesso!${NC}"
else
    echo -e "${RED}✗ Erro ao sincronizar backend!${NC}"
    exit 1
fi

echo ""
echo "========================================"
echo "   [3/3] Sincronizando FRONTEND"
echo "========================================"
echo ""

# Primeiro fazer build do frontend localmente
echo "Fazendo build do frontend..."
cd ../frontend
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Erro ao fazer build do frontend!${NC}"
    exit 1
fi

# Sync Frontend (apenas dist/)
rsync -avz --delete \
  ./dist/ $SERVER_USER@$SERVER_HOST:$SERVER_PATH/frontend/

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend sincronizado com sucesso!${NC}"
else
    echo -e "${RED}✗ Erro ao sincronizar frontend!${NC}"
    exit 1
fi

echo ""
echo "========================================"
echo "   [4/4] Instalando dependências"
echo "========================================"
echo ""

# Instalar dependências do backend e reiniciar
ssh $SERVER_USER@$SERVER_HOST << 'EOF'
cd ~/htdocs/backend
npm install --production
pm2 restart backend || pm2 start npm --name "backend" -- start
EOF

echo ""
echo -e "${GREEN}========================================"
echo "   ✓ Deploy concluído com sucesso!"
echo "========================================${NC}"
echo ""
echo "Estatísticas do RSYNC:"
echo "- Apenas arquivos modificados foram transferidos"
echo "- Economizou tempo e banda!"
echo ""
echo "Lembre-se de configurar o .env em produção se necessário:"
echo "ssh $SERVER_USER@$SERVER_HOST"
echo "nano ~/htdocs/backend/.env"
echo ""
