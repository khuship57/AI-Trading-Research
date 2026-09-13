import os
import re
import numpy as np
import pandas as pd
from typing import List, Any
from app.models import ResearchExperiment, BacktestResult, TradeDetail

DATA_FILE_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "nifty_data.csv")

def parse_pct_value(val: Any, default: float) -> float:
    """Parses string or float percentage into decimal format (e.g. '2%' -> 0.02, '0.05%' -> 0.0005)."""
    if val is None:
        return default
    if isinstance(val, (int, float)):
        return val / 100.0 if val >= 1.0 else float(val)
    
    val_str = str(val).strip()
    has_percent = "%" in val_str
    match = re.search(r"([0-9]+(?:\.[0-9]+)?)", val_str)
    if match:
        num = float(match.group(1))
        if has_percent or num >= 1.0:
            return num / 100.0
        return num
    return default

def parse_days_value(val: Any, default: int) -> int:
    """Parses days count string into integer (e.g. '5 trading days' -> 5)."""
    if val is None:
        return default
    if isinstance(val, int):
        return val
    
    val_str = str(val).strip()
    match = re.search(r"([0-9]+)", val_str)
    if match:
        return int(match.group(1))
    return default

def run_backtest(experiment: ResearchExperiment) -> BacktestResult:
    """
    Executes a deterministic historical backtest using Pandas.
    
    IMPORTANT — LOOK-AHEAD BIAS PREVENTION:
    Signals are detected at Day T close (daily_return <= -fall_threshold).
    Position entry occurs on Day T+1 Open (or Close depending on parameter).
    Position exit occurs after holding_period trading days on Day T+1+N Open.
    We NEVER use information on Day T to execute orders before Day T Close.
    """
    if not os.path.exists(DATA_FILE_PATH):
        raise FileNotFoundError(f"NIFTY data file not found at {DATA_FILE_PATH}")
        
    df = pd.read_csv(DATA_FILE_PATH)
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date").reset_index(drop=True)
    
    # Calculate daily percentage return based on Close prices
    df["daily_return"] = (df["close"] - df["close"].shift(1)) / df["close"].shift(1)
    
    # Extract numerical parameters from experiment object
    thresh_val = parse_pct_value(experiment.fall_threshold.value, default=0.02)
    hold_days = parse_days_value(experiment.holding_period.value, default=5)
    tx_cost_pct = parse_pct_value(experiment.transaction_cost.value, default=0.0010)
    slippage_pct = parse_pct_value(experiment.slippage.value, default=0.0005)
    total_cost_per_trade = tx_cost_pct + slippage_pct
    
    trades: List[TradeDetail] = []
    net_returns: List[float] = []
    
    n_rows = len(df)
    
    # Look-ahead bias safe signal scanner
    for i in range(1, n_rows):
        daily_ret = df.loc[i, "daily_return"]
        
        # Trigger condition: daily return drops by threshold or more (e.g. <= -2%)
        if pd.notnull(daily_ret) and daily_ret <= -thresh_val:
            event_date = df.loc[i, "date"].strftime("%Y-%m-%d")
            
            # Entry on Day T+1 Open
            entry_idx = i + 1
            if entry_idx >= n_rows:
                continue
                
            entry_date = df.loc[entry_idx, "date"].strftime("%Y-%m-%d")
            entry_price = float(df.loc[entry_idx, "open"])
            
            # Exit on Day T+1+N Open
            exit_idx = entry_idx + hold_days
            if exit_idx >= n_rows:
                exit_idx = n_rows - 1
                
            exit_date = df.loc[exit_idx, "date"].strftime("%Y-%m-%d")
            exit_price = float(df.loc[exit_idx, "open"])
            
            # Returns calculation
            gross_ret = (exit_price - entry_price) / entry_price
            net_ret = gross_ret - total_cost_per_trade
            
            gross_ret_pct = round(gross_ret * 100.0, 2)
            net_ret_pct = round(net_ret * 100.0, 2)
            
            trades.append(
                TradeDetail(
                    event_date=event_date,
                    trigger_return_pct=round(daily_ret * 100.0, 2),
                    entry_date=entry_date,
                    entry_price=round(entry_price, 2),
                    exit_date=exit_date,
                    exit_price=round(exit_price, 2),
                    gross_return_pct=gross_ret_pct,
                    net_return_pct=net_ret_pct,
                    is_win=(net_ret > 0)
                )
            )
            net_returns.append(net_ret_pct)
            
    # If zero events matched
    if not trades:
        baseline_return = round(((df.iloc[-1]["close"] - df.iloc[0]["close"]) / df.iloc[0]["close"]) * 100.0, 2)
        return BacktestResult(
            number_of_events=0,
            average_forward_return_pct=0.0,
            median_forward_return_pct=0.0,
            win_rate_pct=0.0,
            best_trade_pct=0.0,
            worst_trade_pct=0.0,
            standard_deviation_pct=0.0,
            cumulative_strategy_return_pct=0.0,
            baseline_nifty_return_pct=baseline_return,
            assumptions_applied=[
                f"Fall threshold: {thresh_val * 100:.1f}%",
                f"Holding period: {hold_days} trading days",
                f"Round-trip costs (fees + slippage): {total_cost_per_trade * 100:.2f}%"
            ],
            warnings=["No historical events matched this decline threshold in the dataset."],
            trades=[],
            dataset_label="Demonstration dataset used for prototype purposes."
        )
        
    # Statistical calculations using NumPy/Pandas
    avg_ret = float(np.mean(net_returns))
    med_ret = float(np.median(net_returns))
    win_rate = float(np.mean([1.0 if r > 0 else 0.0 for r in net_returns]) * 100.0)
    best_trade = float(np.max(net_returns))
    worst_trade = float(np.min(net_returns))
    std_dev = float(np.std(net_returns)) if len(net_returns) > 1 else 0.0
    cum_return = float(np.sum(net_returns))
    
    start_close = float(df.iloc[0]["close"])
    end_close = float(df.iloc[-1]["close"])
    baseline_return = round(((end_close - start_close) / start_close) * 100.0, 2)
    
    return BacktestResult(
        number_of_events=len(trades),
        average_forward_return_pct=round(avg_ret, 2),
        median_forward_return_pct=round(med_ret, 2),
        win_rate_pct=round(win_rate, 1),
        best_trade_pct=round(best_trade, 2),
        worst_trade_pct=round(worst_trade, 2),
        standard_deviation_pct=round(std_dev, 2),
        cumulative_strategy_return_pct=round(cum_return, 2),
        baseline_nifty_return_pct=baseline_return,
        assumptions_applied=[
            f"Fall threshold triggered when daily decline >= {thresh_val * 100:.1f}%.",
            f"Position entered on T+1 open price to avoid look-ahead bias.",
            f"Position held for fixed {hold_days} trading days.",
            f"Flat transaction cost of {tx_cost_pct * 100:.2f}% + slippage of {slippage_pct * 100:.2f}% per trade."
        ],
        warnings=[
            "Demonstration dataset used for prototype purposes.",
            "Historical results do not guarantee future market behavior.",
            "Does not include regime-filtering or stop-loss mechanisms."
        ],
        trades=trades,
        dataset_label="Demonstration dataset used for prototype purposes."
    )
