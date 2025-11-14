#!/bin/bash

# ============================================
# Script de Configuração SSL (HTTPS)
# Ziguealuga.com
# ============================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔒 Configuração de SSL com Let's Encrypt${NC}"
echo ""

# Verificar se certbot está instalado
if ! command -v certbot &> /dev/null; then
    echo -e "${RED}❌ Certbot não está instalado!${NC}"
    echo "Instalando certbot..."
    sudo apt install -y certbot python3-certbot-nginx
fi

# Verificar se Nginx está rodando
if ! systemctl is-active --quiet nginx; then
    echo -e "${RED}❌ Nginx não está rodando!${NC}"
    echo "Iniciando Nginx..."
    sudo systemctl start nginx
fi

echo -e "${YELLOW}Certifique-se que o DNS está apontando para este servidor!${NC}"
echo ""
echo "Domínios que serão configurados:"
echo "  - ziguealuga.com"
echo "  - www.ziguealuga.com"
echo "  - api.ziguealuga.com"
echo ""

read -p "Continuar? (s/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "Cancelado."
    exit 1
fi

# Pedir email
echo ""
echo -e "${YELLOW}Digite seu email para notificações do Let's Encrypt:${NC}"
read EMAIL

if [ -z "$EMAIL" ]; then
    echo -e "${RED}❌ Email é obrigatório!${NC}"
    exit 1
fi

# Configurar SSL para o site principal
echo ""
echo -e "${BLUE}🔒 Configurando SSL para ziguealuga.com...${NC}"
sudo certbot --nginx -d ziguealuga.com -d www.ziguealuga.com --non-interactive --agree-tos --email $EMAIL --redirect

# Configurar SSL para a API
echo ""
echo -e "${BLUE}🔒 Configurando SSL para api.ziguealuga.com...${NC}"
sudo certbot --nginx -d api.ziguealuga.com --non-interactive --agree-tos --email $EMAIL --redirect

echo ""
echo -e "${GREEN}✓ SSL configurado com sucesso!${NC}"

# Testar renovação automática
echo ""
echo -e "${BLUE}🧪 Testando renovação automática...${NC}"
sudo certbot renew --dry-run

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  SSL configurado e funcionando! 🔒   ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Seus sites agora estão acessíveis via HTTPS:${NC}"
echo "  https://ziguealuga.com"
echo "  https://www.ziguealuga.com"
echo "  https://api.ziguealuga.com"
echo ""
echo -e "${YELLOW}Os certificados serão renovados automaticamente.${NC}"
echo ""
