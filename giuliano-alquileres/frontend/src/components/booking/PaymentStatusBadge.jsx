import {
  FaClock, FaCheckCircle, FaExclamationTriangle,
  FaTimesCircle, FaUndo
} from "react-icons/fa";

const PaymentStatusBadge = ({ status, size = "md", showIcon = true }) => {
  const statusConfig = {
    pending: {
      label: "Pendente",
      icon: FaClock,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-300",
    },
    paid: {
      label: "Pago",
      icon: FaCheckCircle,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-300",
    },
    failed: {
      label: "Falhou",
      icon: FaTimesCircle,
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-300",
    },
    refunded: {
      label: "Reembolsado",
      icon: FaUndo,
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
      borderColor: "border-purple-300",
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

export default PaymentStatusBadge;
