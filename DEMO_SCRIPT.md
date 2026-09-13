# Demo Script — AI Trading Research Assistant (2–3 Minutes)

---

### [0:00 – 0:20] Problem Definition & Core Concept
> *"Hi everyone. When traders or analysts ask natural-language questions like **'Does buying NIFTY after a sharp fall work?'**, the key technical challenge isn't the backtest math — it's **ambiguity**. 
>
> What defines a 'sharp fall'? When do we enter? How long do we hold? 
> Most AI apps either force you into complex forms or silently invent critical assumptions without telling you. 
> I built this prototype to solve ambiguity through a 5-stage research workflow: **ASK → CLARIFY → DEFINE → TEST → LEARN**."*

---

### [0:20 – 0:45] Stage 1: ASK (Intent Parsing)
> *"Let's submit our question: **'Does buying NIFTY after a sharp fall work?'**
> 
> When we click **Analyze**, our FastAPI backend passes the prompt to the Groq LLM API. Notice that the LLM is **not** asked if the strategy works. Its job is strictly to extract research parameters and identify what is missing."*

---

### [0:45 – 1:15] Stage 2: CLARIFY (Parameter Provenance)
> *"Notice what happened on the **Clarify screen**. The system correctly extracted `NIFTY 50` as an `EXPLICIT` user parameter. But it flagged `fall_threshold` and `holding_period` as `MISSING`.
> 
> This brings us to my core design feature: **Parameter Provenance**. Every parameter is visually tagged with its origin — `EXPLICIT`, `PROPOSED ASSUMPTION`, or `USER CONFIRMED`. The AI is never allowed to silently turn an assumption into user intent.
> 
> Let's select **2%** for the fall threshold and **5 trading days** for the holding period, then confirm."*

---

### [1:15 – 1:40] Stage 3: DEFINE (Experiment Card)
> *"Now we have a complete, validated **Research Experiment Card**. 
> 
> It specifies our signal trigger ($\le -2\%$), entry timing (Next Trading Day Open at $T+1$), exit duration (5 trading days), transaction costs ($0.10\%$), and execution slippage ($0.05\%$). Notice that entering on $T+1$ open strictly eliminates **look-ahead bias**."*

---

### [1:40 – 2:10] Stage 4: TEST (Deterministic Execution)
> *"Let's click **Run Backtest**. 
> 
> It's crucial to highlight: **the LLM does NOT calculate these numbers**. All historical return calculations, event detection, cost deductions, and statistical metrics are computed deterministically in Python using Pandas. 
> 
> Across 2,088 trading days of NIFTY benchmark data, we found 71 qualifying drop events, an average 5-day net return of **+1.13%**, and an observed win rate of **73.2%**."*

---

### [2:10 – 2:40] Stage 5: LEARN (Separation of Data vs. Inference)
> *"Finally, we move to **LEARN**. Instead of a generic sentence like 'the strategy works', we structure findings into 4 distinct cards:
> 1. **Section A (What Data Shows)**: Pure calculated facts.
> 2. **Section B (Reasonable Conclusion)**: Cautious inferences without claiming a persistent edge.
> 3. **Section C (Limitations)**: Sample size, flat cost assumptions, demonstration dataset warnings.
> 4. **Section D (Next Investigations)**: Actionable follow-ups like testing 1-day vs 10-day holding periods or adding stop-loss rules."*

---

### [2:40 – 3:00] Conclusion & Future Improvements
> *"In summary, this prototype demonstrates clean architecture, parameter provenance, look-ahead bias prevention, and deterministic AI integration. 
> 
> With more time, I would add statistical significance testing (t-stats/p-values), India VIX volatility regime filtering, and live market data feeds. Thank you!"*
