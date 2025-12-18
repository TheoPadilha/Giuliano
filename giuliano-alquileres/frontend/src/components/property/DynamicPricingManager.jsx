import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit, FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import api from "../../services/api";

const DynamicPricingManager = ({ propertyUuid, basePrice }) => {
  const [pricings, setPricings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPricing, setEditingPricing] = useState(null);
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    price_per_night: "",
    description: "",
    priority: 0,
  });

  useEffect(() => {
    if (propertyUuid) {
      fetchPricings();
    }
  }, [propertyUuid]);

  const fetchPricings = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/properties/${propertyUuid}/pricing`);
      setPricings(response.data.pricings || []);
    } catch (error) {
      console.error("Erro ao buscar preços:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editingPricing) {
        // Atualizar preço existente
        await api.put(
          `/api/properties/${propertyUuid}/pricing/${editingPricing.uuid}`,
          formData
        );
      } else {
        // Criar novo preço
        await api.post(`/api/properties/${propertyUuid}/pricing`, formData);
      }

      // Resetar formulário
      setFormData({
        start_date: "",
        end_date: "",
        price_per_night: "",
        description: "",
        priority: 0,
      });
      setShowForm(false);
      setEditingPricing(null);

      // Recarregar lista
      await fetchPricings();
    } catch (error) {
      console.error("Erro ao salvar preço:", error);
      alert(error.response?.data?.error || "Erro ao salvar preço dinâmico");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pricing) => {
    setEditingPricing(pricing);
    setFormData({
      start_date: pricing.start_date,
      end_date: pricing.end_date,
      price_per_night: pricing.price_per_night,
      description: pricing.description || "",
      priority: pricing.priority || 0,
    });
    setShowForm(true);
  };

  const handleDelete = async (pricingUuid) => {
    if (!window.confirm("Deseja realmente excluir este preço dinâmico?")) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/api/properties/${propertyUuid}/pricing/${pricingUuid}`);
      await fetchPricings();
    } catch (error) {
      console.error("Erro ao deletar preço:", error);
      alert(error.response?.data?.error || "Erro ao deletar preço dinâmico");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPricing(null);
    setFormData({
      start_date: "",
      end_date: "",
      price_per_night: "",
      description: "",
      priority: 0,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString + 'T12:00:00').toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-airbnb-black">
            Preços Dinâmicos
          </h3>
          <p className="text-sm text-airbnb-grey-600 mt-1">
            Defina preços diferentes para períodos específicos (feriados, alta temporada, etc.)
          </p>
          <p className="text-sm text-airbnb-grey-500 mt-1">
            Preço base: <span className="font-semibold text-rausch">{formatCurrency(basePrice)}</span>/noite
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
            disabled={!propertyUuid}
          >
            <FaPlus />
            <span>Adicionar Período</span>
          </button>
        )}
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="card p-6 bg-airbnb-grey-50">
          <h4 className="text-lg font-semibold text-airbnb-black mb-4">
            {editingPricing ? "Editar Período" : "Novo Período de Preço"}
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data Início */}
              <div>
                <label className="block text-sm font-medium text-airbnb-grey-700 mb-2">
                  Data Início *
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  className="input"
                  required
                />
              </div>

              {/* Data Fim */}
              <div>
                <label className="block text-sm font-medium text-airbnb-grey-700 mb-2">
                  Data Fim *
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  className="input"
                  required
                  min={formData.start_date}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Preço */}
              <div>
                <label className="block text-sm font-medium text-airbnb-grey-700 mb-2">
                  Preço por Noite (R$) *
                </label>
                <div className="relative">
                  <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-airbnb-grey-500" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price_per_night}
                    onChange={(e) =>
                      setFormData({ ...formData, price_per_night: e.target.value })
                    }
                    className="input pl-10"
                    placeholder="Ex: 500.00"
                    required
                  />
                </div>
              </div>

              {/* Prioridade */}
              <div>
                <label className="block text-sm font-medium text-airbnb-grey-700 mb-2">
                  Prioridade (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: parseInt(e.target.value) })
                  }
                  className="input"
                  placeholder="0"
                />
                <p className="text-xs text-airbnb-grey-500 mt-1">
                  Maior prioridade sobrescreve períodos sobrepostos
                </p>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-airbnb-grey-700 mb-2">
                Descrição
              </label>
              <input
                type="text"
                maxLength={100}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input"
                placeholder="Ex: Réveillon 2025, Carnaval, Alta Temporada..."
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {editingPricing ? "Atualizar" : "Adicionar"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Preços */}
      {loading && pricings.length === 0 ? (
        <div className="text-center py-8 text-airbnb-grey-500">
          Carregando preços...
        </div>
      ) : pricings.length === 0 ? (
        <div className="card p-8 text-center border-2 border-dashed border-airbnb-grey-200">
          <FaCalendarAlt className="text-4xl text-airbnb-grey-400 mx-auto mb-3" />
          <p className="text-airbnb-grey-600 font-medium">
            Nenhum período de preço dinâmico configurado
          </p>
          <p className="text-sm text-airbnb-grey-500 mt-1">
            O preço base de {formatCurrency(basePrice)}/noite será usado para todas as datas
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pricings.map((pricing) => (
            <div
              key={pricing.id}
              className="card p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FaCalendarAlt className="text-rausch" />
                    <span className="font-semibold text-airbnb-black">
                      {formatDate(pricing.start_date)} até {formatDate(pricing.end_date)}
                    </span>
                    {pricing.priority > 0 && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-semibold">
                        Prioridade {pricing.priority}
                      </span>
                    )}
                  </div>

                  {pricing.description && (
                    <p className="text-sm text-airbnb-grey-600 mb-2">
                      {pricing.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-rausch">
                      {formatCurrency(pricing.price_per_night)}
                    </span>
                    <span className="text-sm text-airbnb-grey-500">/noite</span>

                    {parseFloat(pricing.price_per_night) > parseFloat(basePrice) && (
                      <span className="text-xs text-green-600 font-semibold">
                        +{formatCurrency(parseFloat(pricing.price_per_night) - parseFloat(basePrice))} vs base
                      </span>
                    )}
                    {parseFloat(pricing.price_per_night) < parseFloat(basePrice) && (
                      <span className="text-xs text-red-600 font-semibold">
                        {formatCurrency(parseFloat(pricing.price_per_night) - parseFloat(basePrice))} vs base
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(pricing)}
                    className="btn-secondary !p-2"
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(pricing.uuid)}
                    className="btn-secondary !p-2 !text-red-600 hover:!bg-red-50"
                    title="Excluir"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicPricingManager;
