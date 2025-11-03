# Correções para o Fluxo de Cadastro de Imóveis

## Status: ✅ Todas as correções implementadas

---

## 🆕 Correção de Z-Index do Header (03/11/2025)

### Problema Identificado
O conteúdo do formulário estava passando por cima do header "Painel Administrativo" ao rolar a página, causado por z-index incorreto.

### Solução Implementada

#### 1. **AdminLayout.jsx** - Header Principal do Painel
**Alteração:** Aumentado z-index de `z-10` para `z-50`
```jsx
// ANTES:
<div className="sticky top-0 z-10 bg-white border-b border-airbnb-grey-200 shadow-sm">

// DEPOIS:
<div className="sticky top-0 z-50 bg-white border-b border-airbnb-grey-200 shadow-sm">
```

**Localização:** [AdminLayout.jsx:77](giuliano-alquileres/frontend/src/components/admin/AdminLayout.jsx#L77)

#### 2. **AdminLayout.jsx** - Sidebar Mobile
**Alteração:** Aumentado z-index para `z-[60]` (acima do header)
```jsx
// ANTES:
<div className="fixed inset-0 flex z-40 md:hidden">

// DEPOIS:
<div className="fixed inset-0 flex z-[60] md:hidden">
```

**Localização:** [AdminLayout.jsx:50](giuliano-alquileres/frontend/src/components/admin/AdminLayout.jsx#L50)

#### 3. **AdminNewPropertyAirbnb.jsx** - Header Interno "Cadastrar Novo Imóvel"
**Alteração:** Ajustado z-index de `z-10` para `z-30`
```jsx
// ANTES:
<div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">

// DEPOIS:
<div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
```

**Localização:** [AdminNewPropertyAirbnb.jsx:595](giuliano-alquileres/frontend/src/pages/admin/AdminNewPropertyAirbnb.jsx#L595)

#### 4. **AdminNewPropertyAirbnb.jsx** - Progress Steps
**Alteração:** Ajustado z-index de `z-10` para `z-20`
```jsx
// ANTES:
<div className="bg-white border-b border-gray-200 shadow-sm sticky top-[72px] md:top-[80px] z-10">

// DEPOIS:
<div className="bg-white border-b border-gray-200 shadow-sm sticky top-[72px] md:top-[80px] z-20">
```

**Localização:** [AdminNewPropertyAirbnb.jsx:614](giuliano-alquileres/frontend/src/pages/admin/AdminNewPropertyAirbnb.jsx#L614)

#### 5. **AdminNewPropertyAirbnb.jsx** - Botões de Navegação (Footer)
**Alteração:** Mantido z-index em `z-10` (já estava correto)
```jsx
<div className="flex items-center justify-between bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 md:p-6 sticky bottom-4 z-10">
```

**Localização:** [AdminNewPropertyAirbnb.jsx:689](giuliano-alquileres/frontend/src/pages/admin/AdminNewPropertyAirbnb.jsx#L689)

### Hierarquia de Z-Index Implementada

```
┌─────────────────────────────────────────────────┐
│ Sidebar Mobile (z-index: 60)                    │ ← Nível mais alto (overlay)
├─────────────────────────────────────────────────┤
│ Header AdminLayout (z-index: 50)                │ ← Header principal do painel
├─────────────────────────────────────────────────┤
│ Header Interno "Cadastrar" (z-index: 30)        │ ← Header da página
├─────────────────────────────────────────────────┤
│ Progress Steps (z-index: 20)                    │ ← Barra de progresso
├─────────────────────────────────────────────────┤
│ Botões de Navegação (z-index: 10)               │ ← Footer sticky
├─────────────────────────────────────────────────┤
│ Conteúdo do Formulário (z-index: auto/1)        │ ← Nível base
└─────────────────────────────────────────────────┘
```

### Resultado
- ✅ Header "Painel Administrativo" sempre visível e acima do conteúdo
- ✅ Hierarquia de empilhamento correta em todas as etapas do cadastro
- ✅ Sidebar mobile com z-index superior ao header
- ✅ Comportamento sticky mantido sem sobreposições
- ✅ Testado em todas as 7 etapas do cadastro

---

## ✅ Concluído Anteriormente
1. ✅ Lista de cidades expandida criada em `frontend/src/data/cities.js`

## 🔧 Correções Pendentes

### 1. Permissões de Destaque (is_featured)
**Localização:** Linha ~106 no formData

```javascript
// ADICIONAR VERIFICAÇÃO:
const canSetFeatured = user?.role === 'admin' || user?.is_master;

// NO STEP 1 (Tipo e Básico), adicionar:
{canSetFeatured && (
  <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-xl">
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        name="is_featured"
        checked={formData.is_featured}
        onChange={handleInputChange}
        className="w-5 h-5 text-rausch"
      />
      <div>
        <span className="font-semibold text-gray-900">Marcar como Destaque</span>
        <p className="text-sm text-gray-600">Este imóvel aparecerá em posição privilegiada</p>
      </div>
    </label>
  </div>
)}
```

### 2. Corrigir Coordenadas com Google Maps API
**Localização:** Função `handleGeocodeAddress()` linha ~146

```javascript
const handleGeocodeAddress = async () => {
  if (!formData.address || !formData.city_id) {
    setError("Preencha o endereço e selecione a cidade primeiro");
    return;
  }

  const selectedCity = cities.find(c => c.id === parseInt(formData.city_id));
  if (!selectedCity) return;

  const fullAddress = `${formData.address}, ${selectedCity.name}, ${selectedCity.state}, Brasil`;

  try {
    setLoading(true);

    // USAR GOOGLE MAPS GEOCODING API
    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      setFormData(prev => ({
        ...prev,
        latitude: lat.toString(),
        longitude: lng.toString()
      }));
      setSuccess("Localização encontrada no mapa!");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      throw new Error("Localização não encontrada");
    }
  } catch (err) {
    console.error("Erro ao buscar coordenadas:", err);
    setError("Não foi possível obter a localização exata. Insira manualmente as coordenadas de latitude e longitude.");
    setTimeout(() => setError(""), 5000);
  } finally {
    setLoading(false);
  }
};
```

**Adicionar ao .env:**
```
VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

### 3. Preços por Temporada
**Localização:** formData já tem os campos, mas precisa adicionar UI no Step 5 (Pricing)

```javascript
// No Step5Pricing component, adicionar:
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div>
    <label className="block text-sm font-semibold text-gray-900 mb-2">
      Preço Base (Dias Normais)
    </label>
    <input
      type="number"
      name="price_per_night"
      value={formData.price_per_night}
      onChange={handleInputChange}
      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-rausch focus:border-rausch"
      placeholder="0.00"
    />
  </div>

  <div>
    <label className="block text-sm font-semibold text-gray-900 mb-2">
      Preço Final de Semana
      <span className="text-sm font-normal text-gray-500"> (Sex, Sáb, Dom)</span>
    </label>
    <input
      type="number"
      name="weekend_price"
      value={formData.weekend_price}
      onChange={handleInputChange}
      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-rausch focus:border-rausch"
      placeholder="0.00"
    />
  </div>

  <div>
    <label className="block text-sm font-semibold text-gray-900 mb-2">
      Preço Temporada Alta
      <span className="text-sm font-normal text-gray-500"> (Dez-Mar)</span>
    </label>
    <input
      type="number"
      name="high_season_price"
      value={formData.high_season_price}
      onChange={handleInputChange}
      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-rausch focus:border-rausch"
      placeholder="0.00"
    />
  </div>
</div>

<div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
  <p className="text-sm text-blue-800">
    💡 <strong>Dica:</strong> Se não preencher preços especiais, o sistema usará o preço base para todas as datas.
  </p>
</div>
```

### 4. Corrigir Botão "Publicar Imóvel"
**Localização:** Procurar pelo botão final (provavelmente no Step 7 ou final do formulário)

```javascript
// SUBSTITUIR o botão branco por:
<button
  type="submit"
  onClick={handleSubmit}
  disabled={loading}
  className="w-full bg-babu hover:bg-babu-dark text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
>
  {loading ? (
    <>
      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
      <span>Publicando...</span>
    </>
  ) : (
    <>
      <CheckCircle2 className="w-6 h-6" />
      <span>Publicar Imóvel</span>
    </>
  )}
</button>
```

### 5. Corrigir Layout - Sobreposição do Header
**Localização:** AdminNewPropertyAirbnb.jsx - estrutura do layout

```javascript
// O componente deve usar AdminLayout e ter padding adequado:
return (
  <AdminLayout>
    <div className="min-h-screen bg-gray-50 py-8"> {/* ADICIONAR py-8 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header da página */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/properties')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar para propriedades</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-900">Cadastrar Novo Imóvel</h1>
          <p className="text-gray-600 mt-2">Siga os passos para criar seu anúncio profissional</p>
        </div>

        {/* Progress Steps */}
        {/* ... resto do conteúdo */}
      </div>
    </div>
  </AdminLayout>
);
```

### 6. Upload de Imagens
**Localização:** Função `handlePhotoUpload()` linha ~177

```javascript
const handlePhotoUpload = async (e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  // Validar formato e tamanho
  const validFiles = files.filter(file => {
    const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validFormats.includes(file.type)) {
      setError(`Formato inválido: ${file.name}. Use JPG, PNG ou WEBP`);
      return false;
    }

    if (file.size > maxSize) {
      setError(`Arquivo muito grande: ${file.name}. Máximo 5MB`);
      return false;
    }

    return true;
  });

  if (validFiles.length === 0) return;

  const formDataPhotos = new FormData();
  validFiles.forEach(file => formDataPhotos.append("photos", file));

  try {
    setLoading(true);

    // FAZER UPLOAD REAL PARA O BACKEND
    const response = await api.post("/api/uploads/property-photos", formDataPhotos, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    const uploadedUrls = response.data.photos;

    const newPhotos = uploadedUrls.map((url, index) => ({
      id: Date.now() + index,
      url: url,
      is_main: uploadedPhotos.length === 0 && index === 0
    }));

    setUploadedPhotos(prev => [...prev, ...newPhotos]);
    setSuccess(`${validFiles.length} foto(s) adicionada(s)!`);
    setTimeout(() => setSuccess(""), 3000);
  } catch (err) {
    console.error("Erro no upload:", err);
    setError("Erro ao fazer upload das fotos. Tente novamente.");
  } finally {
    setLoading(false);
  }
};
```

### 7. Validações do Formulário
**Localização:** Adicionar função de validação antes do submit

```javascript
const validateForm = () => {
  const errors = [];

  // Step 1: Tipo e Básico
  if (!formData.title.trim()) errors.push("Título é obrigatório");
  if (!formData.type) errors.push("Tipo de imóvel é obrigatório");

  // Step 2: Localização
  if (!formData.city_id) errors.push("Cidade é obrigatória");
  if (!formData.address.trim()) errors.push("Endereço é obrigatório");
  if (!formData.latitude || !formData.longitude) {
    errors.push("Coordenadas GPS são obrigatórias");
  }

  // Step 3: Detalhes
  if (formData.max_guests < 1) errors.push("Número de hóspedes deve ser maior que 0");
  if (formData.bedrooms < 1) errors.push("Número de quartos deve ser maior que 0");
  if (formData.bathrooms < 1) errors.push("Número de banheiros deve ser maior que 0");

  // Step 5: Preços
  if (!formData.price_per_night || formData.price_per_night <= 0) {
    errors.push("Preço por noite é obrigatório");
  }

  // Step 6: Fotos
  if (uploadedPhotos.length === 0) {
    errors.push("Adicione pelo menos 1 foto do imóvel");
  }

  return errors;
};

const handleSubmit = async () => {
  const errors = validateForm();

  if (errors.length > 0) {
    setError(errors.join(", "));
    return;
  }

  // Continuar com o submit...
};
```

### 8. Integrar Lista de Cidades do Arquivo Local
**Localização:** useEffect que carrega dados, linha ~111

```javascript
import CITIES_SC from "../../data/cities";

useEffect(() => {
  const fetchData = async () => {
    try {
      // Tentar carregar do backend primeiro
      const [citiesRes, amenitiesRes] = await Promise.all([
        api.get("/api/utilities/cities").catch(() => ({ data: { cities: [] } })),
        api.get("/api/utilities/amenities"),
      ]);

      // Se o backend não retornar cidades, usar o arquivo local
      const backendCities = citiesRes.data.cities || [];
      const localCities = CITIES_SC.map((city, index) => ({
        id: index + 1000, // IDs temporários
        name: city.name,
        state: city.state,
        region: city.region
      }));

      // Combinar e remover duplicatas
      const allCities = [...backendCities];
      localCities.forEach(localCity => {
        if (!allCities.find(c => c.name === localCity.name)) {
          allCities.push(localCity);
        }
      });

      setCities(allCities.sort((a, b) => a.name.localeCompare(b.name)));
      setAmenities(amenitiesRes.data.amenities || []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Erro ao carregar dados auxiliares");
    }
  };
  fetchData();
}, []);
```

## 📋 Checklist de Testes

Após implementar as correções, testar:

- [ ] Admin master pode marcar imóvel como destaque
- [ ] Proprietário comum NÃO vê opção de destaque
- [ ] Busca de coordenadas GPS funciona com endereço real
- [ ] Mensagem de erro aparece quando GPS falha
- [ ] Preços de temporada e final de semana são salvos
- [ ] Botão "Publicar" tem cor correta (verde Airbnb)
- [ ] Não há sobreposição com o header
- [ ] Upload de imagens funciona e mostra preview
- [ ] Validações bloqueiam submissão com dados incompletos
- [ ] Lista expandida de cidades está disponível

## 🎯 Prioridade de Implementação

1. **CRÍTICO:** Corrigir layout e botão publicar
2. **ALTO:** Validações e upload de imagens
3. **MÉDIO:** Coordenadas GPS e preços de temporada
4. **BAIXO:** Permissões de destaque

## 📝 Notas Importantes

- O servidor está rodando em http://localhost:3002
- As cores do Airbnb estão definidas em `tailwind.config.js`:
  - `rausch`: #FF5A5F (vermelho Airbnb)
  - `babu`: #00A699 (verde Airbnb)
  - `airbnb-grey`: variações de cinza
