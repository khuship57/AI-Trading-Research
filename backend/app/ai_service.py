import json
import os
from typing import Dict, Any
from groq import Groq
from app.config import settings
from app.models import ExperimentAnalysis, ParameterValue, ClarificationQuestion
from app.prompts import SYSTEM_INTERPRETATION_PROMPT

def get_fallback_analysis(question: str) -> ExperimentAnalysis:
    """Fallback deterministic parser when Groq API key is absent or API call fails."""
    lower_q = question.lower()
    
    # 1. Instrument
    if "nifty" in lower_q:
        instrument = ParameterValue(
            value="NIFTY 50",
            status="explicit",
            reason="The user explicitly mentioned NIFTY in the research question."
        )
    else:
        instrument = ParameterValue(
            value="NIFTY 50",
            status="proposed",
            reason="No specific index mentioned; defaulted to NIFTY 50 index."
        )
        
    # 2. Fall Threshold
    fall_threshold = ParameterValue(
        value=None,
        status="missing",
        reason="The phrase 'sharp fall' is subjective and does not specify a quantitative percentage."
    )
    
    # 3. Holding Period
    holding_period = ParameterValue(
        value=None,
        status="missing",
        reason="The user did not specify how many trading days to hold the position."
    )
    
    # 4. Entry Timing
    entry_timing = ParameterValue(
        value="next trading day open",
        status="proposed",
        reason="Entering on T+1 open prevents look-ahead bias (entering before market close)."
    )
    
    # Standard proposed defaults for other fields
    parameters: Dict[str, ParameterValue] = {
        "instrument": instrument,
        "timeframe": ParameterValue(value="Daily", status="proposed", reason="Standard daily OHLC candle data."),
        "fall_threshold": fall_threshold,
        "entry_timing": entry_timing,
        "exit_type": ParameterValue(value="fixed_holding_period", status="proposed", reason="Fixed duration exit standard rule."),
        "holding_period": holding_period,
        "test_start": ParameterValue(value="2018-01-01", status="proposed", reason="Default 8-year historical test window."),
        "test_end": ParameterValue(value="2025-12-31", status="proposed", reason="Default test window end date."),
        "transaction_cost": ParameterValue(value="0.10%", status="proposed", reason="Estimated round-trip brokerage and STT charges."),
        "slippage": ParameterValue(value="0.05%", status="proposed", reason="Estimated order execution slippage."),
        "filters": ParameterValue(value="None", status="proposed", reason="No secondary filters applied.")
    }
    
    clarification_questions = [
        ClarificationQuestion(
            id="q_fall_threshold",
            field="fall_threshold",
            question="What percentage drop defines a 'sharp fall'?",
            options=["1%", "2%", "3%", "5%"],
            recommended_value="2%",
            why_it_matters="Defines how severe the daily price drop must be to trigger a buy signal."
        ),
        ClarificationQuestion(
            id="q_entry_timing",
            field="entry_timing",
            question="When should the buy order be executed?",
            options=["Next trading day open", "Same day close", "Next trading day close"],
            recommended_value="Next trading day open",
            why_it_matters="Entering at same day close requires knowing the closing price before it occurs (look-ahead bias)."
        ),
        ClarificationQuestion(
            id="q_holding_period",
            field="holding_period",
            question="How long should the trade remain open before exiting?",
            options=["1 trading day", "5 trading days", "10 trading days", "20 trading days"],
            recommended_value="5 trading days",
            why_it_matters="Determines how long we hold exposure to evaluate forward returns."
        )
    ]
    
    return ExperimentAnalysis(
        original_question=question,
        interpreted_goal="Test historical performance of buying NIFTY 50 following a sharp daily market decline.",
        parameters=parameters,
        missing_critical_fields=["fall_threshold", "holding_period"],
        clarification_questions=clarification_questions,
        optional_assumptions=[
            "Using NIFTY 50 daily index benchmark data.",
            "0.10% total transaction fee + 0.05% slippage applied per trade."
        ],
        initial_hypothesis="Buying NIFTY 50 after a significant daily decline generates positive average 5-day forward returns."
    )

def analyze_question(question: str) -> ExperimentAnalysis:
    """Analyze natural-language research question using Groq LLM or deterministic fallback."""
    api_key = settings.groq_api_key or os.getenv("GROQ_API_KEY", "")
    
    if api_key:
        try:
            client = Groq(api_key=api_key)
            completion = client.chat.completions.create(
                model=settings.groq_model,
                messages=[
                    {"role": "system", "content": SYSTEM_INTERPRETATION_PROMPT},
                    {"role": "user", "content": f"Analyze this trading research question: '{question}'"}
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

            parsed_data = json.loads(raw_json_clean)
            print(f"[AI Service] Successfully called Groq API ({settings.groq_model}) for Stage 1 Intent Analysis!")
            return ExperimentAnalysis(**parsed_data)
        except Exception as e:
            print(f"[AI Service Warning] Groq API call failed or key invalid: {e}. Utilizing fallback parser.")
            
    return get_fallback_analysis(question)
