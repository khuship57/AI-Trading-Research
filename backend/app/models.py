from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class HealthResponse(BaseModel):
    status: str = Field(default="ok", description="Status of the API service")

class ParameterValue(BaseModel):
    value: Any = Field(..., description="Parameter value (string, float, int, list, or null)")
    status: str = Field(..., description="Provenance: explicit | inferred | missing | proposed | user_confirmed")
    reason: str = Field(..., description="Explanation of how/why this status was assigned")

class ClarificationQuestion(BaseModel):
    id: str = Field(..., description="Unique question ID")
    field: str = Field(..., description="Target parameter field")
    question: str = Field(..., description="Clarification question for user")
    options: List[str] = Field(..., description="Available choice options")
    recommended_value: str = Field(..., description="Suggested default value")
    why_it_matters: str = Field(..., description="Explanation of why this parameter affects the test")

class AnalyzeRequest(BaseModel):
    question: str = Field(..., min_length=3, description="User research question in natural language")

class ExperimentAnalysis(BaseModel):
    original_question: str
    interpreted_goal: str
    parameters: Dict[str, ParameterValue]
    missing_critical_fields: List[str]
    clarification_questions: List[ClarificationQuestion]
    optional_assumptions: List[str]
    initial_hypothesis: str

class FinalizeExperimentRequest(BaseModel):
    analysis: ExperimentAnalysis
    user_clarifications: Dict[str, Any]

class ResearchExperiment(BaseModel):
    original_question: str
    instrument: ParameterValue
    timeframe: ParameterValue
    fall_threshold: ParameterValue
    entry_timing: ParameterValue
    exit_type: ParameterValue
    holding_period: ParameterValue
    test_start: ParameterValue
    test_end: ParameterValue
    transaction_cost: ParameterValue
    slippage: ParameterValue
    filters: ParameterValue
    hypothesis: str

class TradeDetail(BaseModel):
    event_date: str = Field(..., description="Date when trigger fall condition occurred (T)")
    trigger_return_pct: float = Field(..., description="Percentage decline on event day T")
    entry_date: str = Field(..., description="Date position was opened (T+1)")
    entry_price: float = Field(..., description="Execution price at entry")
    exit_date: str = Field(..., description="Date position was closed (T+1+N)")
    exit_price: float = Field(..., description="Execution price at exit")
    gross_return_pct: float = Field(..., description="Gross percentage return before fees")
    net_return_pct: float = Field(..., description="Net percentage return after costs")
    is_win: bool = Field(..., description="True if net return > 0")

class BacktestResult(BaseModel):
    number_of_events: int = Field(..., description="Total qualifying signal events")
    average_forward_return_pct: float = Field(..., description="Mean net percentage return across trades")
    median_forward_return_pct: float = Field(..., description="Median net percentage return across trades")
    win_rate_pct: float = Field(..., description="Percentage of trades with net return > 0")
    best_trade_pct: float = Field(..., description="Maximum net return observed")
    worst_trade_pct: float = Field(..., description="Minimum net return observed")
    standard_deviation_pct: float = Field(..., description="Volatility/std dev of net returns")
    cumulative_strategy_return_pct: float = Field(..., description="Cumulative sum net return of strategy")
    baseline_nifty_return_pct: float = Field(..., description="Buy-and-hold NIFTY return over dataset window")
    assumptions_applied: List[str] = Field(..., description="Assumptions used in backtest calculation")
    warnings: List[str] = Field(..., description="Methodology or dataset warnings")
    trades: List[TradeDetail] = Field(..., description="Detailed trade log")
    dataset_label: str = Field(..., description="Label identifying dataset source")

class ExplainRequest(BaseModel):
    experiment: ResearchExperiment
    backtest_result: BacktestResult

class LearningResult(BaseModel):
    data_shows: List[str] = Field(..., description="Factual calculated metric summaries only")
    reasonable_conclusion: List[str] = Field(..., description="Cautious logical deductions based on data")
    limitations: List[str] = Field(..., description="Methodological and data limitations")
    next_questions: List[str] = Field(..., description="Follow-up research questions to investigate next")
    disclaimer: str = Field(
        default="This prototype is for research demonstration purposes and does not provide financial advice.",
        description="Research disclaimer"
    )
