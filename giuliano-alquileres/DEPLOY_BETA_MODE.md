# 🚀 Deploy do Sistema em Modo BETA

Este documento explica as mudanças feitas para ativar o **Modo BETA** no sistema, que permite reservas sem pagamento online.

## 📋 Mudanças Realizadas

### Frontend

1. **Correção do fluxo de reserva para usuários não logados**
   - Arquivo: `frontend/src/pages/PropertyDetails.jsx`
   - Implementado salvamento automático dos dados da reserva no `sessionStorage` antes de redirecionar para login
   - Após login/registro, usuário é automaticamente redirecionado para finalizar a reserva

2. **Melhorias na página de login**
   - Arquivo: `frontend/src/pages/auth/GuestLogin.jsx`
   - Adicionada mensagem informativa quando usuário é redirecionado para fazer login
   - Sistema detecta reserva pendente e redireciona automaticamente após login

3. **Ativação do BETA MODE em produção**
   - Arquivo: `frontend/.env.production`
   - Alterado `VITE_BETA_MODE=true`
   - Sistema agora funciona em modo BETA na versão online

### Backend

4. **Ativação do BETA MODE no backend**
   - Arquivo: `backend/.env`
   - Adicionada variável: `BETA_MODE=true`

5. **Documentação do BETA MODE**
   - Arquivo: `backend/.env.production.example`
   - Adicionada variável: `BETA_MODE=true`
   - Documentação completa sobre o modo BETA

## 🎯 Como o BETA MODE Funciona

### Quando `BETA_MODE=true`:

**Backend:**
- ✅ Reservas são criadas com status `pending`
- ✅ Datas são bloqueadas automaticamente no calendário
- ✅ Notificações por email são enviadas
- ❌ Não tenta criar preferência de pagamento no Mercado Pago
- ❌ Retorna erro 503 se tentar acessar rotas de pagamento (comportamento esperado)

**Frontend:**
- ✅ Exibe badge BETA
- ✅ Cria reservas sem requerer pagamento
- ✅ Mostra mensagem de sucesso customizada para modo BETA
- ❌ Não exibe ou redireciona para página de pagamento

## 🚀 Como Fazer o Deploy

### 1. Fazer Commit das Mudanças

```bash
cd c:\Users\theoh\Documents\MeusProjetos\Giuliano\giuliano-alquileres

# Adicionar arquivos modificados
git add frontend/src/pages/PropertyDetails.jsx
git add frontend/src/pages/auth/GuestLogin.jsx
git add frontend/.env.production
git add backend/.env
git add backend/.env.production.example

# Fazer commit
git commit -m "fix(system): Ativar BETA MODE e corrigir fluxo de reserva

- Frontend: Corrigir perda de dados ao redirecionar usuário não logado
- Frontend: Ativar BETA_MODE em produção (.env.production)
- Backend: Adicionar variável BETA_MODE nos arquivos .env
- Sistema agora funciona em modo BETA sem pagamento online"

# Enviar para o repositório
git push origin main
```

### 2. Configurar Variável de Ambiente no Render (Backend)

1. Acesse o [Render Dashboard](https://dashboard.render.com)
2. Selecione seu serviço de **backend**
3. Vá em **Environment** → **Environment Variables**
4. Adicione a variável:
   - **Key:** `BETA_MODE`
   - **Value:** `true`
5. Clique em **Save Changes**
6. O serviço será reiniciado automaticamente

### 3. Rebuild do Frontend

O frontend será automaticamente rebuilded quando você fizer o push para o Git, pois o arquivo `.env.production` foi modificado.

Se preferir fazer rebuild manual:
1. Acesse o Render Dashboard
2. Selecione seu serviço de **frontend**
3. Clique em **Manual Deploy** → **Deploy latest commit**

## ✅ Verificação Pós-Deploy

Após o deploy, verifique:

### Backend (API)
```bash
# Verificar se o backend está em modo BETA
curl https://giuliano.onrender.com/api/health

# Deve retornar algo como:
{
  "status": "ok",
  "betaMode": true,
  ...
}
```

### Frontend
1. Acesse o site: https://giulianoa-frontend.onrender.com
2. Verifique se o badge BETA está visível
3. Tente fazer uma reserva (com ou sem login)
4. A reserva deve ser criada com sucesso SEM pedir pagamento
5. Você deve ver a mensagem: "Reserva solicitada com sucesso! O proprietário entrará em contato para confirmar."

## 🐛 Resolução de Problemas

### Erro 503 ao criar reserva
- **Causa:** A variável `BETA_MODE` não está definida no backend do Render
- **Solução:** Siga o passo 2 acima para adicionar a variável

### Frontend ainda pede pagamento
- **Causa:** O arquivo `.env.production` não foi rebuilded
- **Solução:** Faça um rebuild manual do frontend no Render

### Dados da reserva perdidos após login
- **Causa:** Código antigo ainda em cache
- **Solução:** Limpe o cache do navegador (Ctrl+Shift+Delete) e tente novamente

## 📝 Notas Importantes

- O modo BETA está ativo tanto em **desenvolvimento** quanto em **produção**
- Para desativar o modo BETA e ativar pagamentos online no futuro:
  1. Configure as credenciais do Mercado Pago
  2. Altere `BETA_MODE=false` no backend (Render)
  3. Altere `VITE_BETA_MODE=false` no `frontend/.env.production`
  4. Faça rebuild do frontend

## 🎉 Resultado Esperado

Após o deploy, o sistema online funcionará **exatamente** como o localhost:
- ✅ Usuários podem fazer reservas sem login (são redirecionados para login/registro)
- ✅ Dados da reserva são preservados durante o processo de login
- ✅ Badge BETA visível
- ✅ Reservas criadas sem requerer pagamento
- ✅ Notificações enviadas por email
- ✅ Datas bloqueadas automaticamente no calendário

---

**Data:** 2025-01-11
**Desenvolvido por:** Claude Code (Anthropic)
