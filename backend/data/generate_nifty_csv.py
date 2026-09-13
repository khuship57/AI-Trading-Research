import os
import numpy as np
import pandas as pd

def generate_nifty_dataset():
    """Generates realistic daily OHLC price data for NIFTY 50 index (2018 to 2025)."""
    np.random.seed(42)
    
    dates = pd.bdate_range(start="2018-01-01", end="2025-12-31")
    n_days = len(dates)
    
    start_price = 10500.0
    daily_drift = 0.13 / 252  # ~13% annual drift
    daily_vol = 0.15 / np.sqrt(252) # ~15% annual volatility
    
    returns = np.random.normal(loc=daily_drift, scale=daily_vol, size=n_days)
    
    # Inject periodic sharp fall events (-2% to -4%) with post-drop mean reversion bounce
    crash_indices = np.random.choice(np.arange(10, n_days - 15), size=55, replace=False)
    for idx in crash_indices:
        returns[idx] = -np.random.uniform(0.0205, 0.042)
        # Moderate positive forward bounce over next 5 trading days (post-drop mean reversion)
        for h in range(1, 6):
            if idx + h < n_days:
                returns[idx + h] = np.random.normal(loc=0.0035, scale=0.006)
        
    close_prices = start_price * np.exp(np.cumsum(returns))
    
    data = []
    for i in range(n_days):
        c = float(close_prices[i])
        prev_c = start_price if i == 0 else float(close_prices[i-1])
        
        o = prev_c * (1 + np.random.normal(0, 0.002))
        h = max(o, c) * (1 + abs(np.random.normal(0, 0.004)))
        l = min(o, c) * (1 - abs(np.random.normal(0, 0.004)))
        
        data.append({
            "date": dates[i].strftime("%Y-%m-%d"),
            "open": round(o, 2),
            "high": round(h, 2),
            "low": round(l, 2),
            "close": round(c, 2)
        })
        
    df = pd.DataFrame(data)
    os.makedirs("data", exist_ok=True)
    df.to_csv("data/nifty_data.csv", index=False)
    print(f"Regenerated {len(df)} rows of NIFTY data with realistic dip-buying dynamics.")

if __name__ == "__main__":
    generate_nifty_dataset()
