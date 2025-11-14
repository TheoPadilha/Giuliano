// AdminNewPropertyAirbnb.jsx - VERSÃO ULTRA PROFISSIONAL ESTILO AIRBNB
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../../components/admin/AdminLayout";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  Home,
  MapPin,
  DollarSign,
  Images,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Bed,
  Bath,
  Users,
  Star,
  Wifi,
  Car,
  Waves,
  Tv,
  Snowflake,
  ShieldCheck,
  Dumbbell,
  Martini,
  Building2,
  Crown,
  Gem,
  House,
  Search,
  Plus,
  Trash2,
  Eye
} from "lucide-react";

// Import Steps Components
import {
  Step2Location,
  Step3Details,
  Step4Amenities,
  Step5Pricing,
  Step6Photos,
  Step7Review
} from "../../components/admin/PropertySteps";

// Wizard Steps
const STEPS = [
  { id: 1, title: "Tipo e Básico", icon: Home, description: "Informações principais" },
  { id: 2, title: "Localização", icon: MapPin, description: "Endereço e mapa" },
  { id: 3, title: "Detalhes", icon: Bed, description: "Quartos, banheiros e capacidade" },
  { id: 4, title: "Comodidades", icon: Star, description: "Amenidades do imóvel" },
  { id: 5, title: "Preços", icon: DollarSign, description: "Valores e temporadas" },
  { id: 6, title: "Fotos", icon: Images, description: "Imagens do imóvel" },
  { id: 7, title: "Revisão", icon: CheckCircle2, description: "Confirmar e publicar" }
];

// Ícones para tipos de propriedade
const PROPERTY_TYPE_ICONS = {
  apartment: { icon: Building2, label: "Apartamento" },
  house: { icon: House, label: "Casa" },
  penthouse: { icon: Crown, label: "Cobertura" },
  studio: { icon: Gem, label: "Studio" }
};

// Ícones para amenidades
const AMENITY_ICONS = {
  wifi: Wifi,
  parking: Car,
  pool: Waves,
  tv: Tv,
  ac: Snowflake,
  security: ShieldCheck,
  gym: Dumbbell,
  bar: Martini
};

const AdminNewPropertyAirbnb = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const errorRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "apartment",
    max_guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    city_id: "",
    address: "",
    neighborhood: "",
    latitude: "",
    longitude: "",
    price_per_night: "",
    weekend_price: "",
    high_season_price: "",
    status: "available",
    is_featured: false,
    amenities: [],
  });

  // Scroll automático para o topo quando houver erro
  useEffect(() => {
    if (error) {
      // Scroll suave para o topo da página
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      // Se o errorRef existir, fazer scroll para o elemento de erro
      if (errorRef.current) {
        errorRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [error]);

  // Scroll automático para o topo quando houver sucesso
  useEffect(() => {
    if (success) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [success]);

  // Carregar cidades e amenidades
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesRes, amenitiesRes] = await Promise.all([
          api.get("/api/utilities/cities"),
          api.get("/api/utilities/amenities"),
        ]);

        // Usar apenas cidades do backend (todas já estão no banco de dados)
        const backendCities = citiesRes.data.cities || [];

        // Ordenar alfabeticamente
        setCities(backendCities.sort((a, b) => a.name.localeCompare(b.name)));
        setAmenities(amenitiesRes.data.amenities || []);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar dados auxiliares");
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (type === "number" ? (value === "" ? "" : Number(value)) : value)
    }));
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  // Geocodificação usando endpoint do backend
  const handleGeocodeAddress = async () => {
    if (!formData.address || !formData.city_id) {
      setError("Preencha o endereço e selecione a cidade primeiro");
      setTimeout(() => setError(""), 5000);
      return;
    }

    const selectedCity = cities.find(c => c.id === parseInt(formData.city_id));
    if (!selectedCity) {
      setError("Cidade não encontrada");
      setTimeout(() => setError(""), 5000);
      return;
    }

    const fullAddress = `${formData.address}, ${formData.neighborhood || ''}, ${selectedCity.name}, ${selectedCity.state}, Brasil`;

    try {
      setLoading(true);
      setError("");

      // Usar endpoint do backend ao invés de chamar Google Maps diretamente
      const response = await api.post("/api/utilities/geocode", {
        address: fullAddress
      });

      const data = response.data;

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          latitude: data.latitude.toFixed(8),
          longitude: data.longitude.toFixed(8)
        }));

        // Mensagem de sucesso com aviso de precisão
        const successMessage = `Coordenadas encontradas! Latitude: ${data.latitude.toFixed(6)}, Longitude: ${data.longitude.toFixed(6)}`;
        const warningMessage = data.warning ? `\n⚠️ ${data.warning}` : '';

        setSuccess(successMessage + warningMessage);
        setTimeout(() => setSuccess(""), 8000);
      }
    } catch (error) {
      console.error("Erro ao geocodificar:", error);

      if (error.response) {
        // Erro retornado pelo backend
        const errorMessage = error.response.data.error || "Erro ao buscar coordenadas";
        setError(errorMessage);
      } else {
        // Erro de conexão ou outro erro
        setError("Erro de conexão ao buscar localização. Verifique sua internet ou insira as coordenadas manualmente.");
      }
      setTimeout(() => setError(""), 8000);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validações de arquivo
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    // Validar cada arquivo
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`Arquivo "${file.name}" tem formato inválido. Use apenas JPG, PNG ou WEBP.`);
        setTimeout(() => setError(""), 5000);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        setError(`Arquivo "${file.name}" é muito grande (${sizeMB}MB). Tamanho máximo: 20MB.`);
        setTimeout(() => setError(""), 5000);
        return;
      }
    }

    if (uploadedPhotos.length + files.length > 20) {
      setError(`Você já tem ${uploadedPhotos.length} foto(s). Máximo de 20 fotos permitidas no total.`);
      setTimeout(() => setError(""), 5000);
      return;
    }

    try {
      setLoading(true);

      // Criar preview local das fotos com URL temporária
      const mockPhotos = files.map((file, index) => ({
        id: Date.now() + index,
        url: URL.createObjectURL(file),
        file: file, // Guardar arquivo para upload posterior
        is_main: uploadedPhotos.length === 0 && index === 0,
        original_name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) // tamanho em MB
      }));

      setUploadedPhotos(prev => [...prev, ...mockPhotos]);
      setSuccess(`${files.length} foto(s) adicionada(s) com sucesso! Total: ${uploadedPhotos.length + files.length} foto(s).`);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Erro ao processar fotos:", err);
      setError("Erro ao processar as fotos. Tente novamente.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const setMainPhoto = (photoId) => {
    setUploadedPhotos(prev => prev.map(photo => ({
      ...photo,
      is_main: photo.id === photoId
    })));
  };

  const removePhoto = (photoId) => {
    setUploadedPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const validateStep = (step) => {
    // Limpar erros anteriores
    setError("");

    switch (step) {
      case 1: // Informações Básicas
        if (!formData.title || formData.title.trim().length < 5) {
          setError("❌ O título deve ter no mínimo 5 caracteres");
          setTimeout(() => setError(""), 5000);
          return false;
        }
        if (formData.title.trim().length > 200) {
          setError("❌ O título não pode ter mais de 200 caracteres");
          setTimeout(() => setError(""), 5000);
          return false;
        }
        if (!formData.type) {
          setError("❌ Selecione o tipo de imóvel");
          setTimeout(() => setError(""), 5000);
          return false;
        }
        if (formData.description && formData.description.trim().length > 0 && formData.description.trim().length < 20) {
          setError("❌ A descrição deve ter no mínimo 20 caracteres ou ficar vazia");
          setTimeout(() => setError(""), 5000);
          return false;
        }
        return true;

      case 2: // Localização
        if (!formData.city_id) {
          setError("❌ Selecione uma cidade da lista");
          setTimeout(() => setError(""), 5000);
          return false;
        }
        if (!formData.address || formData.address.trim().length < 5) {
          setError("❌ O endereço deve ter no mínimo 5 caracteres");
          setTimeout(() => setError(""), 5000);
          return false;
        }
        if (!formData.neighborhood || formData.neighborhood.trim().length < 2) {
          setError("❌ Informe o bairro (mínimo 2 caracteres)");
          setTimeout(() => setError(""), 5000);
          return false;
        }
        // Validação opcional de coordenadas
        if (formData.latitude || formData.longitude) {
          const lat = parseFloat(formData.latitude);
          const lng = parseFloat(formData.longitude);
          if (isNaN(lat) || lat < -90 || lat > 90) {
            setError("❌ Latitude inválida (deve estar entre -90 e 90)");
            setTimeout(() => setError(""), 5000);
            return false;
          }
          if (isNaN(lng) || lng < -180 || lng > 180) {
            setError("❌ Longitude inválida (deve estar entre -180 e 180)");
            setTimeout(() => setError(""), 5000);
            return false;
          }
        }
        return true;

      case 3: // Capacidade
        if (!formData.max_guests || formData.max_guests < 1) {
          setError("❌ O número de hóspedes deve ser no mínimo 1");
          setTimeout(() => setError(""), 5000);
          return false;
        }
        if (formData.max_guests > 20) {
          setError("❌ O número máximo de hóspedes é 20");
          setTimeout(() => setError(""), 5000);
          return false;
        }
        if (formData.bedrooms === "" || formData.bedrooms < 0) {
          setError("❌ Informe a quantidade de quartos (mínimo 0 para studio)");
          setTimeout(() => setError(""), 5000);
          return false;
        }
        if (formData.bedrooms > 10) {
          setError("❌ O número máximo de quartos é 10");
          setTimeout(() => setError(""), 5000);
          return false;
        }
        if (!formData.bathrooms || formData.bathrooms < 1) {
          setError("❌ O número de banheiros deve ser no mínimo 1");
          setTimeout(() => setError(""), 5000);
          return false;
        }
        if (formData.bathrooms > 10) {
          setError("❌ O número máximo de banheiros é 10");
          setTimeout(() => setError(""), 5000);
          return false;
        }
        return true;

      case 5: // Preço
        if (!formData.price_per_night || formData.price_per_night <= 0) {
          setError("❌ Informe o preço base por noite (valor maior que R$ 0)");
          setTimeout(() => setError(""), 5000);
          return false;
        }
        if (formData.price_per_night > 999999) {
          setError("❌ O preço por noite parece muito alto. Verifique o valor.");
          setTimeout(() => setError(""), 5000);
          return false;
        }
        if (formData.weekend_price && formData.weekend_price < 0) {
          setError("❌ O preço de final de semana não pode ser negativo");
          setTimeout(() => setError(""), 5000);
          return false;
        }
        if (formData.high_season_price && formData.high_season_price < 0) {
          setError("❌ O preço de alta temporada não pode ser negativo");
          setTimeout(() => setError(""), 5000);
          return false;
        }
        return true;

      case 6: // Fotos
        if (uploadedPhotos.length < 1) {
          setError("❌ Adicione pelo menos 1 foto do imóvel");
          setTimeout(() => setError(""), 5000);
          return false;
        }
        if (uploadedPhotos.length > 20) {
          setError("❌ Máximo de 20 fotos permitidas");
          setTimeout(() => setError(""), 5000);
          return false;
        }
        // Verificar se há foto principal
        const hasMainPhoto = uploadedPhotos.some(p => p.is_main);
        if (!hasMainPhoto) {
          setError("⚠️ Defina uma foto principal antes de continuar");
          setTimeout(() => setError(""), 5000);
          return false;
        }
        return true;

      case 4: // Comodidades (opcional - sempre válido)
      case 7: // Revisão (sempre válido)
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
      setError("");
    }
    // A mensagem de erro já é definida dentro do validateStep
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError("");
  };

  // Validação completa antes de submeter
  const validateForm = () => {
    // Validar todos os steps críticos
    const validations = [
      { step: 1, name: "Informações Básicas" },
      { step: 2, name: "Localização" },
      { step: 3, name: "Detalhes do Imóvel" },
      { step: 5, name: "Preços" },
      { step: 6, name: "Fotos" },
    ];

    for (const validation of validations) {
      if (!validateStep(validation.step)) {
        setError(`❌ Erro na etapa "${validation.name}". Verifique os campos obrigatórios.`);
        setTimeout(() => setError(""), 8000);
        // Voltar para o step com erro
        setCurrentStep(validation.step);
        // Scroll para o topo para ver o erro
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
    }

    // Validação extra de segurança
    if (!uploadedPhotos.some(p => p.is_main)) {
      setError("❌ É necessário definir uma foto principal");
      setTimeout(() => setError(""), 5000);
      setCurrentStep(6);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Validar formulário completo antes de submeter
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      // Criar propriedade
      const propertyData = {
        ...formData,
        city_id: formData.city_id ? parseInt(formData.city_id) : null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        price_per_night: parseFloat(formData.price_per_night),
        weekend_price: formData.weekend_price ? parseFloat(formData.weekend_price) : null,
        high_season_price: formData.high_season_price ? parseFloat(formData.high_season_price) : null,
        max_guests: parseInt(formData.max_guests),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
      };

      console.log("📤 Dados sendo enviados para criar imóvel:", propertyData);
      console.log("📤 city_id:", propertyData.city_id, "tipo:", typeof propertyData.city_id);

      setSuccess("Criando imóvel...");
      const response = await api.post("/api/properties", propertyData);
      const createdProperty = response.data.property;

      // Upload das fotos se houver
      if (uploadedPhotos.length > 0) {
        setSuccess(`Imóvel criado! Enviando ${uploadedPhotos.length} foto(s)...`);

        const photosFormData = new FormData();
        photosFormData.append("property_uuid", createdProperty.uuid);

        // Adicionar arquivos ao FormData
        uploadedPhotos.forEach((photo) => {
          if (photo.file) {
            photosFormData.append("photos", photo.file);
          }
        });

        // Enviar índice da foto principal
        const mainPhotoIndex = uploadedPhotos.findIndex(p => p.is_main);
        if (mainPhotoIndex >= 0) {
          photosFormData.append("main_photo_index", mainPhotoIndex.toString());
        }

        try {
          await api.post("/api/uploads/properties", photosFormData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        } catch (uploadErr) {
          console.error("Erro ao fazer upload das fotos:", uploadErr);
          setError("⚠️ Imóvel criado, mas houve erro no upload das fotos. Você pode adicioná-las depois na edição do imóvel.");
          setTimeout(() => {
            navigate("/admin/properties");
          }, 4000);
          return;
        }
      }

      setSuccess("✅ Imóvel publicado com sucesso! Redirecionando...");
      setTimeout(() => {
        navigate("/admin/properties");
      }, 2000);
    } catch (err) {
      console.error("❌ Erro ao criar imóvel:", err);
      console.error("❌ Resposta do servidor:", err.response?.data);

      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Erro desconhecido ao criar imóvel";
      const errorDetails = err.response?.data?.details || "";

      setError(`❌ ${errorMessage}${errorDetails ? `: ${errorDetails}` : ""}. Verifique os dados e tente novamente.`);
      setTimeout(() => setError(""), 10000);

      // Se houver erro específico de validação do backend, voltar para step relevante
      if (err.response?.status === 400) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Renderizar conteúdo do step atual
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo formData={formData} handleInputChange={handleInputChange} user={user} />;
      case 2:
        return <Step2Location formData={formData} handleInputChange={handleInputChange} cities={cities} handleGeocodeAddress={handleGeocodeAddress} loading={loading} />;
      case 3:
        return <Step3Details formData={formData} handleInputChange={handleInputChange} />;
      case 4:
        return <Step4Amenities formData={formData} amenities={amenities} handleAmenityToggle={handleAmenityToggle} />;
      case 5:
        return <Step5Pricing formData={formData} handleInputChange={handleInputChange} />;
      case 6:
        return <Step6Photos uploadedPhotos={uploadedPhotos} handlePhotoUpload={handlePhotoUpload} setMainPhoto={setMainPhoto} removePhoto={removePhoto} loading={loading} />;
      case 7:
        return <Step7Review formData={formData} cities={cities} amenities={amenities} uploadedPhotos={uploadedPhotos} />;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      {/* Container principal com espaçamento adequado */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
        {/* Header fixo com sombra */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900">Cadastrar Novo Imóvel</h1>
                <p className="text-sm md:text-base text-gray-600 mt-1">Siga os passos para criar seu anúncio profissional</p>
              </div>
              <button
                onClick={() => navigate("/admin/properties")}
                className="flex items-center gap-2 px-3 md:px-4 py-2 text-airbnb-grey-600 hover:text-airbnb-black hover:bg-airbnb-grey-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Voltar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Steps - também sticky */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-[72px] md:top-[80px] z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className={`flex items-center gap-3 ${currentStep >= step.id ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      currentStep >= step.id
                        ? 'bg-rausch text-white shadow-lg scale-110'
                        : 'bg-airbnb-grey-200 text-airbnb-grey-600'
                    }`}>
                      {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                    </div>
                    <div className="hidden md:block">
                      <div className={`text-sm font-bold ${currentStep >= step.id ? 'text-airbnb-black' : 'text-airbnb-grey-400'}`}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                      currentStep > step.id ? 'bg-rausch' : 'bg-airbnb-grey-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content - espaçamento para não sobrepor header sticky */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 mt-4">
          {/* Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                ref={errorRef}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="mb-6 bg-red-50 border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-lg"
              >
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                  <span className="text-white text-xl font-bold">⚠️</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-base mb-1">Erro no Cadastro</p>
                  <p className="font-medium text-sm">{error}</p>
                </div>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="mb-6 bg-green-50 border-2 border-green-400 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-lg"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl font-bold">✓</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-base mb-1">Sucesso!</p>
                  <p className="font-medium text-sm">{success}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            {renderStepContent()}
          </motion.div>

          {/* Navigation Buttons - sticky footer */}
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 md:p-6 sticky bottom-4 z-10">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold transition-all duration-300 ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105 shadow-md hover:shadow-lg'
              }`}
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Voltar</span>
            </button>

            <div className="text-xs md:text-sm text-gray-600 font-semibold bg-gray-100 px-3 md:px-4 py-2 rounded-lg">
              Passo {currentStep} de {STEPS.length}
            </div>

            {currentStep < STEPS.length ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-4 md:px-8 py-2 md:py-3 bg-rausch text-white rounded-xl font-bold hover:bg-rausch-dark transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="hidden sm:inline">Próximo</span>
                <span className="sm:hidden">Avançar</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-4 md:px-8 py-2 md:py-3 bg-babu text-white rounded-xl font-bold hover:bg-babu-dark transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm md:text-base">Publicando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base">Publicar</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// ============================================
// STEP COMPONENTS
// ============================================

// Step 1: Basic Info
const Step1BasicInfo = ({ formData, handleInputChange, user }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Informações Básicas</h2>
      <p className="text-gray-600">Comece com o essencial do seu imóvel</p>
    </div>

    {/* Tipo de Imóvel */}
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-3">
        Tipo de Imóvel *
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(PROPERTY_TYPE_ICONS).map(([type, { icon: Icon, label }]) => (
          <button
            key={type}
            type="button"
            onClick={() => handleInputChange({ target: { name: 'type', value: type } })}
            className={`p-6 rounded-xl border-2 transition-all duration-300 ${
              formData.type === type
                ? 'border-rausch bg-rausch/5 shadow-lg scale-105'
                : 'border-airbnb-grey-200 hover:border-airbnb-grey-300 hover:shadow-md'
            }`}
          >
            <Icon className={`w-10 h-10 mx-auto mb-3 ${formData.type === type ? 'text-rausch' : 'text-airbnb-grey-400'}`} />
            <p className={`text-sm font-bold ${formData.type === type ? 'text-rausch' : 'text-airbnb-grey-600'}`}>
              {label}
            </p>
          </button>
        ))}
      </div>
    </div>

    {/* Título */}
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        Título do Anúncio *
      </label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        placeholder="Ex: Apartamento Luxuoso com Vista para o Mar"
        className="w-full px-4 py-3 border border-airbnb-grey-300 rounded-xl focus:ring-2 focus:ring-rausch focus:border-transparent transition-all"
        maxLength={200}
      />
      <p className="text-sm text-gray-500 mt-1">{formData.title.length}/200 caracteres</p>
    </div>

    {/* Descrição */}
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        Descrição Detalhada
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Descreva seu imóvel de forma atrativa. Destaque os diferenciais, localização, vista, acabamentos, etc."
        rows={6}
        className="w-full px-4 py-3 border border-airbnb-grey-300 rounded-xl focus:ring-2 focus:ring-rausch focus:border-transparent transition-all resize-none"
      />
      <p className="text-sm text-gray-500 mt-1">Uma boa descrição aumenta em 40% as chances de reserva</p>
    </div>

    {/* Status e Destaque */}
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-airbnb-grey-300 rounded-xl focus:ring-2 focus:ring-rausch focus:border-transparent"
        >
          <option value="available">Disponível</option>
          <option value="occupied">Ocupado</option>
          <option value="maintenance">Manutenção</option>
          <option value="inactive">Inativo</option>
        </select>
      </div>

      {/* Destaque - Apenas Admin Master */}
      {user?.role === 'admin_master' && (
        <div className="flex items-center justify-center">
          <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border-2 border-dashed border-yellow-400 bg-yellow-50 hover:bg-yellow-100 transition-all">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleInputChange}
              className="w-5 h-5 text-rausch rounded focus:ring-rausch"
            />
            <div>
              <p className="font-bold text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                Imóvel em Destaque
              </p>
              <p className="text-xs text-gray-600">Apenas admin master - Aparece na home do site</p>
            </div>
          </label>
        </div>
      )}
    </div>
  </div>
);

export default AdminNewPropertyAirbnb;
