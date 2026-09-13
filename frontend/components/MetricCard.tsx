import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: "positive" | "negative" | "neutral";
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  trend = "neutral",
}) => {
  let trendColor = "text-gray-900";
  if (trend === "positive") trendColor = "text-emerald-600";
  if (trend === "negative") trendColor = "text-rose-600";

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
      <div className="mt-2">
        <p className={`text-2xl font-extrabold ${trendColor}`}>{value}</p>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
      </div>
    </div>
  );
};
