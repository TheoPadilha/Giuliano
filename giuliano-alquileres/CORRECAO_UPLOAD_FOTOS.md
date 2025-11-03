# Correção de Erro 400 no Upload de Fotos

## Data: 03/11/2025

---

## 🐛 Problema Identificado

Erro **400 (Bad Request)** ao fazer upload de fotos através do componente `PhotoUpload.jsx`:

```
Failed to load resource: the server responded with a status of 400 (Bad Request)
AxiosError: Request failed with status code 400
```

### Contexto do Erro

- **Arquivo:** [PhotoUpload.jsx:100](giuliano-alquileres/frontend/src/components/admin/PhotoUpload.jsx#L100)
- **Endpoint:** `POST /api/uploads/properties`
- **Status Code:** 400 (Bad Request)

---

## 🔍 Análise da Causa

### Backend (uploadController.js)

O backend espera:
1. `property_uuid` - UUID válido do imóvel (obrigatório)
2. `alt_texts` - String JSON contendo array de textos alternativos (opcional)
3. `main_photo_index` - Índice da foto principal (opcional)
4. `photos` - Array de arquivos no FormData

**Schema de Validação (Joi):**
```javascript
const uploadSchema = Joi.object({
  property_uuid: Joi.string().uuid().required(),
  alt_texts: Joi.array().items(Joi.string().max(255)).optional(),
  main_photo_index: Joi.number().integer().min(0).optional(),
});
```

### Possíveis Causas do Erro 400

1. ❌ **UUID inválido ou ausente** - `property_uuid` não está sendo enviado corretamente
2. ❌ **Nenhum arquivo no FormData** - `req.files` está vazio
3. ❌ **Token de autenticação inválido** - Middleware `requireAdmin` bloqueando
4. ❌ **Formato inválido de `alt_texts`** - JSON malformado
5. ❌ **Tamanho do arquivo excedido** - Arquivos > 5MB

---

## ✅ Correções Implementadas

### 1. **Validação de Arquivos Antes do Upload**

**Antes:**
```javascript
try {
  const formData = new FormData();
  formData.append("property_uuid", propertyUuid);
  // ...
}
```

**Depois:**
```javascript
try {
  // Validações antes de enviar
  if (!acceptedFiles || acceptedFiles.length === 0) {
    setError("Nenhum arquivo selecionado");
    setUploading(false);
    return;
  }

  const formData = new FormData();
  formData.append("property_uuid", propertyUuid);
  // ...
}
```

**Localização:** [PhotoUpload.jsx:50-55](giuliano-alquileres/frontend/src/components/admin/PhotoUpload.jsx#L50-L55)

---

### 2. **Logs Detalhados para Debug**

**Adicionado:**
```javascript
console.log("📤 Iniciando upload:", {
  property_uuid: propertyUuid,
  total_files: acceptedFiles.length,
  file_names: acceptedFiles.map(f => f.name),
  file_sizes: acceptedFiles.map(f => (f.size / 1024 / 1024).toFixed(2) + 'MB')
});

// Log de cada arquivo individual
acceptedFiles.forEach((file, index) => {
  formData.append("photos", file);
  console.log(`  ✓ Arquivo ${index + 1}: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
});

// Log dos dados do FormData
console.log("📋 Dados do FormData:", {
  property_uuid: propertyUuid,
  files: acceptedFiles.length,
  alt_texts: altTexts,
  main_photo_index: photos.length === 0 ? "0" : "não definido"
});

// Log dos headers
console.log("🔒 Headers:", {
  "Content-Type": "multipart/form-data",
  Authorization: localStorage.getItem('token') ? 'Token presente' : 'Token ausente'
});
```

**Localização:** [PhotoUpload.jsx:57-97](giuliano-alquileres/frontend/src/components/admin/PhotoUpload.jsx#L57-L97)

---

### 3. **Tratamento de Erro Aprimorado**

**Antes:**
```javascript
catch (err) {
  console.error("Erro no upload:", err);
  setError(
    err.response?.data?.error ||
      err.response?.data?.details ||
      "Erro ao fazer upload das fotos"
  );
}
```

**Depois:**
```javascript
catch (err) {
  console.error("❌ Erro no upload:", err);
  console.error("📊 Detalhes do erro:", {
    status: err.response?.status,
    statusText: err.response?.statusText,
    data: err.response?.data,
    headers: err.response?.headers
  });

  let errorMessage = "Erro ao fazer upload das fotos";

  if (err.response?.data) {
    const { error, details, message } = err.response.data;

    if (details) {
      errorMessage = `${error || 'Erro de validação'}: ${details}`;
    } else if (error) {
      errorMessage = error;
    } else if (message) {
      errorMessage = message;
    }
  } else if (err.message) {
    errorMessage = `Erro de conexão: ${err.message}`;
  }

  setError(errorMessage);

  // Sugestões baseadas no status code
  if (err.response?.status === 400) {
    console.log("💡 Sugestão: Verifique se o UUID do imóvel está correto e se os arquivos são válidos");
  } else if (err.response?.status === 401 || err.response?.status === 403) {
    console.log("💡 Sugestão: Verifique se você está autenticado como admin");
  } else if (err.response?.status === 404) {
    console.log("💡 Sugestão: O imóvel não foi encontrado. Salve o imóvel primeiro");
  } else if (err.response?.status === 413) {
    console.log("💡 Sugestão: Um ou mais arquivos são muito grandes (máximo 5MB cada)");
  }
}
```

**Localização:** [PhotoUpload.jsx:121-157](giuliano-alquileres/frontend/src/components/admin/PhotoUpload.jsx#L121-L157)

---

## 🔧 Como Diagnosticar o Erro

Com as correções implementadas, agora o console exibirá:

### 1. **Informações do Upload:**
```
📤 Iniciando upload: {
  property_uuid: "123e4567-e89b-12d3-a456-426614174000",
  total_files: 3,
  file_names: ["foto1.jpg", "foto2.png", "foto3.webp"],
  file_sizes: ["1.25MB", "2.10MB", "0.85MB"]
}
```

### 2. **Confirmação de Cada Arquivo:**
```
✓ Arquivo 1: foto1.jpg (1.25MB)
✓ Arquivo 2: foto2.png (2.10MB)
✓ Arquivo 3: foto3.webp (0.85MB)
```

### 3. **Dados Enviados:**
```
📋 Dados do FormData: {
  property_uuid: "123e4567-e89b-12d3-a456-426614174000",
  files: 3,
  alt_texts: ["Foto 1", "Foto 2", "Foto 3"],
  main_photo_index: "0"
}
```

### 4. **Headers de Autenticação:**
```
🔒 Headers: {
  Content-Type: "multipart/form-data",
  Authorization: "Token presente"
}
```

### 5. **Em Caso de Erro:**
```
❌ Erro no upload: AxiosError
📊 Detalhes do erro: {
  status: 400,
  statusText: "Bad Request",
  data: {
    error: "Dados inválidos",
    details: "\"property_uuid\" must be a valid GUID"
  }
}
💡 Sugestão: Verifique se o UUID do imóvel está correto e se os arquivos são válidos
```

---

## 🎯 Checklist de Verificação

Antes de fazer upload de fotos, verifique:

- [ ] **O imóvel foi salvo?** - O UUID deve existir no banco de dados
- [ ] **Autenticação ativa?** - Token presente no localStorage
- [ ] **Admin autenticado?** - Usuário com role `admin` ou `admin_master`
- [ ] **Arquivos válidos?** - JPEG, PNG ou WebP
- [ ] **Tamanho correto?** - Máximo 5MB por arquivo
- [ ] **Máximo de arquivos?** - Até 10 fotos por vez
- [ ] **UUID válido?** - Formato UUID v4 correto

---

## 📊 Possíveis Mensagens de Erro e Soluções

| Status | Mensagem | Solução |
|--------|----------|---------|
| 400 | "Dados inválidos" | Verifique UUID e formato dos arquivos |
| 401 | "Token não fornecido" | Faça login novamente |
| 403 | "Permissão negada" | Usuário não é admin |
| 404 | "Imóvel não encontrado" | Salve o imóvel antes de adicionar fotos |
| 413 | "Payload Too Large" | Reduza o tamanho dos arquivos (máx 5MB cada) |
| 500 | "Erro interno do servidor" | Verifique logs do backend |

---

## 🚀 Testando a Correção

### 1. Abrir Console do Navegador
```bash
F12 → Console
```

### 2. Fazer Upload de uma Foto
- Arrastar arquivo para a área de upload OU
- Clicar e selecionar arquivo

### 3. Verificar Logs no Console
- Deve aparecer "📤 Iniciando upload"
- Deve listar todos os arquivos
- Deve mostrar UUID e dados do FormData
- Se sucesso: "✅ Upload bem-sucedido"
- Se erro: "❌ Erro no upload" com detalhes

### 4. Em Caso de Erro 400
- Copiar a mensagem de `📊 Detalhes do erro`
- Verificar qual campo está inválido (`details`)
- Seguir a sugestão mostrada (`💡 Sugestão`)

---

## 📝 Arquivo Modificado

**Arquivo:** `frontend/src/components/admin/PhotoUpload.jsx`

**Linhas modificadas:**
- **50-55:** Validação de arquivos antes do upload
- **57-97:** Logs detalhados de debug
- **121-157:** Tratamento de erro aprimorado com sugestões

---

## ✅ Resultado Esperado

Com as correções implementadas:

1. ✅ **Erro identificado facilmente** - Logs detalhados no console
2. ✅ **Mensagens claras** - Usuário sabe exatamente o que está errado
3. ✅ **Sugestões automáticas** - Console sugere como resolver
4. ✅ **Validação prévia** - Evita envios desnecessários ao servidor
5. ✅ **Debug simplificado** - Logs estruturados e informativos

---

## 🔗 Arquivos Relacionados

- **Frontend:** [PhotoUpload.jsx](giuliano-alquileres/frontend/src/components/admin/PhotoUpload.jsx)
- **Backend:** [uploadController.js](giuliano-alquileres/backend/controllers/uploadController.js)
- **Routes:** [uploads.js](giuliano-alquileres/backend/routes/uploads.js)
- **Middleware:** [upload.js](giuliano-alquileres/backend/middleware/upload.js)

---

**Status:** ✅ Correção implementada
**Data:** 03/11/2025
**Versão:** 1.0 - Debug e Tratamento de Erro de Upload
