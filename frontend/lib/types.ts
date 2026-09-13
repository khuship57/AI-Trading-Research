export type ParameterStatus = 
  | "explicit"
  | "inferred"
  | "missing"
  | "proposed"
  | "user_confirmed";

export interface ParameterValue {
  value: any;
  status: ParameterStatus;
  reason: string;
}

export interface ClarificationQuestion {
  id: string;
  field: string;
  question: string;
  options: string[];
  recommended_value: string;
  why_it_matters: string;
}

export interface ExperimentAnalysis {
  original_question: string;
  interpreted_goal: string;
  parameters: Record<string, ParameterValue>;
  missing_critical_fields: string[];
  clarification_questions: ClarificationQuestion[];
  optional_assumptions: string[];
  initial_hypothesis: string;
}

export interface ResearchExperiment {
  original_question: string;
  instrument: ParameterValue;
  timeframe: ParameterValue;
  fall_threshold: ParameterValue;
  entry_timing: ParameterValue;
  exit_type: ParameterValue;
  holding_period: ParameterValue;
  test_start: ParameterValue;
  test_end: ParameterValue;
  transaction_cost: ParameterValue;
  slippage: ParameterValue;
  filters: ParameterValue;
  hypothesis: string;
}

export interface TradeDetail {
  event_date: string;
  trigger_return_pct: number;
  entry_date: string;
  entry_price: number;
  exit_date: string;
  exit_price: number;
  gross_return_pct: number;
  net_return_pct: number;
  is_win: boolean;
}

export interface BacktestResult {
  number_of_events: number;
  average_forward_return_pct: number;
  median_forward_return_pct: number;
  win_rate_pct: number;
  best_trade_pct: number;
  worst_trade_pct: number;
  standard_deviation_pct: number;
  cumulative_strategy_return_pct: number;
  baseline_nifty_return_pct: number;
  assumptions_applied: string[];
  warnings: string[];
  trades: TradeDetail[];
  dataset_label: string;
}

export interface LearningResult {
  data_shows: string[];
  reasonable_conclusion: string[];
  limitations: string[];
  next_questions: string[];
  disclaimer: string;
}
