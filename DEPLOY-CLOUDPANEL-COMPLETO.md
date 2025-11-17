# Guia Completo: Deploy no CloudPanel - Ziguealuga.com

## O que é CloudPanel?
CloudPanel é um painel de controle gratuito para gerenciar sites, bancos de dados e aplicações Node.js em servidores Linux. É muito mais simples que configurar tudo manualmente!

---

## PARTE 1: PREPARAÇÃO - Antes de Começar

### 1.1 Informações que você precisa ter em mãos:

- [ ] Acesso ao CloudPanel (URL: normalmente `https://SEU_IP:8443`)
- [ ] Usuário e senha do CloudPanel
- [ ] Domínio: `ziguealuga.com`
- [ ] Acesso SSH (caso precise)

### 1.2 Credenciais que você vai precisar criar/ter:

- [ ] Senha do banco de dados PostgreSQL
- [ ] Token JWT (vamos gerar)
- [ ] Credenciais Gmail para envio de emails
- [ ] Credenciais Mercado Pago (produção)

---

## PARTE 2: ACESSO AO CLOUDPANEL

### 2.1 Fazer Login no CloudPanel

1. Acesse: `https://SEU_IP:8443` (ou a URL que você recebeu)
2. Faça login com suas credenciais
3. Você verá o painel principal do CloudPanel

---

## PARTE 3: CONFIGURAR BANCO DE DADOS PostgreSQL

### 3.1 Criar Banco de Dados

1. No CloudPanel, vá em **Databases** no menu lateral
2. Clique em **Add Database**
3. Preencha:
   - **Database Name**: `ziguealuga_prod`
   - **Database User**: `ziguealuga_user`
   - **Database Password**: Crie uma senha FORTE (anote ela!)
   - **Database Type**: PostgreSQL
4. Clique em **Create**

### 3.2 Anotar Credenciais

Anote estas informações (você vai precisar):

```
Host: localhost
Porta: 5432
Database: ziguealuga_prod
Usuário: ziguealuga_user
Senha: [A_SENHA_QUE_VOCE_CRIOU]
```

---

## PARTE 4: CRIAR SITE NODE.JS

### 4.1 Adicionar Site Backend (API)

1. No CloudPanel, vá em **Sites** no menu lateral
2. Clique em **Add Site**
3. Preencha:
   - **Site Type**: Node.js
   - **Domain Name**: `api.ziguealuga.com`
   - **Site User**: `ziguealuga-api` (ou deixe o padrão)
   - **Node.js Version**: **20 LTS** (selecione a versão 20)
   - **App Port**: `5000`
4. Clique em **Create**

### 4.2 Adicionar Site Frontend

1. Vá em **Sites** > **Add Site**
2. Preencha:
   - **Site Type**: Static HTML
   - **Domain Name**: `ziguealuga.com`
   - **Site User**: `ziguealuga-frontend` (ou deixe o padrão)
3. Também adicione **www.ziguealuga.com** como alias (se tiver opção)
4. Clique em **Create**

---

## PARTE 5: CONFIGURAR DNS (Muito Importante!)

### 5.1 Apontar Domínio para o Servidor

No seu **provedor de domínio** (Registro.br, GoDaddy, Hostinger, etc.):

1. Vá em **Gerenciamento de DNS** ou **Zone DNS**
2. Adicione/Edite os seguintes registros:

```
Tipo: A
Nome: @
Valor: SEU_IP_DO_SERVIDOR
TTL: 3600

Tipo: A
Nome: www
Valor: SEU_IP_DO_SERVIDOR
TTL: 3600

Tipo: A
Nome: api
Valor: SEU_IP_DO_SERVIDOR
TTL: 3600
```

3. Salve as alterações
4. **AGUARDE** de 5 minutos a 48 horas para propagação DNS

### 5.2 Verificar se DNS está funcionando

No seu computador, abra o CMD/Terminal e digite:

```bash
ping ziguealuga.com
ping api.ziguealuga.com
```

Se retornar o IP do seu servidor, está funcionando!

---

## PARTE 6: ENVIAR ARQUIVOS DO PROJETO

### 6.1 Conectar via SSH (Método Recomendado)

1. No CloudPanel, vá em **Sites** > Selecione **api.ziguealuga.com**
2. Procure por **SSH Access** ou **File Manager**
3. Anote o **usuário SSH** e o **diretório home**

No seu computador (Git Bash no Windows ou Terminal no Mac/Linux):

```bash
# Conectar via SSH
ssh usuario_do_site@SEU_IP

# Navegar para o diretório do site
cd htdocs
```

### 6.2 Opção A: Enviar via Git (Recomendado)

Se você tem o projeto no GitHub:

```bash
# Ainda conectado via SSH
cd htdocs

# Clonar repositório (se for público)
git clone https://github.com/SEU_USUARIO/SEU_REPO.git .

# OU se for privado (você precisará gerar um token)
git clone https://SEU_TOKEN@github.com/SEU_USUARIO/SEU_REPO.git .
```

### 6.3 Opção B: Enviar via SFTP (FileZilla, WinSCP)

1. Baixe o **FileZilla** ou **WinSCP**
2. Configure a conexão:
   - **Host**: SEU_IP
   - **Usuário**: usuário do site (encontrado no CloudPanel)
   - **Senha**: senha do usuário
   - **Porta**: 22
3. Conecte e envie a pasta **giuliano-alquileres** completa para `htdocs/`

### 6.4 Opção C: Usar o File Manager do CloudPanel

1. No CloudPanel, vá no site > **File Manager**
2. Navegue até `htdocs/`
3. Faça upload dos arquivos (pode ser demorado)

---

## PARTE 7: CONFIGURAR BACKEND (API)

### 7.1 Conectar via SSH ao site

```bash
ssh usuario_do_site@SEU_IP
cd htdocs/giuliano-alquileres/backend
```

### 7.2 Instalar Dependências

```bash
npm install
```

### 7.3 Configurar Variáveis de Ambiente

```bash
# Copiar o arquivo cloudpanel
cp .env.cloudpanel .env

# Editar o arquivo
nano .env
```

### 7.4 Preencher as Variáveis de Ambiente

Edite o arquivo `.env` e substitua os valores:

```bash
# ==================================
# BANCO DE DADOS
# ==================================
DB_HOST=localhost
DB_PORT=5432
DB_USER=ziguealuga_user
DB_PASSWORD=COLE_AQUI_A_SENHA_QUE_VOCE_CRIOU_NO_PASSO_3.1
DB_NAME=ziguealuga_prod

# ==================================
# JWT SECRET - GERAR CHAVE SEGURA
# ==================================
# Execute este comando para gerar:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=COLE_AQUI_A_CHAVE_GERADA

# ==================================
# SERVIDOR
# ==================================
PORT=5000
NODE_ENV=production

# ==================================
# CORS E URLS
# ==================================
CORS_ORIGIN=https://ziguealuga.com,https://www.ziguealuga.com
FRONTEND_URL=https://ziguealuga.com
BACKEND_URL=https://api.ziguealuga.com

# ==================================
# EMAIL (Gmail com senha de app)
# ==================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=senha_de_app_gmail
EMAIL_FROM=noreply@ziguealuga.com

# ==================================
# MERCADO PAGO (PRODUÇÃO!)
# ==================================
MERCADOPAGO_ACCESS_TOKEN=APP_USR-seu-token-de-producao
MERCADOPAGO_PUBLIC_KEY=APP_USR-sua-public-key-de-producao

# ==================================
# MODO BETA
# ==================================
BETA_MODE=false
```

**Para sair do editor nano:**
- Pressione `Ctrl + X`
- Pressione `Y` para confirmar
- Pressione `Enter`

### 7.5 Gerar JWT Secret

```bash
# Execute este comando e copie o resultado
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Cole o resultado no .env na variável JWT_SECRET
```

### 7.6 Executar Migrações do Banco

```bash
# Criar as tabelas no banco de dados
npm run migrate

# OU se tiver um arquivo específico:
node migrate.js
```

---

## PARTE 8: CONFIGURAR BACKEND NO CLOUDPANEL

### 8.1 Configurar Node.js App

1. No CloudPanel, vá em **Sites** > **api.ziguealuga.com**
2. Procure por **Node.js Settings** ou **Application**
3. Configure:
   - **App Root**: `/home/usuario/htdocs/giuliano-alquileres/backend`
   - **App Main File**: `server.js`
   - **App Port**: `5000`
   - **Environment**: `production`
4. Clique em **Restart** ou **Start Application**

### 8.2 Verificar se está rodando

No CloudPanel, vá em **Sites** > **api.ziguealuga.com** > **Logs** > **Application Logs**

Você deve ver:
```
Server running on port 5000
Database connected successfully
```

---

## PARTE 9: CONFIGURAR FRONTEND

### 9.1 Conectar via SSH ao servidor

```bash
ssh usuario_do_site@SEU_IP
cd htdocs/giuliano-alquileres/frontend
```

### 9.2 Criar arquivo de ambiente de produção

```bash
nano .env.production
```

Cole isto:

```bash
VITE_API_URL=https://api.ziguealuga.com
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-sua-public-key-de-producao
```

Salve (`Ctrl + X`, `Y`, `Enter`)

### 9.3 Instalar dependências e fazer build

```bash
# Instalar dependências
npm install

# Fazer build de produção
npm run build
```

Isso vai criar uma pasta `dist/` com os arquivos otimizados.

### 9.4 Mover build para o diretório correto

```bash
# O CloudPanel serve arquivos do htdocs do site frontend
# Você precisa copiar o conteúdo de dist/ para o htdocs do site frontend

# Primeiro, encontre o diretório do site frontend
# Geralmente é: /home/ziguealuga-frontend/htdocs/

# Copiar arquivos
cp -r dist/* /home/ziguealuga-frontend/htdocs/
```

**OU** se você fez o upload direto na pasta do site frontend, ajuste o caminho:

```bash
# Se você está em: /home/usuario/htdocs/giuliano-alquileres/frontend
cd ..
mv frontend/dist/* ../ziguealuga.com/htdocs/
```

---

## PARTE 10: CONFIGURAR SSL (HTTPS)

### 10.1 Ativar SSL no CloudPanel

1. No CloudPanel, vá em **Sites** > **api.ziguealuga.com**
2. Vá na aba **SSL/TLS**
3. Clique em **Let's Encrypt SSL**
4. Marque **api.ziguealuga.com**
5. Clique em **Install**
6. Aguarde a instalação

Repita para **ziguealuga.com**:

1. Vá em **Sites** > **ziguealuga.com**
2. **SSL/TLS** > **Let's Encrypt SSL**
3. Marque **ziguealuga.com** e **www.ziguealuga.com**
4. Clique em **Install**

### 10.2 Forçar HTTPS

1. No CloudPanel, em cada site
2. Vá em **Settings** ou **Nginx**
3. Procure por **Force HTTPS** ou **Redirect to HTTPS**
4. Ative a opção

---

## PARTE 11: CONFIGURAR EMAILS (Gmail)

### 11.1 Criar Senha de App no Gmail

1. Acesse: https://myaccount.google.com/
2. Vá em **Segurança**
3. Ative a **Verificação em duas etapas** (se ainda não tiver)
4. Vá em **Senhas de app**
5. Selecione **Outro (nome personalizado)**
6. Digite: `Ziguealuga`
7. Clique em **Gerar**
8. **COPIE A SENHA** (ela tem 16 caracteres sem espaços)

### 11.2 Adicionar ao .env

```bash
# Volte para o backend
cd /home/usuario/htdocs/giuliano-alquileres/backend

# Editar .env
nano .env

# Adicione:
SMTP_USER=seu_email@gmail.com
SMTP_PASS=senha_de_app_gerada_acima
```

### 11.3 Reiniciar aplicação

No CloudPanel:
1. Vá em **Sites** > **api.ziguealuga.com**
2. Clique em **Restart Application**

---

## PARTE 12: TESTAR TUDO

### 12.1 Testar Backend (API)

Abra o navegador e acesse:

```
https://api.ziguealuga.com/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

### 12.2 Testar Frontend

Abra o navegador:

```
https://ziguealuga.com
```

Deve carregar o site!

### 12.3 Testar Cadastro

1. Tente criar uma conta
2. Verifique se recebe o email
3. Confirme a conta

---

## PARTE 13: CRIAR ADMIN MASTER

### 13.1 Via SSH

```bash
cd /home/usuario/htdocs/giuliano-alquileres/backend

# Executar script de criação de admin
node scripts/create-admin.js
```

### 13.2 Via URL (se tiver endpoint)

Acesse:

```
https://api.ziguealuga.com/api/admin/create-master?secret=SUA_SENHA_SECRETA&email=admin@ziguealuga.com&password=senha123&name=Admin
```

---

## PARTE 14: MONITORAMENTO E MANUTENÇÃO

### 14.1 Ver Logs da Aplicação

No CloudPanel:
1. **Sites** > **api.ziguealuga.com**
2. **Logs** > **Application Logs**

### 14.2 Ver Logs do Nginx

1. **Sites** > **api.ziguealuga.com**
2. **Logs** > **Access Logs** ou **Error Logs**

### 14.3 Reiniciar Aplicação

Se algo der errado:
1. **Sites** > **api.ziguealuga.com**
2. **Restart Application**

### 14.4 Ver Uso de Recursos

1. No CloudPanel, vá em **Dashboard**
2. Veja CPU, RAM, Disco

---

## PARTE 15: ATUALIZAÇÕES FUTURAS

### 15.1 Atualizar Backend

```bash
# Conectar via SSH
ssh usuario@SEU_IP
cd htdocs/giuliano-alquileres/backend

# Puxar últimas alterações (se usar Git)
git pull origin main

# Instalar dependências
npm install

# Executar migrações
npm run migrate

# Reiniciar no CloudPanel
```

### 15.2 Atualizar Frontend

```bash
cd htdocs/giuliano-alquileres/frontend

# Puxar alterações
git pull origin main

# Instalar dependências
npm install

# Build
npm run build

# Copiar para diretório do site
cp -r dist/* /home/ziguealuga-frontend/htdocs/
```

---

## CHECKLIST FINAL

- [ ] CloudPanel acessível
- [ ] Banco de dados PostgreSQL criado
- [ ] Site api.ziguealuga.com criado (Node.js)
- [ ] Site ziguealuga.com criado (Static)
- [ ] DNS configurado (A records)
- [ ] Arquivos do projeto enviados
- [ ] Backend: dependências instaladas
- [ ] Backend: .env configurado
- [ ] Backend: migrações executadas
- [ ] Backend: aplicação rodando no CloudPanel
- [ ] Frontend: build realizado
- [ ] Frontend: arquivos copiados para htdocs
- [ ] SSL instalado (HTTPS)
- [ ] HTTPS forçado
- [ ] Email configurado (Gmail)
- [ ] Mercado Pago configurado
- [ ] Site acessível em https://ziguealuga.com
- [ ] API acessível em https://api.ziguealuga.com
- [ ] Cadastro e login funcionando
- [ ] Admin master criado

---

## PROBLEMAS COMUNS E SOLUÇÕES

### Erro: "Cannot connect to database"

**Solução:**
1. Verifique se o banco foi criado no CloudPanel
2. Verifique se as credenciais no `.env` estão corretas
3. Teste a conexão:
```bash
psql -h localhost -U ziguealuga_user -d ziguealuga_prod
```

### Erro: "Application failed to start"

**Solução:**
1. Veja os logs em CloudPanel > Sites > Logs
2. Verifique se todas as dependências foram instaladas
3. Verifique se o arquivo `server.js` existe
4. Verifique se a porta 5000 está configurada

### Site não carrega (403/404)

**Solução:**
1. Verifique se os arquivos estão no diretório correto (`htdocs/`)
2. Verifique permissões:
```bash
chmod -R 755 htdocs/
```

### SSL não funciona

**Solução:**
1. Verifique se o DNS está apontando corretamente
2. Aguarde propagação DNS (pode demorar até 48h)
3. Tente remover e reinstalar o certificado no CloudPanel

### Emails não são enviados

**Solução:**
1. Verifique se a senha de app do Gmail está correta
2. Verifique se a verificação em duas etapas está ativa
3. Verifique os logs da aplicação

---

## SUPORTE E DOCUMENTAÇÃO

- **CloudPanel Docs**: https://www.cloudpanel.io/docs/
- **Node.js no CloudPanel**: https://www.cloudpanel.io/docs/nodejs/
- **PostgreSQL**: https://www.postgresql.org/docs/

---

**Boa sorte com seu deploy! Qualquer dúvida, consulte os logs no CloudPanel.**
