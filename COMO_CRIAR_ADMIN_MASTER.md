# 🔐 Como Criar Admin Master no Giuliano Alquileres

## 📋 Resumo

Este documento explica como criar ou resetar a senha de um usuário Admin Master no sistema.

---

## 🌐 PRODUÇÃO (Render)

### 1️⃣ Reativar o Backend (se estiver suspenso)

1. Acesse: https://dashboard.render.com/
2. Faça login
3. Encontre o serviço **giuliano-backend**
4. Se estiver suspenso, clique em **"Resume Service"**
5. Aguarde 1-2 minutos

### 2️⃣ Criar/Atualizar Admin Master

**Cole esta URL no navegador:**

```
https://giuliano-backend.onrender.com/api/setup/create-custom-admin?secret=giuliano2025setup&email=mundogiu73@gmail.com&password=admin123&name=Giuliano+Admin
```

### 3️⃣ Resultado Esperado

Você verá um JSON assim:

```json
{
  "success": true,
  "message": "Admin Master criado com sucesso!" ou "Admin Master atualizado com sucesso!",
  "user": {
    "id": 1,
    "email": "mundogiu73@gmail.com",
    "role": "admin_master",
    "status": "approved"
  },
  "credentials": {
    "email": "mundogiu73@gmail.com",
    "password": "admin123",
    "loginUrl": "https://giulianoa-frontend.onrender.com/login"
  }
}
```

### 4️⃣ Fazer Login

**URL:** https://giulianoa-frontend.onrender.com/login

- **Email:** mundogiu73@gmail.com
- **Senha:** admin123

⚠️ **IMPORTANTE:** Altere a senha após o primeiro login!

---

## 💻 LOCAL (Desenvolvimento)

### 1️⃣ Iniciar Servidores

**Backend:**
```bash
cd giuliano-alquileres/backend
npm run dev
```

**Frontend:**
```bash
cd giuliano-alquileres/frontend
npm run dev
```

### 2️⃣ Criar/Atualizar Admin Master

**Cole esta URL no navegador:**

```
http://localhost:3001/api/setup/create-custom-admin?secret=giuliano2025setup&email=mundogiu73@gmail.com&password=admin123&name=Giuliano+Admin
```

### 3️⃣ Fazer Login

**URL:** http://localhost:5173/login

- **Email:** mundogiu73@gmail.com
- **Senha:** admin123

---

## 🔑 Criar Admin com Email/Senha Personalizados

### Produção:
```
https://giuliano-backend.onrender.com/api/setup/create-custom-admin?secret=giuliano2025setup&email=SEU_EMAIL@gmail.com&password=SUA_SENHA&name=SEU+NOME
```

### Local:
```
http://localhost:3001/api/setup/create-custom-admin?secret=giuliano2025setup&email=SEU_EMAIL@gmail.com&password=SUA_SENHA&name=SEU+NOME
```

**Parâmetros:**
- `secret` (obrigatório): giuliano2025setup
- `email` (obrigatório): Email do admin
- `password` (obrigatório): Senha do admin
- `name` (opcional): Nome completo do admin
- `phone` (opcional): Telefone do admin

---

## 📊 Listar Todos os Admins

### Produção:
```
https://giuliano-backend.onrender.com/api/setup/list-admins?secret=giuliano2025setup
```

### Local:
```
http://localhost:3001/api/setup/list-admins?secret=giuliano2025setup
```

Retorna todos os usuários com role `admin` ou `admin_master`.

---

## ❓ Perguntas Frequentes

### O que o endpoint faz?

- **Se o admin já existe:** Reseta a senha e promove para `admin_master`
- **Se não existe:** Cria novo admin com as credenciais fornecidas

### Preciso do Shell do Render?

**NÃO!** Este método funciona apenas acessando a URL no navegador. Não precisa de shell (que é pago).

### O admin local funciona em produção?

**NÃO!** São bancos de dados separados:
- **Local:** PostgreSQL no seu computador
- **Produção:** PostgreSQL no Render

Você precisa criar o admin em cada ambiente separadamente.

### Posso usar qualquer email/senha?

**SIM!** Basta alterar os parâmetros `email` e `password` na URL.

### Preciso fazer commit?

**NÃO!** O código já está no GitHub e foi feito deploy. Basta acessar a URL.

---

## 🛡️ Segurança

### Chave Secreta

Todos os endpoints estão protegidos pela chave secreta: `giuliano2025setup`

Se alguém tentar acessar sem a chave, receberá:
```json
{
  "success": false,
  "error": "Chave secreta inválida"
}
```

### Depois de Usar

⚠️ **Recomendação:** Após criar todos os admins necessários, você pode:
1. Remover os endpoints do arquivo `backend/routes/setup.js`
2. Ou alterar a chave secreta para uma mais forte

---

## 📞 Suporte

Se tiver problemas:

1. **Backend suspenso:** Reative no Render Dashboard
2. **Erro ao criar admin:** Verifique os logs no Render
3. **Login não funciona:** Aguarde 2-5 minutos após criar o admin
4. **Esqueceu a senha:** Use o endpoint novamente para resetar

---

## 📝 Localização dos Arquivos

- **Endpoint:** `giuliano-alquileres/backend/routes/setup.js` (linhas 381-507)
- **Documentação:** Este arquivo (`COMO_CRIAR_ADMIN_MASTER.md`)

---

**Data de Criação:** 11 de Janeiro de 2025
**Última Atualização:** 11 de Janeiro de 2025
