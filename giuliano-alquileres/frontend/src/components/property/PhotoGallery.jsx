// src/components/property/PhotoGallery.jsx

import { useState, useEffect } from "react";

const PhotoGallery = ({ photos = [], propertyTitle = "", className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  // Reset quando as fotos mudarem
  useEffect(() => {
    setCurrentIndex(0);
    setModalIndex(0);
    setImageErrors({});
  }, [photos]);

  // Navegação
  const nextPhoto = () => {
    if (photos.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const prevPhoto = () => {
    if (photos.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  const goToPhoto = (index) => {
    setCurrentIndex(index);
  };

  // Modal
  const openModal = (index) => {
    setModalIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const nextModalPhoto = () => {
    if (photos.length > 0) {
      setModalIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const prevModalPhoto = () => {
    if (photos.length > 0) {
      setModalIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  // Controles de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showModal) return;

      switch (e.key) {
        case "Escape":
          closeModal();
          break;
        case "ArrowLeft":
          prevModalPhoto();
          break;
        case "ArrowRight":
          nextModalPhoto();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  // Handle de erro da imagem
  const handleImageError = (photoId, isModal = false) => {
    setImageErrors((prev) => ({
      ...prev,
      [`${photoId}_${isModal ? "modal" : "main"}`]: true,
    }));
  };

  // URL da foto
  const getPhotoUrl = (photo) => {
    return `http://localhost:3001/uploads/properties/${photo.filename}`;
  };

  // Placeholder para imagem com erro
  const ImagePlaceholder = ({
    size = "large",
    className: imgClassName = "",
  }) => (
    <div
      className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${imgClassName}`}
    >
      <div className="text-center text-gray-400">
        <div className={`${size === "large" ? "text-6xl" : "text-2xl"} mb-2`}>
          🏠
        </div>
        <p className={`${size === "large" ? "text-lg" : "text-sm"}`}>
          {size === "large" ? "Imagem não disponível" : "Sem foto"}
        </p>
      </div>
    </div>
  );

  if (!photos || photos.length === 0) {
    return (
      <div
        className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}
      >
        <ImagePlaceholder size="large" className="h-96" />
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];

  return (
    <>
      {/* Galeria Principal */}
      <div
        className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}
      >
        {/* Foto Principal */}
        <div className="relative">
          <div className="aspect-w-16 aspect-h-9 bg-gray-200">
            {imageErrors[`${currentPhoto?.id}_main`] ? (
              <ImagePlaceholder size="large" className="w-full h-96" />
            ) : (
              <img
                src={getPhotoUrl(currentPhoto)}
                alt={currentPhoto?.alt_text || propertyTitle}
                className="w-full h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => openModal(currentIndex)}
                onError={() => handleImageError(currentPhoto.id, false)}
                loading="lazy"
              />
            )}
          </div>

          {/* Controles de Navegação */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-3 rounded-full transition-all duration-200 shadow-lg"
                title="Foto anterior"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-3 rounded-full transition-all duration-200 shadow-lg"
                title="Próxima foto"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Indicador de posição */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm font-medium">
                {currentIndex + 1} / {photos.length}
              </div>
            </>
          )}

          {/* Botão Expandir */}
          <button
            onClick={() => openModal(currentIndex)}
            className="absolute top-4 right-4 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition-all duration-200 shadow-lg"
            title="Ver em tamanho grande"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
          </button>
        </div>

        {/* Miniaturas */}
        {photos.length > 1 && (
          <div className="p-4 bg-gray-50">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => goToPhoto(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex
                      ? "border-blue-500 ring-2 ring-blue-200 shadow-lg"
                      : "border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
                  }`}
                  title={photo.alt_text || `Foto ${index + 1}`}
                >
                  {imageErrors[`${photo.id}_thumb`] ? (
                    <ImagePlaceholder size="small" className="w-full h-full" />
                  ) : (
                    <img
                      src={getPhotoUrl(photo)}
                      alt={photo.alt_text || `Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(photo.id, true)}
                      loading="lazy"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Visualização */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center p-4">
            {/* Botão Fechar */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200"
              title="Fechar (ESC)"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Foto no Modal */}
            <div className="relative max-w-full max-h-full">
              {imageErrors[`${photos[modalIndex]?.id}_modal`] ? (
                <div className="bg-gray-800 rounded-lg p-8">
                  <ImagePlaceholder size="large" className="w-96 h-64" />
                </div>
              ) : (
                <img
                  src={getPhotoUrl(photos[modalIndex])}
                  alt={photos[modalIndex]?.alt_text || propertyTitle}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  onError={() => handleImageError(photos[modalIndex].id, true)}
                />
              )}

              {/* Navegação no Modal */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevModalPhoto}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-4 rounded-full transition-all duration-200"
                    title="Foto anterior (←)"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={nextModalPhoto}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-4 rounded-full transition-all duration-200"
                    title="Próxima foto (→)"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Info da Foto no Modal */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-6 py-3 rounded-full">
                <div className="text-center">
                  <div className="text-lg font-medium">
                    {modalIndex + 1} de {photos.length}
                  </div>
                  {photos[modalIndex]?.alt_text && (
                    <div className="text-sm opacity-90 mt-1">
                      {photos[modalIndex].alt_text}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Miniaturas no Modal */}
            {photos.length > 1 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 max-w-full overflow-x-auto">
                <div className="flex space-x-2 px-4">
                  {photos.map((photo, index) => (
                    <button
                      key={photo.id}
                      onClick={() => setModalIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === modalIndex
                          ? "border-white ring-2 ring-white ring-opacity-50"
                          : "border-white border-opacity-30 hover:border-opacity-60"
                      }`}
                    >
                      <img
                        src={getPhotoUrl(photo)}
                        alt={photo.alt_text || `Foto ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Instruções de Navegação */}
            <div className="absolute top-6 left-6 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
              <div className="flex items-center space-x-4">
                <span>⌨️ Use as setas para navegar</span>
                <span>ESC para fechar</span>
              </div>
            </div>
          </div>

          {/* Overlay clicável para fechar */}
          <div className="absolute inset-0 -z-10" onClick={closeModal}></div>
        </div>
      )}
    </>
  );
};

export default PhotoGallery;
