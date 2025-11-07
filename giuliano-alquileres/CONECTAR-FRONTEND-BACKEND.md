# 🔗 Conectar Frontend ao Backend - Render

Instruções para conectar o frontend (já online) ao backend (acabamos de fazer deploy).

## ✅ Status Atual

- **Frontend**: https://giulianoa-frontend.onrender.com ✅ Online
- **Backend**: https://giuliano.onrender.com ✅ Online
- **Banco de dados**: ✅ Populado e funcionando
- **Admin**: ✅ Criado (admin@ziguealuga.com / admin123)

---

## 🎯 Configurar Frontend no Render

### Passo 1: Acessar o Dashboard do Frontend

1. Acesse: https://dashboard.render.com/
2. Clique no serviço: **giulianoa-frontend**
3. Vá na aba **"Environment"**

### Passo 2: Adicionar/Atualizar Variáveis de Ambiente

Clique em **"Add Environment Variable"** (ou edite se já existe):

```bash
VITE_API_URL=https://giuliano.onrender.com
```

⚠️ **IMPORTANTE**: Não coloque barra `/` no final!

### Passo 3: Salvar e Aguardar Redeploy

1. Clique em **"Save Changes"**
2. O frontend vai fazer redeploy automaticamente (~3-5 minutos)
3. Aguarde até ver: "Your service is live 🎉"

---

## 🧪 Testar Sistema Completo

### 1. Health Check do Backend

```
https://giuliano.onrender.com/health
```

Deve retornar:
```json
{
  "status": "healthy",
  "database": "connected",
  "environment": "production"
}
```

### 2. Verificar Status do Setup

```
https://giuliano.onrender.com/api/setup/status
```

Deve retornar:
```json
{
  "database": "connected",
  "cities": 63,
  "users": 1,
  "has_admin": true,
  "ready": true
}
```

### 3. Testar Login no Frontend

1. Acesse: https://giulianoa-frontend.onrender.com/admin/login
2. Entre com:
   ```
   Email: admin@ziguealuga.com
   Senha: admin123
   ```
3. Se logar com sucesso = ✅ **TUDO FUNCIONANDO!**

### 4. Testar Listagem de Imóveis

```
https://giuliano.onrender.com/api/properties
```

Deve retornar lista (pode estar vazia se não criou imóveis ainda).

---

## 🐛 Troubleshooting

### Erro: "Network Error" no frontend

**Causa**: Frontend não consegue conectar ao backend (CORS ou URL errada)

**Solução**:
1. Verifique se `VITE_API_URL` está correto (sem barra no final)
2. Confirme que o backend está rodando: acesse /health
3. Limpe o cache do navegador (Ctrl+Shift+R)

### Erro: "CORS policy"

**Causa**: Backend não está permitindo requisições do frontend

**Solução**:
1. Verifique se `CORS_ORIGIN` no backend está configurado corretamente
2. No Render Dashboard → **giuliano** (backend) → **Environment**
3. Confirme:
   ```
   CORS_ORIGIN=https://giulianoa-frontend.onrender.com
   ```

### Login não funciona

**Causa**: Token JWT não está sendo aceito

**Solução**:
1. Verifique se `JWT_SECRET` está configurado no backend
2. Limpe localStorage do navegador (F12 → Application → Local Storage → Clear)
3. Tente fazer login novamente

### Cold Start (~30s de delay)

**Causa**: Plano free do Render dorme após 15min de inatividade

**Solução**:
1. Normal no plano gratuito
2. Primeira requisição demora ~30s (backend "acordando")
3. Depois funciona normalmente
4. Para produção, considere upgrade para plano pago ($7/mês)

---

## 🔒 Segurança Pós-Deploy

### ⚠️ IMPORTANTE: Remover Endpoint de Setup

Após tudo funcionar, **REMOVA** o endpoint de setup para segurança:

#### Opção 1: Comentar a rota (Recomendado)

Edite `backend/server.js` linha ~181:

```javascript
// Rota de setup inicial (apenas para primeiro deploy)
// app.use("/api/setup", require("./routes/setup")); // ⚠️ COMENTADO PARA PRODUÇÃO
```

#### Opção 2: Deletar o arquivo

```bash
rm backend/routes/setup.js
```

E remova a linha no `server.js`:
```javascript
// Remova esta linha:
app.use("/api/setup", require("./routes/setup"));
```

**Depois faça commit e push:**
```bash
git add .
git commit -m "chore: Remover endpoint de setup pós-deploy"
git push origin main
```

---

## 📊 Monitoramento

### URLs para Monitorar

```
Backend Health:  https://giuliano.onrender.com/health
Setup Status:    https://giuliano.onrender.com/api/setup/status
Frontend:        https://giulianoa-frontend.onrender.com
Admin Login:     https://giulianoa-frontend.onrender.com/admin/login
```

### Logs

Para ver logs em tempo real:
- **Backend**: Render Dashboard → giuliano → **Logs**
- **Frontend**: Render Dashboard → giulianoa-frontend → **Logs**

---

## 🎯 Próximos Passos (Após Teste)

1. ✅ Criar alguns imóveis de teste no painel admin
2. ✅ Fazer uma reserva de teste
3. ✅ Testar email de confirmação
4. ✅ Testar upload de fotos
5. ⚠️ **Remover endpoint /api/setup**
6. 🔐 Mudar senha do admin (admin123 é temporária!)
7. 📧 Configurar SendGrid (substituir Gmail)
8. 💳 Configurar Mercado Pago (credenciais reais)
9. 🌐 Configurar domínio customizado (ziguealuga.com)

---

**Última atualização**: 07/11/2025
**Status**: ✅ Backend Online | ⏳ Aguardando conexão do Frontend
