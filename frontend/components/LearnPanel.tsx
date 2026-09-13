import React from "react";
import { LearningResult } from "@/lib/types";
import {
  GraduationCap,
  CheckCircle2,
  TrendingUp,
  AlertOctagon,
  Compass,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";

interface LearnPanelProps {
  learning: LearningResult;
  onReset: () => void;
}

export const LearnPanel: React.FC<LearnPanelProps> = ({ learning, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">STAGE 5 — Research Learnings & Synthesis</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Structured research breakdown separating factual evidence from conclusions and limitations.
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-all space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Research Question</span>
        </button>
      </div>

      {/* 4 Core Sections */}
      <div className="grid grid-cols-1 gap-6">
        {/* SECTION A */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm border-l-4 border-l-blue-600">
          <div className="flex items-center space-x-2 text-blue-600 mb-4">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Section A: What the Data Shows (Factual Calculated Results)
            </h3>
          </div>
          <ul className="space-y-3">
            {learning.data_shows.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-sm text-gray-800">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* SECTION B */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm border-l-4 border-l-emerald-600">
          <div className="flex items-center space-x-2 text-emerald-600 mb-4">
            <TrendingUp className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Section B: What We Can Reasonably Conclude
            </h3>
          </div>
          <ul className="space-y-3">
            {learning.reasonable_conclusion.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-sm text-gray-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* SECTION C */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm border-l-4 border-l-amber-500">
          <div className="flex items-center space-x-2 text-amber-600 mb-4">
            <AlertOctagon className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Section C: Research Limitations & Risks
            </h3>
          </div>
          <ul className="space-y-3">
            {learning.limitations.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-sm text-gray-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* SECTION D */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm border-l-4 border-l-purple-600">
          <div className="flex items-center space-x-2 text-purple-600 mb-4">
            <Compass className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Section D: What Should We Investigate Next?
            </h3>
          </div>
          <ul className="space-y-3">
            {learning.next_questions.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-sm text-gray-800">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-gray-100 border border-gray-200 rounded-2xl p-4 flex items-center space-x-3">
        <ShieldAlert className="w-5 h-5 text-gray-500 shrink-0" />
        <p className="text-xs text-gray-600">
          <span className="font-bold">Research Disclaimer:</span> {learning.disclaimer}
        </p>
      </div>
    </div>
  );
};
