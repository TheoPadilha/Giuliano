# 📅 COMO VER O CALENDÁRIO FUNCIONANDO

## 🚀 PASSOS RÁPIDOS

### 1. **Inicie o Frontend**
```bash
cd frontend
npm run dev
```

### 2. **Abra no navegador**
```
http://localhost:5173
```

### 3. **Veja o Calendário!**
Na página inicial (Home), você verá:

```
┌────────────────────────────────────────────────────────┐
│        Encontre seu lugar perfeito                     │
│  Milhares de propriedades incríveis esperando por você │
├───────────┬─────────────┬─────────────┬───────────────┤
│ 📍 Destino│ 📅 Datas    │ 👥 Hóspedes │ 🔍 Buscar     │
└───────────┴─────────────┴─────────────┴───────────────┘
```

### 4. **Clique no campo de Datas**
Quando clicar, um calendário lindo vai aparecer com:
- ✅ 2 meses lado a lado
- ✅ Seleção de check-in e check-out
- ✅ Datas passadas bloqueadas (cinza)
- ✅ Range selecionado em azul

---

## 🎨 VISUAL DO CALENDÁRIO

Quando você clicar no campo de datas, verá isso:

```
┌──────────────────────────────────────────────────────┐
│  Selecione as datas                              × │
│  Escolha o check-in                                  │
├──────────────────┬───────────────────────────────────┤
│ Check-in         │ Check-out                         │
│ Selecione        │ Selecione                         │
├──────────────────┴───────────────────────────────────┤
│                                                       │
│  Janeiro 2025          Fevereiro 2025                │
│  Dom Seg Ter Qua Qui Sex Sáb                         │
│   1   2   3   4   5   6   7                          │
│   8   9  10  11  12  13  14                          │
│  15  16  17  18  19  20  21   <- Clique aqui!        │
│  22  23  24  25  26  27  28                          │
│                                                       │
├───────────────────────────────────────────────────────┤
│ 🔵 Selecionado   ⬜ Indisponível                     │
│                            [ Limpar ]  [ Confirmar ]  │
└───────────────────────────────────────────────────────┘
```

---

## 🎯 COMO USAR

### **Passo 1: Digite um destino**
```
📍 Destino: "Balneário Camboriú"
```

### **Passo 2: Clique nas datas**
1. Clique no campo de datas
2. Calendário abre
3. Clique em uma data (será o check-in)
4. Clique em outra data posterior (será o check-out)
5. Clique em "Confirmar"

### **Passo 3: Escolha hóspedes**
1. Clique no campo de hóspedes
2. Use + e - para ajustar
3. Clique em "Confirmar"

### **Passo 4: Buscar!**
Clique no botão "🔍 Buscar"

---

## 🐛 PROBLEMAS COMUNS

### ❌ **Erro: Cannot find module**
```bash
# Instale as dependências
cd frontend
npm install react-icons
```

### ❌ **Calendário não abre**
- Verifique o console do navegador (F12)
- Certifique-se que o arquivo `DateRangePicker.jsx` está na pasta `components/search/`

### ❌ **Estilos quebrados**
```bash
# Certifique-se que o Tailwind está configurado
npm run dev
```

---

## 📁 ESTRUTURA DE ARQUIVOS

Verifique se você tem esses arquivos:

```
frontend/src/
├── components/
│   └── search/
│       ├── SearchBar.jsx         ✅ Criado!
│       └── DateRangePicker.jsx   ✅ Criado!
└── pages/
    └── Home.jsx                  ✅ Atualizado!
```

---

## 🎥 O QUE ESPERAR

### **Na Home:**
- Uma caixa branca grande e bonita
- 4 campos: Destino, Datas, Hóspedes, Buscar
- Design moderno e limpo

### **Ao clicar em Datas:**
- Dropdown abre com calendário
- 2 meses exibidos
- Dias clicáveis
- Dias passados desabilitados (cinza)

### **Ao selecionar:**
- Check-in fica azul
- Range fica azul claro
- Check-out fica azul
- Mostra as datas selecionadas no topo

---

## 🔥 PRÓXIMOS PASSOS

Depois de ver funcionando, podemos adicionar:

1. **Integração com Backend**
   - Buscar propriedades por data
   - Exibir disponibilidade real

2. **Calendário na Página da Propriedade**
   - Ver datas ocupadas
   - Reservar diretamente

3. **Sistema de Pagamento**
   - Checkout
   - Confirmação de reserva

---

## 💡 DICA VISUAL

O calendário ficará **exatamente** como o do Airbnb/Booking.com:
- 2 meses lado a lado
- Cores azuis para seleção
- Animações suaves
- Responsivo (mobile-friendly)

---

**Qualquer dúvida, me chama!** 🚀

Só inicie o `npm run dev` e acesse `localhost:5173`!
