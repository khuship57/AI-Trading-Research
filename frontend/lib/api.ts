import {
  ExperimentAnalysis,
  ResearchExperiment,
  BacktestResult,
  LearningResult
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function analyzeQuestion(question: string): Promise<ExperimentAnalysis> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to analyze question" }));
    throw new Error(errorData.detail || "Server error during question analysis");
  }

  return response.json();
}

export async function finalizeExperiment(
  analysis: ExperimentAnalysis,
  userClarifications: Record<string, any>
): Promise<ResearchExperiment> {
  const response = await fetch(`${API_BASE_URL}/finalize-experiment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analysis, user_clarifications: userClarifications }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to finalize experiment" }));
    throw new Error(errorData.detail || "Server error during experiment finalization");
  }

  return response.json();
}

export async function runBacktest(experiment: ResearchExperiment): Promise<BacktestResult> {
  const response = await fetch(`${API_BASE_URL}/backtest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(experiment),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to execute backtest" }));
    throw new Error(errorData.detail || "Server error during backtest calculation");
  }

  return response.json();
}

export async function explainResults(
  experiment: ResearchExperiment,
  backtestResult: BacktestResult
): Promise<LearningResult> {
  const response = await fetch(`${API_BASE_URL}/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ experiment, backtest_result: backtestResult }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to generate explanation" }));
    throw new Error(errorData.detail || "Server error during research synthesis generation");
  }

  return response.json();
}
