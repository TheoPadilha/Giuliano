import React from "react";
import { FaWhatsapp } from "react-icons/fa";

// Número de telefone para contato (substituir pelo número real)
const WHATSAPP_NUMBER = "5547999951103"; // Giuliano Lorensatto Ferreira (Contratante)
const DEFAULT_MESSAGE = encodeURIComponent(
  "Olá, gostaria de mais informações sobre o ZigAluga."
);

const WhatsAppButton = ({ message = DEFAULT_MESSAGE }) => {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110 flex items-center justify-center animate-fade-in"
      aria-label="Fale conosco pelo WhatsApp"
    >
      <FaWhatsapp className="w-8 h-8" />
    </a>
  );
};

export default WhatsAppButton;
