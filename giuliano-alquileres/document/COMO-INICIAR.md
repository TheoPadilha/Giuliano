# Como Iniciar o Projeto Giuliano Alquileres

## Forma Mais Fácil - Usar os Scripts Batch

Na pasta principal do projeto, você encontrará 4 scripts:

### 1. `start-all.bat` ⭐ RECOMENDADO
**Duplo clique neste arquivo** para iniciar backend e frontend automaticamente!

- Para todos os servidores antigos
- Inicia o backend (porta 3001)
- Inicia o frontend (porta 5173)
- Abre duas janelas de terminal

### 2. `start-backend.bat`
Inicia apenas o backend (API) na porta 3001

### 3. `start-frontend.bat`
Inicia apenas o frontend (interface) na porta 5173

### 4. `stop-servers.bat`
Para todos os servidores Node.js em execução

---

## Forma Manual - Linha de Comando

Se preferir usar o terminal:

### Iniciar Backend
```bash
cd backend
npm run dev
```

### Iniciar Frontend
```bash
cd frontend
npm run dev
```

### Parar Todos os Servidores
```bash
powershell -Command "Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force"
```

---

## URLs de Acesso

- **Frontend (Site):** http://localhost:5173
- **Backend (API):** http://localhost:3001

---

## Solução de Problemas

### Erro: "Porta já em uso"
Execute `stop-servers.bat` antes de iniciar novamente

### Erro: "Sem conexão com a internet"
Certifique-se de que o **backend está rodando** na porta 3001

### Imóveis não aparecem
1. Verifique se o backend está rodando
2. Atualize a página (F5) no navegador
3. Abra o Console do navegador (F12) para ver erros

---

## Configuração

### Backend (.env)
Arquivo: `backend/.env`
- Porta: 3001
- Banco: PostgreSQL
- Modo: development

### Frontend (.env)
Arquivo: `frontend/.env`
- Porta: 5173
- API: http://localhost:3001
- Modo Beta: true

---

**Dica:** Sempre use `start-all.bat` para evitar problemas!
