# Interview Notes & Frequently Asked Questions

### Q1: Why did you use an LLM for this application?
> **Answer**: Natural-language market questions are inherently ambiguous and semantic. LLMs excel at processing unstructured text, identifying underlying intent, and flagging missing parameters. However, I restricted the LLM strictly to semantic interpretation (`/analyze`) and narrative synthesis (`/explain`).

---

### Q2: Why not let the LLM execute the backtest calculations?
> **Answer**: Quantitative financial research requires 100% deterministic precision and reproducibility. LLMs are probabilistic models prone to math hallucination. I used Python (Pandas/NumPy) for all numerical backtesting to ensure exact, verifiable calculations.

---

### Q3: What is the purpose of Parameter Provenance labels (`EXPLICIT`, `PROPOSED`, etc.)?
> **Answer**: In AI product design, models often silently hallucinate or assign default parameters without informing the user. Provenance tracking ensures complete transparency by explicitly categorizing whether each parameter came directly from the user (`EXPLICIT`), was derived by context (`INFERRED`), suggested by system defaults (`PROPOSED`), or confirmed by the user (`USER_CONFIRMED`).

---

### Q4: Why ask only a few clarification questions instead of a full form?
> **Answer**: Too many questions create high user friction, while zero questions lead to invalid backtests. I implemented a minimal clarification model that asks only for parameters that materially change the hypothesis (e.g. drop threshold and holding duration), while proposing sensible transparent defaults for low-impact parameters (e.g. 0.10% transaction cost).

---

### Q5: Why did you avoid frameworks like LangChain, LangGraph, or Vector Databases?
> **Answer**: For a prototype with a linear 5-stage workflow, multi-agent frameworks and vector databases introduce unnecessary abstraction layers, latency, and debugging complexity without adding functional value. Direct FastAPI service calls and Pydantic validation keep the architecture simple, fast, and maintainable.

---

### Q6: What is Look-Ahead Bias and how did you prevent it?
> **Answer**: Look-ahead bias occurs when a backtest uses information that would not have been available at the trade decision time. For example, if a market drops 2% on Day $T$, detecting the drop requires waiting for Day $T$ close. Entering at Day $T$ open or close is invalid. My engine detects signals at Day $T$ close and executes position entries at Day $T+1$ open.

---

### Q7: What is Overfitting and parameter selection bias?
> **Answer**: Overfitting occurs when a researcher repeatedly tweaks parameters (e.g. testing 1.8%, 1.9%, 2.0%, 2.1% drop thresholds) until finding a setting that performed exceptionally well on past data by chance. The resulting strategy captures historical noise rather than a genuine market phenomenon.

---

### Q8: Does a positive average forward return prove a tradable market edge?
> **Answer**: No. A positive average return in a single backtest sample could be driven by secular bull market drift, small sample size, or outlier trades. Proving a persistent edge requires statistical significance testing (t-stats, p-values), benchmark comparison against unconditional buy-and-hold returns, regime analysis across bear markets, and transaction cost sensitivity testing.
