"use client";

import React, { useState } from "react";
import { ProgressStepper } from "@/components/ProgressStepper";
import { AskPanel } from "@/components/AskPanel";
import { ClarifyPanel } from "@/components/ClarifyPanel";
import { DefinePanel } from "@/components/DefinePanel";
import { TestPanel } from "@/components/TestPanel";
import { LearnPanel } from "@/components/LearnPanel";

import {
  ExperimentAnalysis,
  ResearchExperiment,
  BacktestResult,
  LearningResult,
} from "@/lib/types";

import {
  analyzeQuestion,
  finalizeExperiment,
  runBacktest,
  explainResults,
} from "@/lib/api";

import { LineChart, AlertCircle } from "lucide-react";

export default function Home() {
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Workflow state across stages
  const [analysis, setAnalysis] = useState<ExperimentAnalysis | null>(null);
  const [experiment, setExperiment] = useState<ResearchExperiment | null>(null);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [learningResult, setLearningResult] = useState<LearningResult | null>(null);

  // STAGE 1: ASK -> ANALYZE
  const handleAnalyze = async (question: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await analyzeQuestion(question);
      setAnalysis(res);
      setCurrentStage(2);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to analyze question. Is backend running on port 8000?");
    } finally {
      setIsLoading(false);
    }
  };

  // STAGE 2: CLARIFY -> FINALIZE
  const handleFinalize = async (clarifications: Record<string, any>) => {
    if (!analysis) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await finalizeExperiment(analysis, clarifications);
      setExperiment(res);
      setCurrentStage(3);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to finalize experiment parameters.");
    } finally {
      setIsLoading(false);
    }
  };

  // STAGE 3: DEFINE -> BACKTEST
  const handleRunBacktest = async () => {
    if (!experiment) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await runBacktest(experiment);
      setBacktestResult(res);
      setCurrentStage(4);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to execute backtest calculations.");
    } finally {
      setIsLoading(false);
    }
  };

  // STAGE 4: TEST -> EXPLAIN (LEARN)
  const handleProceedToLearn = async () => {
    if (!experiment || !backtestResult) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await explainResults(experiment, backtestResult);
      setLearningResult(res);
      setCurrentStage(5);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to generate research synthesis.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset workflow to Stage 1
  const handleReset = () => {
    setCurrentStage(1);
    setAnalysis(null);
    setExperiment(null);
    setBacktestResult(null);
    setLearningResult(null);
    setErrorMessage(null);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6 mb-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-sm">
              <LineChart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900">AI Trading Research Assistant</h1>
              <p className="text-xs text-gray-500 font-medium">
                Turn ambiguous market ideas into testable research experiments.
              </p>
            </div>
          </div>

          <div className="hidden sm:block">
            <span className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              Prototype • Provenance Engine
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4">
        {/* Stage Stepper */}
        <ProgressStepper
          currentStage={currentStage}
          onStageClick={(stage) => setCurrentStage(stage)}
        />

        {/* Error notification banner */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div className="flex-1">{errorMessage}</div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-bold text-rose-600 hover:text-rose-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Stage Content Area */}
        {currentStage === 1 && (
          <AskPanel onAnalyze={handleAnalyze} isLoading={isLoading} />
        )}

        {currentStage === 2 && analysis && (
          <ClarifyPanel
            analysis={analysis}
            onFinalize={handleFinalize}
            isLoading={isLoading}
          />
        )}

        {currentStage === 3 && experiment && (
          <DefinePanel
            experiment={experiment}
            onRunTest={handleRunBacktest}
            isLoading={isLoading}
          />
        )}

        {currentStage === 4 && backtestResult && (
          <TestPanel
            result={backtestResult}
            onProceedToLearn={handleProceedToLearn}
            isLoading={isLoading}
          />
        )}

        {currentStage === 5 && learningResult && (
          <LearnPanel learning={learningResult} onReset={handleReset} />
        )}
      </div>
    </main>
  );
}
