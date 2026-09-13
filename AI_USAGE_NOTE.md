# AI Usage Note — AI Trading Research Assistant

## 1. AI Tools Used

* **Groq LLM API (`llama-3.3-70b-versatile`)**: Used in production backend for natural language intent analysis (`/analyze`) and structured learning synthesis (`/explain`).
* **ChatGPT & Gemini**: Used during initial design to brainstorm parameter extraction edge cases and review financial methodology risks.
* **Cursor / Antigravity Agent**: Used for rapid code scaffolding, Pydantic model alignment, and full-stack Next.js component creation.

---

## 2. What AI Tools Were Used For

* **Semantic Question Parsing**: Deconstructing natural-language market questions into structured parameter models.
* **Code Scaffolding & Component Boilerplate**: Generating initial UI layouts, TypeScript interfaces, and FastAPI route handlers.
* **Edge Case Brainstorming**: Identifying look-ahead bias vulnerabilities and parameter ambiguity scenarios.
* **Structured Learning Synthesis**: Generating cautious 4-section research takeaways from computed backtest statistics.

---

## 3. Key Decisions I Personally Made

1. **Deterministic Calculations in Python**: I strictly prohibited the LLM from calculating or estimating backtest numbers. All math, return calculations, and statistics are computed deterministically using Pandas and NumPy.
2. **LLM Scoped Strictly to Semantic Intent**: I limited the LLM's responsibility to interpreting natural language intent (`/analyze`) and explaining computed numerical evidence (`/explain`).
3. **Parameter Provenance System**: I designed the `ParameterValue` schema (`EXPLICIT`, `INFERRED`, `MISSING`, `PROPOSED`, `USER_CONFIRMED`) to ensure model assumptions are never mistaken for user intent.
4. **Minimal Clarification Design**: Instead of overloading the user with dozens of input fields or an unconstrained chat window, I structured the interface to ask only the minimum critical questions needed to make the experiment testable.
5. **Separation of Evidence from Inference**: I enforced strict separation between factual metric outputs (*Section A*) and cautious conclusions (*Section B*).

---

## 4. AI Suggestions I Rejected or Modified

* **Rejected RAG & Vector Databases**: Initial AI suggestions recommended embedding financial documents in a vector DB. I rejected this as unnecessary overhead for a single-asset quantitative rule prototype.
* **Rejected LangChain / LangGraph**: AI suggested complex multi-agent orchestration frameworks. I rejected them in favor of clean, direct FastAPI service calls that are transparent, readable, and easy to explain.
* **Rejected Same-Day Close Entry**: AI prompts initially suggested entering trades at same-day close ($T$). I modified the default to next-day open ($T+1$) to guarantee strict prevention of look-ahead bias.

---

## 5. What I Am Most Proud Of

The **Parameter Provenance System**. It solves the biggest issue in AI product design: **preventing the model from silently inventing critical assumptions while giving the user full visibility and control.**
