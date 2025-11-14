#!/bin/bash

# ============================================
# Script de Configuração do Banco de Dados
# Ziguealuga.com
# ============================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🗄️  Configuração do Banco de Dados PostgreSQL${NC}"
echo ""

# Pedir senha do banco
echo -e "${YELLOW}Digite uma senha SEGURA para o banco de dados:${NC}"
read -s DB_PASSWORD

echo ""
echo -e "${YELLOW}Confirme a senha:${NC}"
read -s DB_PASSWORD_CONFIRM

if [ "$DB_PASSWORD" != "$DB_PASSWORD_CONFIRM" ]; then
    echo -e "${RED}❌ As senhas não coincidem!${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Criando usuário e banco de dados...${NC}"

# Criar usuário e banco de dados
sudo -u postgres psql <<EOF
-- Criar usuário
CREATE USER ziguealuga_user WITH PASSWORD '$DB_PASSWORD';

-- Criar banco de dados
CREATE DATABASE ziguealuga_prod OWNER ziguealuga_user;

-- Garantir privilégios
GRANT ALL PRIVILEGES ON DATABASE ziguealuga_prod TO ziguealuga_user;

\q
EOF

echo -e "${GREEN}✓ Banco de dados criado com sucesso!${NC}"
echo ""
echo -e "${YELLOW}Testando conexão...${NC}"

# Testar conexão
export PGPASSWORD=$DB_PASSWORD
psql -h localhost -U ziguealuga_user -d ziguealuga_prod -c "SELECT version();" > /dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Conexão com o banco estabelecida com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro ao conectar com o banco${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Configuração do banco completa!  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}IMPORTANTE: Anote estas informações:${NC}"
echo "DB_HOST=localhost"
echo "DB_PORT=5432"
echo "DB_USER=ziguealuga_user"
echo "DB_PASSWORD=$DB_PASSWORD"
echo "DB_NAME=ziguealuga_prod"
echo ""
echo -e "${YELLOW}Você precisará delas para configurar o .env do backend${NC}"
echo ""
