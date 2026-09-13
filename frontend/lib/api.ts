import {
  ExperimentAnalysis,
  ResearchExperiment,
  BacktestResult,
  LearningResult
} from "./types";

const getApiBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return url.replace(/\/+$/, "");
};

export async function analyzeQuestion(question: string): Promise<ExperimentAnalysis> {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to analyze question" }));
    throw new Error(errorData.detail || `Server error (${response.status}) during question analysis`);
  }

  return response.json();
}

export async function finalizeExperiment(
  analysis: ExperimentAnalysis,
  userClarifications: Record<string, any>
): Promise<ResearchExperiment> {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/finalize-experiment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analysis, user_clarifications: userClarifications }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to finalize experiment" }));
    throw new Error(errorData.detail || `Server error (${response.status}) during experiment finalization`);
  }

  return response.json();
}

export async function runBacktest(experiment: ResearchExperiment): Promise<BacktestResult> {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/backtest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(experiment),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to execute backtest" }));
    throw new Error(errorData.detail || `Server error (${response.status}) during backtest calculation`);
  }

  return response.json();
}

export async function explainResults(
  experiment: ResearchExperiment,
  backtestResult: BacktestResult
): Promise<LearningResult> {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ experiment, backtest_result: backtestResult }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to generate explanation" }));
    throw new Error(errorData.detail || `Server error (${response.status}) during research synthesis generation`);
  }

  return response.json();
}
