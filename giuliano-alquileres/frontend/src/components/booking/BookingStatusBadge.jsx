import {
  FaClock, FaCheckCircle, FaHourglass, FaTimesCircle,
  FaSpinner, FaBan
} from "react-icons/fa";

const BookingStatusBadge = ({ status, size = "md", showIcon = true }) => {
  const statusConfig = {
    pending: {
      label: "Aguardando",
      icon: FaClock,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-300",
    },
    confirmed: {
      label: "Confirmada",
      icon: FaCheckCircle,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-300",
    },
    in_progress: {
      label: "Em Andamento",
      icon: FaHourglass,
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      borderColor: "border-blue-300",
    },
    completed: {
      label: "Concluída",
      icon: FaCheckCircle,
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
      borderColor: "border-gray-300",
    },
    cancelled: {
      label: "Cancelada",
      icon: FaBan,
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-300",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const iconSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 font-semibold rounded-full border-2 ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{config.label}</span>
    </span>
  );
};

export default BookingStatusBadge;
