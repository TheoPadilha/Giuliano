# 🔧 Como Resolver Erro de Porta em Uso

## ❌ Problema
```
Error: listen EADDRINUSE: address already in use :::5000
❌ Porta 5000 já está em uso!
```

## ✅ Solução Rápida

### Opção 1: Usar o script automático (Recomendado)
```bash
npm run kill-port
```

### Opção 2: Manual no Windows
```bash
# 1. Encontrar o processo na porta 5000
netstat -ano | findstr :5000

# 2. Você verá algo como:
#    TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    12345
#                                                      ^^^^^ (PID)

# 3. Matar o processo (substitua 12345 pelo PID que você viu)
taskkill //PID 12345 //F
```

### Opção 3: Usar o arquivo .bat
```bash
# Simplesmente execute:
./kill-port-5000.bat
```

---

## 🎯 Por Que Isso Acontece?

Quando você fecha o terminal com **Ctrl+C** ou fecha a janela bruscamente, o processo Node.js pode não ser encerrado corretamente e continua ocupando a porta 5000.

---

## 🛡️ Prevenção

### ✅ Forma Correta de Parar o Servidor
```bash
# No terminal onde o servidor está rodando, pressione:
Ctrl + C

# Aguarde a mensagem:
# 👋 Servidor encerrado
```

### ❌ Evite
- Fechar a janela do terminal abruptamente
- Usar `Ctrl + Z` (suspende mas não encerra)
- Fechar o VS Code sem parar o servidor

---

## 📚 Scripts Disponíveis

```json
{
  "start": "node server.js",           // Iniciar servidor
  "dev": "nodemon server.js",          // Iniciar com auto-reload
  "kill-port": "kill-port-5000.bat"    // Liberar porta 5000
}
```

### Uso:
```bash
# Antes de iniciar, se der erro de porta:
npm run kill-port

# Depois iniciar:
npm start
# ou
npm run dev
```

---

## 🔍 Verificar se a Porta Está Livre

```bash
# Verificar porta 5000:
netstat -ano | findstr :5000

# Se não retornar nada = porta está livre ✅
# Se retornar algo = porta está ocupada ❌
```

---

## 🐛 Troubleshooting Avançado

### Problema: Múltiplos processos Node.js rodando

```bash
# Listar TODOS os processos Node.js
tasklist | findstr node.exe

# Encerrar TODOS os processos Node.js (cuidado!)
taskkill //IM node.exe //F
```

### Problema: Porta mudou no .env

```bash
# Verifique qual porta está configurada:
cat .env | grep PORT

# Se for diferente de 5000, use:
netstat -ano | findstr :PORTA_CONFIGURADA
```

---

## 💡 Dica Pro

Adicione no seu workflow:

```bash
# Um único comando para limpar e iniciar:
npm run kill-port && npm start
```

---

**Criado em:** 2025-10-17
**Última atualização:** 2025-10-17
