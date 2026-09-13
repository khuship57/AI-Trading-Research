import React from "react";
import { CheckCircle2 } from "lucide-react";

interface ProgressStepperProps {
  currentStage: number; // 1 to 5
  onStageClick?: (stage: number) => void;
}

const STAGES = [
  { id: 1, label: "Ask", description: "Research Question" },
  { id: 2, label: "Clarify", description: "Missing Parameters" },
  { id: 3, label: "Define", description: "Experiment Card" },
  { id: 4, label: "Test", description: "Pandas Backtest" },
  { id: 5, label: "Learn", description: "Research Findings" },
];

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  currentStage,
  onStageClick,
}) => {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-8">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {STAGES.map((stage, idx) => {
          const isCompleted = currentStage > stage.id;
          const isCurrent = currentStage === stage.id;
          const isClickable = onStageClick && stage.id <= currentStage;

          return (
            <React.Fragment key={stage.id}>
              <button
                disabled={!isClickable}
                onClick={() => onStageClick && isClickable && onStageClick(stage.id)}
                className={`flex items-center space-x-3 transition-all ${
                  isClickable ? "cursor-pointer hover:opacity-80" : "cursor-default"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    isCompleted
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <span>{stage.id}</span>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p
                    className={`text-sm font-semibold leading-none ${
                      isCurrent
                        ? "text-blue-600"
                        : isCompleted
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {stage.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{stage.description}</p>
                </div>
              </button>

              {idx < STAGES.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 md:mx-4 transition-colors ${
                    currentStage > stage.id ? "bg-emerald-500" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
