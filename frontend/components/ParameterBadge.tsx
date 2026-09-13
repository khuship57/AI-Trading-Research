import React from "react";
import { ParameterStatus } from "@/lib/types";

interface ParameterBadgeProps {
  status: ParameterStatus;
  className?: string;
}

export const ParameterBadge: React.FC<ParameterBadgeProps> = ({ status, className = "" }) => {
  const normalizedStatus = (status || "").toLowerCase();

  let styles = "bg-gray-100 text-gray-700 border-gray-200";
  let label = status?.toUpperCase() || "UNKNOWN";

  switch (normalizedStatus) {
    case "explicit":
      styles = "bg-blue-50 text-blue-700 border-blue-200 font-semibold";
      label = "EXPLICIT";
      break;
    case "inferred":
      styles = "bg-purple-50 text-purple-700 border-purple-200 font-semibold";
      label = "INFERRED";
      break;
    case "proposed":
      styles = "bg-amber-50 text-amber-800 border-amber-300 font-semibold";
      label = "PROPOSED ASSUMPTION";
      break;
    case "user_confirmed":
      styles = "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold";
      label = "USER CONFIRMED";
      break;
    case "missing":
      styles = "bg-rose-50 text-rose-700 border-rose-200 font-semibold";
      label = "MISSING";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border tracking-wide uppercase ${styles} ${className}`}
    >
      {label}
    </span>
  );
};
