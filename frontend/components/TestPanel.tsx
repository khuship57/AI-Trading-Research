import React from "react";
import { BacktestResult } from "@/lib/types";
import { MetricCard } from "./MetricCard";
import { ArrowRight, BarChart3, AlertTriangle, CheckCircle } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

interface TestPanelProps {
  result: BacktestResult;
  onProceedToLearn: () => void;
  isLoading: boolean;
}

export const TestPanel: React.FC<TestPanelProps> = ({
  result,
  onProceedToLearn,
  isLoading,
}) => {
  // Format trade data for Recharts visualization
  const chartData = result.trades.slice(0, 50).map((t, idx) => ({
    trade: `#${idx + 1}`,
    date: t.entry_date,
    netReturn: t.net_return_pct,
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">STAGE 4 — Deterministic Backtest Results</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Source: <span className="font-semibold text-gray-700">{result.dataset_label}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onProceedToLearn}
          disabled={isLoading}
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all space-x-2"
        >
          {isLoading ? (
            <span>Generating Learning Synthesis...</span>
          ) : (
            <>
              <span>Synthesize Learnings</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Matched Signal Events"
          value={result.number_of_events}
          subtext="Qualifying T-day drop events"
        />
        <MetricCard
          label="Average Forward Return"
          value={`${result.average_forward_return_pct >= 0 ? "+" : ""}${result.average_forward_return_pct}%`}
          trend={result.average_forward_return_pct > 0 ? "positive" : result.average_forward_return_pct < 0 ? "negative" : "neutral"}
          subtext="Net of 0.10% fee + 0.05% slippage"
        />
        <MetricCard
          label="Observed Win Rate"
          value={`${result.win_rate_pct}%`}
          trend={result.win_rate_pct >= 50 ? "positive" : "negative"}
          subtext={`Median return: ${result.median_forward_return_pct}%`}
        />
        <MetricCard
          label="Best / Worst Trade"
          value={`+${result.best_trade_pct}% / ${result.worst_trade_pct}%`}
          subtext={`Std Dev: ${result.standard_deviation_pct}%`}
        />
      </div>

      {/* Chart Section */}
      {chartData.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Trade-by-Trade Net Forward Returns (%)</h3>
            <span className="text-xs text-gray-400">Showing first {chartData.length} events</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="trade" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} unit="%" />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, "Net Return"]}
                  labelFormatter={(label, items) => {
                    const item = items[0]?.payload;
                    return item ? `Trade ${label} (${item.date})` : label;
                  }}
                />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Bar
                  dataKey="netReturn"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Assumptions & Warnings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
          <div className="flex items-center space-x-2 text-emerald-700 mb-3">
            <CheckCircle className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Methodology & Assumptions</h4>
          </div>
          <ul className="space-y-2 text-xs text-gray-600">
            {result.assumptions_applied.map((asm, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{asm}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200">
          <div className="flex items-center space-x-2 text-amber-800 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Prototype Warnings</h4>
          </div>
          <ul className="space-y-2 text-xs text-amber-900">
            {result.warnings.map((wrn, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>{wrn}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
