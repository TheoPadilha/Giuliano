#!/bin/bash

# ============================================
# Script de Instalação Automática - VPS Hostinger
# Ziguealuga.com
# ============================================

set -e  # Parar se houver erro

echo "🚀 Iniciando instalação do servidor..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Atualizar sistema
echo -e "${BLUE}📦 Atualizando sistema...${NC}"
sudo apt update && sudo apt upgrade -y

# Instalar dependências básicas
echo -e "${BLUE}📦 Instalando dependências básicas...${NC}"
sudo apt install -y curl wget git build-essential

# Instalar Node.js 20 LTS
echo -e "${BLUE}📦 Instalando Node.js 20 LTS...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo -e "${GREEN}✓ Node.js instalado:${NC}"
node --version
npm --version

# Instalar PostgreSQL
echo -e "${BLUE}📦 Instalando PostgreSQL...${NC}"
sudo apt install -y postgresql postgresql-contrib

# Iniciar PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

echo -e "${GREEN}✓ PostgreSQL instalado${NC}"

# Instalar PM2
echo -e "${BLUE}📦 Instalando PM2...${NC}"
sudo npm install -g pm2

# Configurar PM2 para iniciar com o sistema
sudo pm2 startup systemd -u $USER --hp /home/$USER

echo -e "${GREEN}✓ PM2 instalado${NC}"

# Instalar Nginx
echo -e "${BLUE}📦 Instalando Nginx...${NC}"
sudo apt install -y nginx

# Iniciar Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

echo -e "${GREEN}✓ Nginx instalado${NC}"

# Instalar Certbot para SSL
echo -e "${BLUE}📦 Instalando Certbot (SSL)...${NC}"
sudo apt install -y certbot python3-certbot-nginx

echo -e "${GREEN}✓ Certbot instalado${NC}"

# Criar diretório da aplicação
echo -e "${BLUE}📁 Criando diretório da aplicação...${NC}"
sudo mkdir -p /var/www/ziguealuga
sudo chown -R $USER:$USER /var/www/ziguealuga

echo -e "${GREEN}✓ Diretório criado: /var/www/ziguealuga${NC}"

# Configurar firewall
echo -e "${BLUE}🔒 Configurando firewall...${NC}"
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo -e "${GREEN}✓ Firewall configurado${NC}"

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✓ Instalação concluída com sucesso! ║${NC}"
echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo "1. Configurar banco de dados PostgreSQL"
echo "2. Fazer upload do código da aplicação"
echo "3. Configurar variáveis de ambiente"
echo "4. Iniciar aplicação com PM2"
echo "5. Configurar Nginx"
echo "6. Configurar SSL"
echo ""
