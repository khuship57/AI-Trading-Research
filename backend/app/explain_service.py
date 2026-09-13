import json
import os
from groq import Groq
from app.config import settings
from app.models import ResearchExperiment, BacktestResult, LearningResult

EXPLAIN_SYSTEM_PROMPT = """You are explaining the quantitative results of a trading research experiment.

You MUST use ONLY the exact numerical evidence provided in the backtest result.
Never invent metrics, numbers, or statistical significance that were not provided.

Separate your output into 4 distinct structured sections:
1. "data_shows": Factual calculated results directly from the backtest (e.g., number of events, average net return, win rate, best/worst trade). Avoid speculative language here.
2. "reasonable_conclusion": Cautious logical inferences based ONLY on the observed data sample. Never state that a strategy guarantees profit or establishes a persistent market edge.
3. "limitations": Critical research limitations (e.g., small sample size, threshold dependency, lack of regime filters, simplified transaction costs, prototype demonstration dataset).
4. "next_questions": Actionable follow-up research questions to test next (e.g., test alternative thresholds, evaluate rolling windows, compare against benchmark returns).

Respond strictly with a JSON object matching this schema:
{
  "data_shows": [
    "71 historical events matched the decline threshold condition (>= 2%).",
    "The observed average 5-day net return per trade was +1.13%.",
    "52 out of 71 trades produced positive returns, yielding a win rate of 73.2%.",
    "The maximum single trade return was +4.65%, while the worst trade loss was -3.59%."
  ],
  "reasonable_conclusion": [
    "Under the chosen parameters, buying NIFTY 50 following a 2% daily decline generated positive average forward returns over a 5-day holding period.",
    "This sample observation suggests short-term mean-reversion behavior after sharp dips in the tested dataset.",
    "However, this single parameter set does not prove a persistent trading edge across all market environments."
  ],
  "limitations": [
    "Results rely on a demonstration dataset used for prototype evaluation.",
    "Performance is sensitive to the specific 2% decline threshold and 5-day holding period selected.",
    "Transaction fee (0.10%) and slippage (0.05%) are simplified static estimates.",
    "No stop-loss protection or regime-filtering rules were included in the backtest."
  ],
  "next_questions": [
    "How do returns compare when testing 1%, 3%, or 5% decline thresholds?",
    "Does performance change when testing shorter (1-day) or longer (10-day) holding periods?",
    "How does the strategy perform during high-volatility vs low-volatility market regimes?",
    "Does the strategy outperform unconditional buy-and-hold NIFTY forward returns?"
  ]
}
"""

def get_fallback_explanation(experiment: ResearchExperiment, bt: BacktestResult) -> LearningResult:
    """Deterministic template generator for the LEARN stage when LLM key is absent or API fails."""
    thresh = experiment.fall_threshold.value
    hold = experiment.holding_period.value
    
    data_shows = [
        f"{bt.number_of_events} historical events matched the experiment threshold condition ({thresh}).",
        f"The average {hold} net forward return was {bt.average_forward_return_pct:+.2f}%.",
        f"The observed win rate across trades was {bt.win_rate_pct:.1f}%.",
        f"Best single trade net return: {bt.best_trade_pct:+.2f}%; Worst single trade net return: {bt.worst_trade_pct:+.2f}%.",
        f"Standard deviation of forward returns: {bt.standard_deviation_pct:.2f}%."
    ]
    
    reasonable_conclusion = [
        f"The observed sample indicates that post-decline forward returns over {hold} were positive in {bt.win_rate_pct:.1f}% of historical occurrences.",
        "The strategy displays positive average forward return under the tested entry and exit rules.",
        "While historical performance in this sample is positive, it alone does not establish a persistent or tradable market edge without broader statistical validation."
    ]
    
    limitations = [
        "Demonstration dataset used for prototype evaluation purposes.",
        f"Result is heavily dependent on the chosen drop threshold ({thresh}) and holding duration ({hold}).",
        "Transaction costs (0.10%) and slippage (0.05%) are simplified flat estimates.",
        "Does not account for broader market regimes (bull vs bear trends) or liquidity constraints."
    ]
    
    next_questions = [
        "What is the impact of changing the drop threshold to 1%, 3%, or 5%?",
        "How do 1-day, 5-day, and 10-day holding periods compare against each other?",
        "How does the strategy compare against unconditional benchmark forward returns?",
        "Would adding a stop-loss mechanism improve the risk-adjusted return?"
    ]
    
    return LearningResult(
        data_shows=data_shows,
        reasonable_conclusion=reasonable_conclusion,
        limitations=limitations,
        next_questions=next_questions,
        disclaimer="This prototype is for research demonstration purposes and does not provide financial advice."
    )

def generate_explanation(experiment: ResearchExperiment, bt: BacktestResult) -> LearningResult:
    """Generates structured research learning synthesis using Groq LLM or deterministic fallback."""
    api_key = settings.groq_api_key or os.getenv("GROQ_API_KEY", "")
    
    if api_key:
        try:
            client = Groq(api_key=api_key)
            prompt_content = f"""
Experiment parameters:
- Fall threshold: {experiment.fall_threshold.value}
- Holding period: {experiment.holding_period.value}
- Entry timing: {experiment.entry_timing.value}

Calculated Backtest Results:
- Number of events: {bt.number_of_events}
- Average net forward return: {bt.average_forward_return_pct}%
- Median net forward return: {bt.median_forward_return_pct}%
- Win rate: {bt.win_rate_pct}%
- Best trade: {bt.best_trade_pct}%
- Worst trade: {bt.worst_trade_pct}%
- Standard deviation: {bt.standard_deviation_pct}%
- Strategy cumulative return: {bt.cumulative_strategy_return_pct}%
- Baseline market return: {bt.baseline_nifty_return_pct}%

Please summarize the experiment findings into the 4 structured learning sections.
"""
            completion = client.chat.completions.create(
                model=settings.groq_model,
                messages=[
                    {"role": "system", "content": EXPLAIN_SYSTEM_PROMPT},
                    {"role": "user", "content": prompt_content}
                ],
                response_format={"type": "json_object"},
                temperature=0.1
            )
            raw_json = completion.choices[0].message.content or ""
            raw_json_clean = raw_json.strip()
            if raw_json_clean.startswith("```json"):
                raw_json_clean = raw_json_clean[7:]
            elif raw_json_clean.startswith("```"):
                raw_json_clean = raw_json_clean[3:]
            if raw_json_clean.endswith("```"):
                raw_json_clean = raw_json_clean[:-3]
            raw_json_clean = raw_json_clean.strip()

            parsed = json.loads(raw_json_clean)
            print(f"[AI Service] Successfully called Groq API ({settings.groq_model}) for Stage 5 Research Synthesis!")
            return LearningResult(**parsed)
        except Exception as e:
            print(f"[AI Explain Warning] Groq API call failed or schema mismatch: {e}. Utilizing fallback template.")
            
    return get_fallback_explanation(experiment, bt)
