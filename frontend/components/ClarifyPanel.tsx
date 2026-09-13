import React, { useState } from "react";
import { ExperimentAnalysis } from "@/lib/types";
import { ParameterBadge } from "./ParameterBadge";
import { HelpCircle, ArrowRight, CheckCircle2 } from "lucide-react";

interface ClarifyPanelProps {
  analysis: ExperimentAnalysis;
  onFinalize: (clarifications: Record<string, any>) => void;
  isLoading: boolean;
}

export const ClarifyPanel: React.FC<ClarifyPanelProps> = ({
  analysis,
  onFinalize,
  isLoading,
}) => {
  // Initialize choices with recommended values
  const initialChoices: Record<string, string> = {};
  analysis.clarification_questions.forEach((q) => {
    initialChoices[q.field] = q.recommended_value;
  });

  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>(initialChoices);

  const handleOptionSelect = (field: string, value: string) => {
    setSelectedChoices((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onFinalize(selectedChoices);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Overview header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-2">STAGE 2 — Clarify Missing Parameters</h2>
        <p className="text-sm text-gray-600">
          Question: <span className="font-semibold text-gray-900">"{analysis.original_question}"</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">{analysis.interpreted_goal}</p>
      </div>

      {/* What we understood */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
          What the System Understood:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(analysis.parameters).map(([key, param]) => (
            <div key={key} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">{key.replace(/_/g, " ")}</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  {param.value === null ? "Not specified" : String(param.value)}
                </p>
              </div>
              <ParameterBadge status={param.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Clarification questions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-amber-600" />
          <h3 className="text-base font-bold text-gray-900">
            Interactive Clarifications Required ({analysis.clarification_questions.length})
          </h3>
        </div>

        <div className="space-y-6">
          {analysis.clarification_questions.map((q) => {
            const currentChoice = selectedChoices[q.field] || q.recommended_value;

            return (
              <div key={q.id} className="p-5 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-900">{q.question}</h4>
                    <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      PROPOSED ASSUMPTION: {q.recommended_value}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{q.why_it_matters}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {q.options.map((opt) => {
                    const isSelected = currentChoice === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleOptionSelect(q.field, opt)}
                        className={`p-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleSubmit}
            className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all space-x-2"
          >
            {isLoading ? (
              <span>Finalizing Experiment...</span>
            ) : (
              <>
                <span>Confirm & Build Experiment</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
