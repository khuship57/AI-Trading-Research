# AI Trading Research Assistant

> A prototype AI-native trading research tool designed to decompose ambiguous natural-language market questions into structured, testable experiments.

---

## 🌟 Problem Statement

Traders and analysts often ask ambiguous market questions such as:
> *"Does buying NIFTY after a sharp fall work?"*

Traditional tools either force users into complex quantitative forms or silently invent important research parameters behind a simple chatbot wrapper.

This application implements a **5-stage structured workflow**:

$$\text{ASK} \longrightarrow \text{CLARIFY} \longrightarrow \text{DEFINE} \longrightarrow \text{TEST} \longrightarrow \text{LEARN}$$

The core design principle is **Parameter Provenance**: The system explicitly tracks whether each research parameter came from the user (`EXPLICIT`), was inferred (`INFERRED`), suggested as a default (`PROPOSED ASSUMPTION`), or confirmed by the user (`USER CONFIRMED`). **The AI is never allowed to silently invent experimental parameters as facts.**

---

## 🏗 Architecture & Flow

```text
               User (Browser)
                     │
                     ▼
      Next.js Frontend (TypeScript + Tailwind CSS)
                     │
                     ▼ REST API (HTTP / JSON)
        FastAPI Backend (Python)
    ┌────────────────┬────────────────┐
    │                │                │
    ▼                ▼                ▼
Groq LLM        Pydantic        Pandas Engine
(Intent Parsing  (Schema Validation (Deterministic
 & Explanations) & Provenance)      Backtest Math)
```

### Why This Architecture?

* **Groq LLM**: Solves natural-language semantic tasks (intent extraction, question generation, narrative synthesis).
* **Python + Pandas**: Handles 100% of numerical calculations deterministically to eliminate AI math hallucinations.
* **Pydantic**: Guarantees strict schema validation for API inputs and outputs.
* **Next.js (App Router)**: Delivers a responsive 5-stage stepper UI with real-time parameter badges.

---

## 🛠 Tech Stack

* **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Recharts, Lucide Icons
* **Backend**: Python 3.11, FastAPI, Pydantic v2, Uvicorn
* **AI Provider**: Groq API (`llama-3.3-70b-versatile`)
* **Data & Backtesting**: Pandas, NumPy, NIFTY 50 Daily OHLC Dataset

---

## 🚀 Setup & Execution Guide

### Prerequisites
* Python 3.10+
* Node.js 18+

### 1. Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI development server
uvicorn app.main:app --reload --port 8000
```

Backend API docs available at: `http://localhost:8000/docs`

### 2. Frontend Setup

```powershell
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Start Next.js development server
npm run dev
```

Frontend application available at: `http://localhost:3000`

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=groq/compound-mini
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🔬 Methodology & Look-Ahead Bias Prevention

To guarantee backtest validity, the engine enforces **strict look-ahead bias prevention**:
1. **Signal Detection**: Daily return drop ($\le -\text{threshold}$) is evaluated at Day $T$ Close.
2. **Order Execution**: Position entry occurs on **Day $T+1$ Open**.
3. **Exit Execution**: Position exit occurs on **Day $T+1+N$ Open** after $N$ trading days.
4. **Friction Deductions**: $0.10\%$ transaction fees + $0.05\%$ execution slippage are deducted from every trade.

---
