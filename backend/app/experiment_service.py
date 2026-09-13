from typing import Dict, Any
from app.models import (
    ExperimentAnalysis,
    FinalizeExperimentRequest,
    ResearchExperiment,
    ParameterValue
)

def finalize_experiment(request: FinalizeExperimentRequest) -> ResearchExperiment:
    """Combines AI analysis with user clarification choices into a concrete ResearchExperiment object."""
    analysis = request.analysis
    clarifications = request.user_clarifications
    
    # Clone parameters
    updated_params: Dict[str, ParameterValue] = {}
    
    for key, param in analysis.parameters.items():
        # Check if user clarified this field directly or via question id
        user_val = None
        if key in clarifications:
            user_val = clarifications[key]
        elif f"q_{key}" in clarifications:
            user_val = clarifications[f"q_{key}"]
            
        if user_val is not None:
            updated_params[key] = ParameterValue(
                value=user_val,
                status="user_confirmed",
                reason=f"User explicitly selected '{user_val}' during clarification stage."
            )
        else:
            # If parameter was missing and no clarification was sent, apply default recommended choice
            if param.status == "missing":
                rec_val = "2%" if key == "fall_threshold" else "5 trading days" if key == "holding_period" else param.value
                updated_params[key] = ParameterValue(
                    value=rec_val,
                    status="user_confirmed",
                    reason=f"Default recommended value '{rec_val}' confirmed by user."
                )
            else:
                updated_params[key] = param
                
    # Build complete ResearchExperiment schema
    return ResearchExperiment(
        original_question=analysis.original_question,
        instrument=updated_params.get("instrument", ParameterValue(value="NIFTY 50", status="explicit", reason="NIFTY 50 Index")),
        timeframe=updated_params.get("timeframe", ParameterValue(value="Daily", status="proposed", reason="Daily candle timeframe")),
        fall_threshold=updated_params.get("fall_threshold", ParameterValue(value="2%", status="user_confirmed", reason="2% decline threshold")),
        entry_timing=updated_params.get("entry_timing", ParameterValue(value="next trading day open", status="user_confirmed", reason="Next day open")),
        exit_type=updated_params.get("exit_type", ParameterValue(value="fixed_holding_period", status="proposed", reason="Fixed exit")),
        holding_period=updated_params.get("holding_period", ParameterValue(value="5 trading days", status="user_confirmed", reason="5 trading days")),
        test_start=updated_params.get("test_start", ParameterValue(value="2018-01-01", status="proposed", reason="Start date")),
        test_end=updated_params.get("test_end", ParameterValue(value="2025-12-31", status="proposed", reason="End date")),
        transaction_cost=updated_params.get("transaction_cost", ParameterValue(value="0.10%", status="proposed", reason="0.10% fee")),
        slippage=updated_params.get("slippage", ParameterValue(value="0.05%", status="proposed", reason="0.05% slippage")),
        filters=updated_params.get("filters", ParameterValue(value="None", status="proposed", reason="No extra filters")),
        hypothesis=analysis.initial_hypothesis
    )
