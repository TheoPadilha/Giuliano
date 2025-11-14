#!/bin/bash

# ============================================
# Script de Deploy do Backend
# Ziguealuga.com
# ============================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

APP_DIR="/var/www/ziguealuga/backend"

echo -e "${BLUE}🚀 Deploy do Backend${NC}"
echo ""

# Verificar se o diretório existe
if [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}❌ Diretório $APP_DIR não encontrado!${NC}"
    exit 1
fi

cd $APP_DIR

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado!${NC}"
    echo -e "${YELLOW}Criando .env a partir do .env.vps...${NC}"

    if [ -f ".env.vps" ]; then
        cp .env.vps .env
        echo -e "${GREEN}✓ Arquivo .env criado${NC}"
        echo -e "${RED}IMPORTANTE: Edite o arquivo .env com as configurações reais!${NC}"
        echo "Execute: nano $APP_DIR/.env"
        exit 1
    else
        echo -e "${RED}❌ Arquivo .env.vps não encontrado!${NC}"
        exit 1
    fi
fi

# Criar diretório de logs se não existir
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Instalar dependências
echo -e "${BLUE}📦 Instalando dependências...${NC}"
npm ci --only=production

# Executar migrações (se houver)
if [ -f "migrate.js" ]; then
    echo -e "${BLUE}🗄️  Executando migrações do banco...${NC}"
    node migrate.js
elif [ -f "migrations/index.js" ]; then
    echo -e "${BLUE}🗄️  Executando migrações do banco...${NC}"
    node migrations/index.js
fi

# Verificar se PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}❌ PM2 não está instalado!${NC}"
    echo "Execute: sudo npm install -g pm2"
    exit 1
fi

# Parar aplicação se estiver rodando
if pm2 list | grep -q "ziguealuga-backend"; then
    echo -e "${YELLOW}⏸️  Parando aplicação...${NC}"
    pm2 stop ziguealuga-backend
fi

# Iniciar/Reiniciar aplicação com PM2
echo -e "${BLUE}🚀 Iniciando aplicação...${NC}"

# Usar ecosystem config se existir
if [ -f "../deploy/pm2-ecosystem.config.js" ]; then
    pm2 start ../deploy/pm2-ecosystem.config.js
else
    pm2 start server.js --name "ziguealuga-backend" --env production
fi

# Salvar configuração do PM2
pm2 save

echo -e "${GREEN}✓ Backend iniciado com sucesso!${NC}"
echo ""

# Mostrar status
pm2 status

echo ""
echo -e "${YELLOW}Comandos úteis:${NC}"
echo "  pm2 logs ziguealuga-backend     - Ver logs em tempo real"
echo "  pm2 restart ziguealuga-backend  - Reiniciar aplicação"
echo "  pm2 stop ziguealuga-backend     - Parar aplicação"
echo "  pm2 monit                       - Monitoramento"
echo ""

# Testar endpoint
sleep 2
echo -e "${BLUE}🧪 Testando backend...${NC}"
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend respondendo corretamente!${NC}"
else
    echo -e "${RED}⚠️  Backend não está respondendo. Verifique os logs com: pm2 logs${NC}"
fi
