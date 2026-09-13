# Thinking Note — AI Trading Research Assistant

## 1. How I Interpreted the Question

When presented with the prompt:
> *"Does buying NIFTY after a sharp fall work?"*

I observed that while the prompt expresses a clear asset of interest (`NIFTY`) and a intuitive trading concept (buying after a price drop), it is fundamentally incomplete as a quantitative research specification. 

A natural language phrase like *"sharp fall"* carries zero statistical definition on its own. Does it imply a 1% daily drop, a 3% intraday spike down, or a 10% multi-week drawdown? Similarly, *"does it work"* is completely subjective without defining holding duration, execution timing, benchmark comparison, or transaction cost deductions.

---

## 2. What Is Known

* **Instrument**: NIFTY benchmark index (specifically NIFTY 50).
* **Direction**: Long / Buy position.
* **Core Event**: Entering a trade following a daily price decline.
* **Objective**: Evaluate historical performance and forward returns.

---

## 3. What Is Ambiguous

* **Quantitative Threshold**: Exact percentage drop defining a "sharp fall".
* **Entry Timing**: Whether the entry occurs at same-day close (which risks look-ahead bias) or next trading day open/close.
* **Holding Period**: Position duration (1 day, 5 days, 10 days, 20 days).
* **Exit Conditions**: Fixed holding duration vs profit-target / stop-loss rules.
* **Test Window**: Historical timeline (e.g. 2018–2025).
* **Friction & Execution Costs**: Brokerage charges, Securities Transaction Tax (STT), and order execution slippage.
* **Filters**: Market volatility filters (India VIX), moving average trend filters, or macroeconomic regime filters.

---

## 4. What Should Be Asked vs. Assumed

My core product design principle was: **Never allow the AI to silently invent research parameters as facts.**

* **What to Ask**: Parameters that fundamentally change the hypothesis intent (such as the fall threshold percentage and position holding period) must be flagged as `MISSING` and presented to the user through explicit, low-friction choices.
* **What to Propose**: Parameters with standard quantitative conventions (such as `0.10%` brokerage fee, `0.05%` slippage, and `T+1 open` entry) should be proposed transparently by the system, visibly tagged as `PROPOSED ASSUMPTION`.
* **Parameter Provenance**: Every single parameter tracks its origin status:
  - `EXPLICIT`: Stated directly by the user.
  - `INFERRED`: Derived from standard market context.
  - `MISSING`: Required field needing clarification.
  - `PROPOSED`: Default proposed transparently by system.
  - `USER_CONFIRMED`: Explicitly verified or chosen by user.

---

## 5. Concrete Experiment Definition

To make the idea testable, we transform the ambiguous question into a structured experiment specification:

* **Instrument**: NIFTY 50 Index (Daily OHLC)
* **Signal Trigger**: Daily return $\le -2.0\%$
* **Entry Execution**: Buy on Next Trading Day Open ($T+1$)
* **Holding Period**: 5 trading days ($T+1+5$)
* **Exit Execution**: Exit on Next Trading Day Open after holding period
* **Transaction Cost**: 0.10% round-trip brokerage + STT
* **Slippage**: 0.05% order execution slippage
* **Test Window**: 2018-01-01 to 2025-12-31

---

## 6. Technical & Methodological Risks ("What Could Go Wrong")

1. **Look-Ahead Bias**: Detecting a drop on Day $T$ close and pretending we bought at Day $T$ open or close before the signal was known. (We prevent this by entering on Day $T+1$ open).
2. **Transaction Cost Compression**: In high-frequency dip buying, uncounted brokerage fees and STT can erase modest positive gross returns.
3. **Threshold Selection Bias & Overfitting**: Tweaking the drop threshold until historical returns look artificially high creates a fragile rule fitted to past noise.
4. **Regime Sensitivity**: Dip buying may perform well during secular bull markets but suffer catastrophic drawdowns during sustained bear markets or structural shocks.
5. **Small Sample Size**: Large drops ($\ge 3\%$) happen infrequently, leading to small sample sizes where single outlier trades skew average returns.

---

## 7. Core Architectural Design Principle

> *"The central problem in AI financial tools is not generating a backtest — it is preserving the boundary between user intent, system assumptions, and empirical evidence."*
