#!/bin/bash

# ============================================
# Script de Deploy do Frontend
# Ziguealuga.com
# ============================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

FRONTEND_DIR="/var/www/ziguealuga/frontend"

echo -e "${BLUE}🎨 Deploy do Frontend${NC}"
echo ""

# Verificar se o diretório existe
if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}❌ Diretório $FRONTEND_DIR não encontrado!${NC}"
    exit 1
fi

cd $FRONTEND_DIR

# Verificar se .env.production existe
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env.production não encontrado!${NC}"
    echo "Criando .env.production..."

    cat > .env.production << 'EOF'
VITE_API_URL=https://api.ziguealuga.com
VITE_MERCADOPAGO_PUBLIC_KEY=SUBSTITUA_POR_SUA_PUBLIC_KEY
EOF

    echo -e "${GREEN}✓ Arquivo .env.production criado${NC}"
    echo -e "${RED}IMPORTANTE: Edite o arquivo .env.production com as configurações reais!${NC}"
    echo "Execute: nano $FRONTEND_DIR/.env.production"
    exit 1
fi

# Instalar dependências
echo -e "${BLUE}📦 Instalando dependências...${NC}"
npm ci

# Build de produção
echo -e "${BLUE}🔨 Fazendo build de produção...${NC}"
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build falhou! Diretório dist não foi criado.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build concluído com sucesso!${NC}"

# Recarregar Nginx se estiver configurado
if systemctl is-active --quiet nginx; then
    echo -e "${BLUE}♻️  Recarregando Nginx...${NC}"
    sudo systemctl reload nginx
    echo -e "${GREEN}✓ Nginx recarregado${NC}"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Frontend deployado com sucesso!  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Acesse: https://ziguealuga.com${NC}"
echo ""
