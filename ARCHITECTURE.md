# StellarMind — Architecture Document

## Overview

StellarMind is a **100% frontend dApp**. There is no backend server, database, or intermediary.
All API calls happen directly from the React app running in the user's browser.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     User's Browser                       │
│                                                          │
│  ┌──────────────┐    ┌─────────────────────────────┐    │
│  │   Freighter  │    │    React App (StellarMind)   │    │
│  │   Extension  │◄──►│                             │    │
│  │  (Wallet)    │    │  useWallet → Freighter API   │    │
│  └──────────────┘    │  useHorizon → horizonClient  │    │
│                       │  useAI → claudeClient        │    │
│                       └──────────┬─────────┬─────────┘   │
└──────────────────────────────────┼─────────┼─────────────┘
                                   │         │
                       ┌───────────▼──┐  ┌───▼─────────────┐
                       │   Stellar    │  │  Anthropic       │
                       │  Horizon     │  │  Claude API      │
                       │  Testnet API │  │  (Browser Key)   │
                       └──────────────┘  └──────────────────┘
```

## Data Flow

1. **Wallet Connect:** User clicks Connect → Freighter extension → returns public key → stored in localStorage
2. **Data Fetch:** `horizonClient.js` calls Horizon testnet directly from browser (fetch API)
   - `/accounts/{address}` → balances, sequence
   - `/accounts/{address}/transactions` → 50 most recent tx
   - `/accounts/{address}/operations` → 100 most recent ops
3. **AI Analysis:** `claudeClient.js` calls Claude API directly from browser
   - Uses `anthropic-dangerous-direct-browser-access: true` header
   - Returns structured JSON with health score, personality, insights, anomalies
4. **Dashboard Render:** All components receive processed data as props
5. **AI Chat:** User question + wallet context sent to Claude → response displayed
6. **Report:** Claude generates report JSON → rendered as printable page

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| No backend | Simplifies deployment; Vercel serves static bundle |
| Client-side API key | Acceptable for testnet hackathon; for production use a BFF proxy |
| localStorage persistence | Analysis cached locally to avoid re-analysis on every load |
| Fallback analysis | Client-side scoring ensures app works even without Claude API key |
| `global: globalThis` in Vite | Required for @stellar/stellar-sdk Node.js compatibility |

## API Endpoints Used

| API | Endpoint | Purpose |
|-----|----------|---------|
| Horizon | `GET /accounts/{address}` | Balances, account info |
| Horizon | `GET /accounts/{address}/transactions` | Transaction history |
| Horizon | `GET /accounts/{address}/operations` | Operation details |
| Claude | `POST /v1/messages` | Wallet analysis (JSON) |
| Claude | `POST /v1/messages` | AI chat responses |
| Claude | `POST /v1/messages` | Monthly report generation |

## Security Notes

- `VITE_ANTHROPIC_API_KEY` is exposed in the browser bundle — **acceptable for testnet/hackathon**
- For production: implement a Backend-For-Frontend (BFF) proxy to keep the API key server-side
- No private keys are ever handled by StellarMind; Freighter manages all signing
- Only public Stellar data (read-only) is fetched

## Component Tree

```
App
├── Navbar
├── Landing (route /)
│   ├── Hero (animated rings, star field, CTA)
│   ├── Features Grid (6 cards)
│   ├── How It Works (3 steps)
│   └── Stats Bar + Footer
├── Dashboard (route /dashboard)
│   ├── LoadingOverlay (3-step progress)
│   ├── Row 1: HealthScoreRing | TopInsight | MoodMeter
│   ├── Row 2: PersonalityCard | HeatmapCalendar
│   ├── Row 3: AskWallet | AnomalyAlert | AssetBreakdown
│   ├── Row 4: TransactionTimeline | GoalTracker
│   └── Row 5: NetworkComparison | ReportCTA
└── Report (route /report)
    └── AI-generated printable report
```

## Deployment

```bash
# Vercel (zero config)
vercel --prod

# Environment variables to set in Vercel dashboard:
# VITE_ANTHROPIC_API_KEY = your_key
# VITE_HORIZON_URL = https://horizon-testnet.stellar.org
```
