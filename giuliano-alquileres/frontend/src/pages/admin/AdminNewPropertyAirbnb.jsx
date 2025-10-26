// AdminNewPropertyAirbnb.jsx - VERSÃO ULTRA PROFISSIONAL ESTILO AIRBNB
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../../components/admin/AdminLayout";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaHome,
  FaMapMarkerAlt,
  FaDollarSign,
  FaImages,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
  FaBed,
  FaBath,
  FaUsers,
  FaMapPin,
  FaStar,
  FaWifi,
  FaParking,
  FaSwimmingPool,
  FaTv,
  FaSnowflake,
  FaShieldAlt,
  FaDumbbell,
  FaCocktail,
  FaBuilding,
  FaCrown,
  FaGem,
  FaHouseUser,
  FaSearch,
  FaPlus,
  FaTrash,
  FaEye
} from "react-icons/fa";

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
  { id: 1, title: "Tipo e Básico", icon: FaHome, description: "Informações principais" },
  { id: 2, title: "Localização", icon: FaMapMarkerAlt, description: "Endereço e mapa" },
  { id: 3, title: "Detalhes", icon: FaBed, description: "Quartos, banheiros e capacidade" },
  { id: 4, title: "Comodidades", icon: FaStar, description: "Amenidades do imóvel" },
  { id: 5, title: "Preços", icon: FaDollarSign, description: "Valores e temporadas" },
  { id: 6, title: "Fotos", icon: FaImages, description: "Imagens do imóvel" },
  { id: 7, title: "Revisão", icon: FaCheckCircle, description: "Confirmar e publicar" }
];

// Ícones para tipos de propriedade
const PROPERTY_TYPE_ICONS = {
  apartment: { icon: FaBuilding, label: "Apartamento", color: "blue" },
  house: { icon: FaHouseUser, label: "Casa", color: "green" },
  penthouse: { icon: FaCrown, label: "Cobertura", color: "purple" },
  studio: { icon: FaGem, label: "Studio", color: "pink" }
};

// Ícones para amenidades
const AMENITY_ICONS = {
  wifi: FaWifi,
  parking: FaParking,
  pool: FaSwimmingPool,
  tv: FaTv,
  ac: FaSnowflake,
  security: FaShieldAlt,
  gym: FaDumbbell,
  bar: FaCocktail
};

const AdminNewPropertyAirbnb = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  // Carregar cidades e amenidades
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesRes, amenitiesRes] = await Promise.all([
          api.get("/api/utilities/cities"),
          api.get("/api/utilities/amenities"),
        ]);
        setCities(citiesRes.data.cities || []);
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

  // Geocodificação com Google Maps API
  const handleGeocodeAddress = async () => {
    if (!formData.address || !formData.city_id) {
      setError("Preencha o endereço e selecione a cidade primeiro");
      return;
    }

    const selectedCity = cities.find(c => c.id === parseInt(formData.city_id));
    if (!selectedCity) return;

    const fullAddress = `${formData.address}, ${selectedCity.name}, ${selectedCity.state}, Brasil`;

    try {
      // Simulação - você precisará adicionar a Google Maps API key
      // const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=YOUR_API_KEY`);
      // const data = await response.json();

      // Por enquanto, coordenadas simuladas
      setFormData(prev => ({
        ...prev,
        latitude: "-26.9944",
        longitude: "-48.6386"
      }));

      setSuccess("Localização encontrada no mapa!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Erro ao buscar coordenadas:", err);
      setError("Erro ao buscar localização. Insira manualmente.");
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formDataPhotos = new FormData();
    files.forEach(file => formDataPhotos.append("photos", file));

    try {
      setLoading(true);
      // Aqui você faria o upload real
      // const response = await api.post("/api/uploads/property-photos", formDataPhotos);

      // Simulação
      const mockPhotos = files.map((file, index) => ({
        id: Date.now() + index,
        url: URL.createObjectURL(file),
        is_main: uploadedPhotos.length === 0 && index === 0
      }));

      setUploadedPhotos(prev => [...prev, ...mockPhotos]);
      setSuccess(`${files.length} foto(s) adicionada(s)!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Erro ao fazer upload das fotos");
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
    switch (step) {
      case 1:
        return formData.title.length >= 5 && formData.type;
      case 2:
        return formData.city_id && formData.address.length >= 5;
      case 3:
        return formData.max_guests >= 1 && formData.bedrooms >= 0 && formData.bathrooms >= 1;
      case 5:
        return formData.price_per_night > 0;
      case 6:
        return uploadedPhotos.length >= 1;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
      setError("");
    } else {
      setError("Por favor, preencha todos os campos obrigatórios desta etapa");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError("");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      // Criar propriedade
      const propertyData = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        price_per_night: parseFloat(formData.price_per_night),
        weekend_price: formData.weekend_price ? parseFloat(formData.weekend_price) : null,
        high_season_price: formData.high_season_price ? parseFloat(formData.high_season_price) : null,
      };

      const response = await api.post("/api/properties", propertyData);
      const createdProperty = response.data.property;

      setSuccess("Imóvel criado com sucesso!");
      setTimeout(() => {
        navigate("/admin/properties");
      }, 2000);
    } catch (err) {
      console.error("Erro ao criar imóvel:", err);
      setError(err.response?.data?.message || "Erro ao criar imóvel");
    } finally {
      setLoading(false);
    }
  };

  // Renderizar conteúdo do step atual
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo formData={formData} handleInputChange={handleInputChange} />;
      case 2:
        return <Step2Location formData={formData} handleInputChange={handleInputChange} cities={cities} handleGeocodeAddress={handleGeocodeAddress} />;
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-gray-900">Cadastrar Novo Imóvel</h1>
                <p className="text-gray-600 mt-1">Siga os passos para criar seu anúncio profissional</p>
              </div>
              <button
                onClick={() => navigate("/admin/properties")}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft />
                <span>Voltar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white border-b border-gray-200 sticky top-[88px] z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className={`flex items-center gap-3 ${currentStep >= step.id ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      currentStep >= step.id
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {currentStep > step.id ? <FaCheckCircle /> : step.id}
                    </div>
                    <div className="hidden md:block">
                      <div className={`text-sm font-bold ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                      currentStep > step.id ? 'bg-red-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0">
                  ⚠️
                </div>
                <p className="font-medium">{error}</p>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <p className="font-medium">{success}</p>
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

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-xl p-6 sticky bottom-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
              }`}
            >
              <FaArrowLeft />
              <span>Voltar</span>
            </button>

            <div className="text-sm text-gray-600 font-medium">
              Passo {currentStep} de {STEPS.length}
            </div>

            {currentStep < STEPS.length ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>Próximo</span>
                <FaArrowRight />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publicando...</span>
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    <span>Publicar Imóvel</span>
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
const Step1BasicInfo = ({ formData, handleInputChange }) => (
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
        {Object.entries(PROPERTY_TYPE_ICONS).map(([type, { icon: Icon, label, color }]) => (
          <button
            key={type}
            type="button"
            onClick={() => handleInputChange({ target: { name: 'type', value: type } })}
            className={`p-6 rounded-xl border-2 transition-all duration-300 ${
              formData.type === type
                ? 'border-red-600 bg-red-50 shadow-lg scale-105'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <Icon className={`text-4xl mx-auto mb-3 ${formData.type === type ? 'text-red-600' : 'text-gray-400'}`} />
            <p className={`text-sm font-bold ${formData.type === type ? 'text-red-600' : 'text-gray-600'}`}>
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
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
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
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
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
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          <option value="available">Disponível</option>
          <option value="occupied">Ocupado</option>
          <option value="maintenance">Manutenção</option>
          <option value="inactive">Inativo</option>
        </select>
      </div>

      <div className="flex items-center justify-center">
        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border-2 border-dashed border-yellow-400 bg-yellow-50 hover:bg-yellow-100 transition-all">
          <input
            type="checkbox"
            name="is_featured"
            checked={formData.is_featured}
            onChange={handleInputChange}
            className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
          />
          <div>
            <p className="font-bold text-gray-900 flex items-center gap-2">
              <FaStar className="text-yellow-500" />
              Imóvel em Destaque
            </p>
            <p className="text-xs text-gray-600">Aparece na home do site</p>
          </div>
        </label>
      </div>
    </div>
  </div>
);

export default AdminNewPropertyAirbnb;
