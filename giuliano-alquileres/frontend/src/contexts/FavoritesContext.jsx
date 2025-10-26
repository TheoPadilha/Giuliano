// FavoritesContext.jsx - Contexto para gerenciar favoritos
import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    // Carregar favoritos do localStorage ao iniciar
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Salvar favoritos no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Verificar se uma propriedade é favorita
  const isFavorite = (propertyId) => {
    return favorites.some(
      (fav) => fav.id === propertyId || fav.uuid === propertyId
    );
  };

  // Adicionar ou remover favorito
  const toggleFavorite = (property) => {
    const propertyId = property.uuid || property.id;

    if (isFavorite(propertyId)) {
      // Remover dos favoritos
      setFavorites((prev) =>
        prev.filter((fav) => fav.id !== propertyId && fav.uuid !== propertyId)
      );
    } else {
      // Adicionar aos favoritos
      setFavorites((prev) => [...prev, property]);
    }
  };

  // Limpar todos os favoritos
  const clearFavorites = () => {
    setFavorites([]);
  };

  const value = {
    favorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;
