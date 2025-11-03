# Guia de Deploy para Hostinger VPS - Projeto Giuliano

Este guia detalha o processo de deploy do projeto Giuliano (Backend Node.js/Express + Frontend React/Vite) em um ambiente **Hostinger VPS** com PostgreSQL e Nginx.

## 1. Pré-requisitos na Hostinger VPS

Assumimos que você tem acesso SSH à sua VPS e que a distribuição é baseada em Debian/Ubuntu (ex: Ubuntu 22.04).

### 1.1. Instalação de Dependências Essenciais

Instale as ferramentas necessárias para o ambiente de produção:

```bash
# Atualizar o sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js, npm, PostgreSQL e Nginx
sudo apt install -y curl gnupg
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs postgresql postgresql-contrib nginx build-essential git
```

### 1.2. Configuração do PostgreSQL

O PostgreSQL é o banco de dados do Backend.

**A. Configurar Senha do Usuário `postgres` (Opcional, mas recomendado):**

```bash
sudo -u postgres psql
\password postgres
\q
```

**B. Criar Usuário e Banco de Dados para o Projeto:**

Substitua `giuliano_user` e `sua_senha_segura` por credenciais fortes.

```bash
sudo -u postgres psql
CREATE USER giuliano_user WITH PASSWORD 'sua_senha_segura';
CREATE DATABASE giuliano_db OWNER giuliano_user;
\q
```

**C. Obter a URL de Conexão (DATABASE_URL):**

A aplicação Node.js usa a variável de ambiente `DATABASE_URL`.

```
DATABASE_URL="postgres://giuliano_user:sua_senha_segura@localhost:5432/giuliano_db"
```

## 2. Deploy do Backend (Node.js/Express)

### 2.1. Clonar e Configurar

Clone o repositório e instale as dependências do backend.

```bash
# Navegue para o diretório onde deseja hospedar o backend (ex: /var/www)
sudo mkdir -p /var/www/giuliano-backend
cd /var/www/giuliano-backend

# Clone o repositório (Assumindo que você já configurou o SSH ou HTTPS)
git clone https://github.com/TheoPadilha/Giuliano.git .
cd giuliano-alquileres/backend

# Instalar dependências
npm install
```

### 2.2. Configuração de Variáveis de Ambiente

Crie um arquivo `.env` para as variáveis de ambiente de produção.

```bash
nano .env
```

**Conteúdo do .env (Exemplo):**

```env
# Variáveis de Ambiente de Produção
NODE_ENV=production
PORT=3000

# Chave Secreta para JWT - MUDE ISSO!
JWT_SECRET=sua_chave_secreta_muito_longa_e_segura

# Configuração do Banco de Dados PostgreSQL
DATABASE_URL="postgres://giuliano_user:sua_senha_segura@localhost:5432/giuliano_db"

# URL do Frontend para CORS (Substitua pelo seu domínio)
CORS_ORIGIN=https://seu-dominio.com
```

### 2.3. Inicialização do Banco de Dados

Execute as migrações e seeds para popular o banco de dados.

```bash
# Se estiver usando Sequelize (assumido pela estrutura do projeto)
# Você precisará do CLI do Sequelize instalado globalmente ou localmente
# Se estiver usando o CLI localmente:
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 2.4. Gerenciamento de Processos com PM2

Use o PM2 para manter o servidor Node.js rodando em segundo plano e reiniciá-lo em caso de falha.

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar o servidor
pm2 start server.js --name giuliano-backend

# Configurar o PM2 para iniciar automaticamente no boot
pm2 startup systemd
pm2 save
```

## 3. Deploy do Frontend (React/Vite)

### 3.1. Build do Projeto

Navegue para o diretório do frontend e crie o build de produção.

```bash
cd /var/www/giuliano-backend/giuliano-alquileres/frontend

# Instalar dependências (use npm ou pnpm conforme o projeto)
npm install # ou pnpm install

# Crie o arquivo .env.production para o build
nano .env.production
```

**Conteúdo do .env.production (Exemplo):**

```env
# Variáveis de Ambiente de Produção para o Frontend
VITE_API_URL=https://api.seu-dominio.com  # URL pública do seu Backend
VITE_GOOGLE_MAPS_API_KEY=SUA_CHAVE_GOOGLE_MAPS_AQUI # Chave da API para o mapa
```

**Execute o Build:**

```bash
npm run build
```

O build estático estará na pasta `dist`.

## 4. Configuração do Nginx (Proxy Reverso e Servidor Estático)

O Nginx será usado para:
1.  Servir o Frontend estático.
2.  Atuar como proxy reverso para o Backend (Node.js) rodando na porta 3000.

### 4.1. Configuração do Nginx

Crie um arquivo de configuração para o seu domínio. Substitua `seu-dominio.com` e `api.seu-dominio.com` pelos seus subdomínios reais.

```bash
sudo nano /etc/nginx/sites-available/giuliano
```

**Conteúdo do arquivo `giuliano` (Exemplo):**

```nginx
# Servidor para o Frontend (Domínio Principal)
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    # Redirecionar para HTTPS (Será configurado após o Certbot)
    # return 301 https://$host$request_uri;

    root /var/www/giuliano-backend/giuliano-alquileres/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Servidor para o Backend (Subdomínio API)
server {
    listen 80;
    server_name api.seu-dominio.com;

    # Redirecionar para HTTPS (Será configurado após o Certbot)
    # return 301 https://$host$request_uri;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4.2. Ativar e Testar a Configuração

Crie o link simbólico e teste a configuração do Nginx.

```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/giuliano /etc/nginx/sites-enabled/

# Testar a sintaxe do Nginx
sudo nginx -t

# Reiniciar o Nginx
sudo systemctl restart nginx
```

## 5. Configuração SSL/TLS (HTTPS) com Certbot

**IMPORTANTE:** Você deve ter seus domínios apontando para o IP da sua VPS antes de executar esta etapa.

```bash
# Instalar Certbot
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Obter e configurar os certificados (siga as instruções na tela)
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com -d api.seu-dominio.com
```

O Certbot irá automaticamente modificar seu arquivo de configuração do Nginx para incluir o HTTPS e os redirecionamentos.

## 6. Feedback Final sobre o Contrato

Analisando o contrato e o projeto, as seguintes funcionalidades foram implementadas ou estão prontas:

| Requisito do Contrato | Status no Código | Observações |
| :--- | :--- | :--- |
| **Sistema Trilíngue** (PT/ES/EN) | **Implementado** | Adicionado `i18next` no Frontend. O `AirbnbHeader.jsx` e `PropertyDetails.jsx` foram atualizados para usar as chaves de tradução. |
| **Integração Google Maps** | **Implementado** | O componente `PropertyMap.jsx` foi criado e integrado em `PropertyDetails.jsx`, usando `VITE_GOOGLE_MAPS_API_KEY`. |
| **Funcionalidades de Reserva** | **Completo** | O fluxo de reserva (datas, hóspedes, cálculo de preço) está presente no Frontend e o Backend possui rotas de `bookings`. |
| **Autenticação** | **Completo** | O sistema de login, registro e refresh de token está implementado. |
| **Gestão de Propriedades** | **Completo** | Rotas de `properties` e funcionalidades de `admin` estão presentes. |

O projeto está **100% pronto** para o deploy, atendendo a todos os pontos do contrato identificados na análise. O sucesso do deploy depende estritamente da correta configuração das variáveis de ambiente e do Nginx, conforme detalhado acima.

---
*Fim do Guia de Deploy.*
