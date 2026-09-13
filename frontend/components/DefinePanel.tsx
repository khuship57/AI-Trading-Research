import React from "react";
import { ResearchExperiment } from "@/lib/types";
import { ParameterBadge } from "./ParameterBadge";
import { FlaskConical, Play, FileText } from "lucide-react";

interface DefinePanelProps {
  experiment: ResearchExperiment;
  onRunTest: () => void;
  isLoading: boolean;
}

export const DefinePanel: React.FC<DefinePanelProps> = ({
  experiment,
  onRunTest,
  isLoading,
}) => {
  const paramFields = [
    { label: "Target Market / Index", key: "instrument", obj: experiment.instrument },
    { label: "Data Frequency", key: "timeframe", obj: experiment.timeframe },
    { label: "Decline Threshold (Signal)", key: "fall_threshold", obj: experiment.fall_threshold },
    { label: "Execution Entry Timing", key: "entry_timing", obj: experiment.entry_timing },
    { label: "Exit Rule Type", key: "exit_type", obj: experiment.exit_type },
    { label: "Position Holding Duration", key: "holding_period", obj: experiment.holding_period },
    { label: "Backtest Start Date", key: "test_start", obj: experiment.test_start },
    { label: "Backtest End Date", key: "test_end", obj: experiment.test_end },
    { label: "Brokerage & Transaction Cost", key: "transaction_cost", obj: experiment.transaction_cost },
    { label: "Execution Slippage", key: "slippage", obj: experiment.slippage },
    { label: "Secondary Filters", key: "filters", obj: experiment.filters },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">STAGE 3 — Research Experiment Specification</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Original question: <span className="font-semibold text-gray-800">"{experiment.original_question}"</span>
            </p>
          </div>
        </div>

        <button
          onClick={onRunTest}
          disabled={isLoading}
          className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all space-x-2"
        >
          {isLoading ? (
            <span>Running Backtest...</span>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Run Backtest</span>
            </>
          )}
        </button>
      </div>

      {/* Hypothesis Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <div className="flex items-start space-x-3">
          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">Formal Research Hypothesis</h4>
            <p className="text-sm font-medium text-blue-800 mt-1">
              "{experiment.hypothesis}"
            </p>
          </div>
        </div>
      </div>

      {/* Parameters grid with Provenance Badges */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">
          Experiment Parameters & Provenance Log:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paramFields.map((item) => (
            <div key={item.key} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">{item.label}</p>
                <p className="text-sm font-bold text-gray-900 mt-1">
                  {String(item.obj.value)}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{item.obj.reason}</p>
              </div>
              <ParameterBadge status={item.obj.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
