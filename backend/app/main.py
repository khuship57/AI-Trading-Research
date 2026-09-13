from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.models import (
    HealthResponse,
    AnalyzeRequest,
    ExperimentAnalysis,
    FinalizeExperimentRequest,
    ResearchExperiment,
    BacktestResult,
    ExplainRequest,
    LearningResult
)
from app.ai_service import analyze_question
from app.experiment_service import finalize_experiment
from app.backtest_service import run_backtest
from app.explain_service import generate_explanation

app = FastAPI(
    title=settings.app_name,
    description="Backend API for AI Trading Research Assistant",
    version="1.0.0"
)

# Configure CORS for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse)
def health_check():
    """Health check endpoint to verify backend server status."""
    return HealthResponse(status="ok")

@app.post("/analyze", response_model=ExperimentAnalysis)
def analyze_endpoint(request: AnalyzeRequest):
    """
    STAGE 1: Interpret natural-language question into structured experiment analysis.
    Identifies explicit user parameters, missing parameters, and clarification questions.
    """
    if not request.question or len(request.question.strip()) < 3:
        raise HTTPException(status_code=400, detail="Research question must be at least 3 characters long.")
    
    return analyze_question(request.question)

@app.post("/finalize-experiment", response_model=ResearchExperiment)
def finalize_endpoint(request: FinalizeExperimentRequest):
    """
    STAGE 2 & 3: Finalize ResearchExperiment using initial AI analysis and user clarification choices.
    Updates parameter statuses to 'user_confirmed' for resolved fields.
    """
    return finalize_experiment(request)

@app.post("/backtest", response_model=BacktestResult)
def backtest_endpoint(experiment: ResearchExperiment):
    """
    STAGE 4: Execute deterministic Pandas backtest on historical OHLC data.
    Calculates event counts, forward returns, win rate, best/worst trades, and cost deductions.
    """
    try:
        return run_backtest(experiment)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backtest execution failed: {str(e)}")

@app.post("/explain", response_model=LearningResult)
def explain_endpoint(request: ExplainRequest):
    """
    STAGE 5: Synthesize quantitative backtest results into 4 structured learning sections:
    What the data shows, reasonable conclusions, research limitations, and next questions.
    """
    try:
        return generate_explanation(request.experiment, request.backtest_result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explanation synthesis failed: {str(e)}")
