import React, { useState } from "react";
import { Sparkles, ArrowRight, Lightbulb } from "lucide-react";

interface AskPanelProps {
  onAnalyze: (question: string) => void;
  isLoading: boolean;
}

const SAMPLE_QUESTIONS = [
  "Does buying NIFTY after a sharp fall work?",
  "Does buying NIFTY 50 after a 3% single-day decline generate positive 5-day returns?",
  "What happens if we buy NIFTY after a 2% drop and hold for 10 days?"
];

export const AskPanel: React.FC<AskPanelProps> = ({ onAnalyze, isLoading }) => {
  const [question, setQuestion] = useState("Does buying NIFTY after a sharp fall work?");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim().length >= 3 && !isLoading) {
      onAnalyze(question.trim());
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">STAGE 1 — Ask Your Research Question</h2>
          <p className="text-sm text-gray-500">
            Enter an ambiguous trading concept to decompose it into structured research parameters.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-semibold text-gray-700 mb-2">
            Natural Language Market Question
          </label>
          <textarea
            id="question"
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Does buying NIFTY after a sharp fall work?"
            className="w-full p-4 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base shadow-sm"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center text-xs text-gray-500 space-x-1">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>AI will analyze intent without inventing silent parameters.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || question.trim().length < 3}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-sm rounded-xl shadow-sm transition-all space-x-2"
          >
            {isLoading ? (
              <span>Analyzing Intent...</span>
            ) : (
              <>
                <span>Analyze Question</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Or try an example question:
        </p>
        <div className="space-y-2">
          {SAMPLE_QUESTIONS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setQuestion(sample)}
              className="w-full text-left p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 text-xs font-medium text-gray-700 transition-colors"
            >
              "{sample}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
