# OpsAI — AI Architecture & Integration Specification

## 🧠 AI Integration Philosophy

In OpsAI, AI is integrated into the core incident response lifecycle to reduce **Mean Time To Resolution (MTTR)** and **Mean Time To Acknowledge (MTTA)**. 

Rather than functioning as an external conversational chatbot, the AI service acts as an **autonomous investigation co-pilot**:
1. It ingests structured telemetry, deployment records, metric anomalies, and historical incident logs.
2. It generates validated root-cause hypotheses with confidence metrics.
3. It separates empirical facts from machine speculation.
4. It compiles comprehensive postmortem drafts for engineer review.

---

## 🏗️ Architecture & Component Pipeline

```
Incident Trigger / Alert Ingestion
              ↓
  BullMQ Queue ('incident-analysis')
              ↓
    Redis Async Job Queue
              ↓
       BullMQ AI Worker
              ↓
     OpenAI Chat Completions API (gpt-4o-mini)
              ↓
       Zod Schema Parser (IncidentAnalysisSchema)
              ↓ (Fallback to Rule-Grounded Analyzer if API Key missing/fails)
     MongoDB Record Saved (Incident.analysis)
              ↓
   Socket.IO Broadcast ('incident.updated')
              ↓
     Next.js Live SRE Console Update
```

---

## 📋 Structured JSON Prompts & Zod Schemas

To prevent halluncinations or malformed responses, all LLM output is strictly forced into structured JSON format and validated using **Zod**.

### Incident Analysis Schema (`packages/shared/src/schemas.ts`)
```typescript
export const IncidentAnalysisSchema = z.object({
  probableCause: z.string().min(3),
  confidence: z.number().min(0).max(1),
  confirmedEvidence: z.array(z.string()),
  hypotheses: z.array(z.string()),
  potentialImpact: z.string(),
  recommendedInvestigation: z.array(z.string()),
  recommendedMitigation: z.array(z.string())
});
```

---

## 🛡️ Resilient Fallback Strategy & AI Safety UX

### 1. Graceful Degradation
If `OPENAI_API_KEY` is omitted or if the OpenAI API encounters rate limits, timeouts, or network errors:
- The system **never crashes** or blocks the incident lifecycle.
- The worker seamlessly invokes a **deterministic, rule-grounded analyzer**.
- Empirical signals (e.g. active DB connections > 90%, deployment timestamps, error spikes) are evaluated via static heuristics to produce high-quality investigation context.

### 2. Responsible AI Safety Controls
- **Evidence vs. Hypothesis Separation**: Confirmed metric facts (e.g., *"DB connections reached 96%"*) are visually demarcated with green checkmarks, whereas machine speculation is tagged:  
  `"AI HYPOTHESIS (Requires Engineer Verification)"`.
- **Human-in-the-Loop Postmortems**: AI-generated postmortems are stored with `status = "DRAFT"` and display a warning banner:  
  `"AI Generated — Review Required"`. AI postmortems are never automatically published.

---

## 📝 Development Log & Technical Choices

- **Rejected Approach**: Direct LLM execution of database queries or operational commands. (Reason: Poses critical infrastructure safety risks).
- **Adopted Approach**: Asynchronous BullMQ worker queue processing with Zod schema validation and Socket.IO real-time client updates.
