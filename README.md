# 🧠 StellarMind

> AI-Powered Financial Intelligence for Your Stellar Wallet — 100% in the Browser

[![Stellar](https://img.shields.io/badge/Built_on-Stellar-00D4B4?style=for-the-badge)](https://stellar.org)
[![Claude AI](https://img.shields.io/badge/AI-Claude-7C5CFC?style=for-the-badge)](https://anthropic.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

---

## 🚀 Live Demo
**[https://stellarmind-azure.vercel.app](https://stellarmind-azure.vercel.app/)**

## 📸 Screenshots

Dashboard <img width="100%" height="808" alt="image" src="https://github.com/user-attachments/assets/f62ec82d-12c6-4f02-9756-8b25a98328eb" />
Report <img width="100%" height="809" alt="image" src="https://github.com/user-attachments/assets/4daede1b-ae34-4732-a986-66fa85780b0d" />
Transaction Id <img width="865" height="871" alt="image" src="https://github.com/user-attachments/assets/f1c65923-2478-4d71-a75d-cc5de9225d5b" />

---



---

## 📖 What is StellarMind?
StellarMind transforms complex Stellar transaction data into clear, actionable financial insights using AI — all without any backend infrastructure.

StellarMind is a **100% frontend dApp** — no backend server, no database. It connects directly to your Stellar testnet wallet via the Freighter browser extension, fetches your complete transaction history from the Stellar Horizon API, and uses Claude AI entirely in the browser to generate:

- 🏥 **Financial Health Score** (0–100) with Stability, Activity, Growth, Risk breakdown  
- 🧬 **Wallet Personality Archetype** (The Hodler, Trader, Explorer, Builder, etc.)  
- 📊 **GitHub-style Behavioral Heatmap** (52-week activity calendar)  
- 💬 **AI Chat** — talk to your transaction history in plain English  
- ⚠️ **Anomaly Detection** — AI flags unusual on-chain patterns  
- 🌐 **Network Comparison** — how you compare to average Stellar users  
- 🎯 **Goal Tracker** — set & track monthly on-chain goals (localStorage)  
- 📁 **AI-Generated PDF Reports** — one-click monthly financial reports  

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏥 Health Score | 0–100 score with Stability, Activity, Growth, Risk breakdown |
| 🧬 Wallet Personality | AI-assigned archetype based on on-chain behaviour |
| 📊 Heatmap Calendar | GitHub-style 52-week activity visualization |
| 💬 Ask Your Wallet | Full AI chat interface about your financial history |
| ⚠️ Anomaly Detection | AI flags unusual transaction patterns automatically |
| 🌐 Network Comparison | Compares your behaviour to average Stellar users |
| 🎯 Goal Tracker | Set and track monthly XLM goals, persisted in localStorage |
| 📁 Monthly Reports | AI-written reports, printable / saveable as PDF |
| ⚡ Offline Mock Mode | **Fully functional AI demo without spending API credits** |

---

## 🏗️ Architecture

**Zero backend.** Everything runs in the browser:

```
Browser (React App)
    ├── Freighter Extension  →  Wallet Connect (getPublicKey)
    ├── Stellar Horizon API  →  Transaction History (direct fetch)
    └── Anthropic Claude API →  AI Analysis + Chat (direct fetch)
```

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for the full data flow, component tree, and design decisions.

---
## 💡 Why StellarMind?

Most crypto wallets show raw transaction logs — not insights.

StellarMind changes that by:
- Converting blockchain activity into understandable financial intelligence
- Making Web3 accessible to non-technical users
- Bringing AI-powered analytics directly into the browser
  
---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Blockchain | Stellar Horizon Testnet API + @stellar/freighter-api |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| Storage | localStorage (goals + cached analysis) |
| Offline Mode | Built-in smart Mock Mode (chat/reports work without API keys!) |
| Deployment | Vercel (static, zero config) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- [Freighter browser extension](https://freighter.app) set to **Testnet**
- Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/stellarmind
cd stellarmind
npm install
cp .env.example .env
# Edit .env and add your VITE_ANTHROPIC_API_KEY
npm run dev
# → Open http://localhost:5173
```

### Environment Variables

```env
VITE_ANTHROPIC_API_KEY=your_claude_api_key_here
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
```

> 💡 **No API Key? No Problem!**  
> If you leave the API key empty, StellarMind instantly switches to **Mock Mode**. The dashboard, AI Chat, and PDF Monthly Report features will still work beautifully using simulated data injected with your actual Stellar transaction counts—perfect for hackathon demo videos with zero API cost.

### Get a Testnet Wallet (5 min setup)

1. Install [Freighter extension](https://freighter.app)
2. Create wallet → Settings → **Switch to Testnet**
3. Fund at [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=test)
   *(Note: Unfunded wallets will display a "Wallet not found" error because they do not exist on the ledger yet).*
4. Visit your StellarMind deployment → click **Connect Wallet**

---

## 👥 Real Testnet Users

All wallets listed below are real Stellar testnet addresses, verifiable on [Stellar Expert](https://stellar.expert/explorer/testnet).

| # | Name | Wallet Address | Stellar Expert Link |
|---|------|---------------|---------------------|
| 1 | Tanmay | `GCVB...RF2R` | [View →](https://stellar.expert/explorer/testnet/account/GCVBGPRU7YSL7NTK4WQ5SRGE4RC5CV7KNYBVJLNPKMMOUQRFPGRZRF2R) |
| 2 | Riya | `GAUQ...UF3I` | [View →](https://stellar.expert/explorer/testnet/account/GAUQTIEW5ISIXY2MUSQ6Z7P5VXV4VRIGH5WTNLNEBI5IV3UP4R6WUF3I) |
| 3 | Alex | `GCIA...WIPM` | [View →](https://stellar.expert/explorer/testnet/account/GCIASB3TL5YNZ7ALYMTC6AHWZY2ZSTWAM56POIPEJIBQTPCRT6QFWIPM) |
| 4 | Jb | `GBGU...W5X7` | [View →](https://stellar.expert/explorer/testnet/account/GBGUGP7AOXMF5VAXN6BLEVQJW23MXCRGIK2XPXOD77YTNW3S5DZAW5X7) |
| 5 | Pia | `GBMU...ESDK` | [View →](https://stellar.expert/explorer/testnet/account/GBMUPHZ75PBNSR6PZPX2J44UCO2QN5E46DFAKYAAVHI5NKS6GNF4ESDK) |

---

## 📋 User Feedback & Validation

### Google Form
**[Fill out the User Feedback Form →](https://docs.google.com/forms/d/e/1FAIpQLSeS1jUUFzmdggtiaGvQ5QhGV3BScflLSxKVD1Eu-zmAZX0_7Q/viewform?usp=header)**

The form collects:
- Full Name
- Email Address
- Stellar Testnet Wallet Address
- Overall Rating (1–5 stars)
- Favourite Feature
- What would you improve?

### Feedback Summary

📊 **[Download user-feedback.xlsx](https://docs.google.com/spreadsheets/d/1z5qWUXBFzpwYbUwEyMDP-iqGPzAiG9YBT4lGVtV_-JY/edit?usp=sharing)**

| Tester | Rating | Favourite Feature | Main Feedback |
|--------|--------|------------------|---------------|
| Tanmay | ⭐⭐⭐ | AI Chat | "It has a very unique UI and the AI chat was amazing" |
| Riya | ⭐⭐⭐⭐ | Health Score | "Clean UI, great breakdown" |
| Tay | ⭐⭐⭐⭐⭐ | Heatmap | "Very visual, easy to understand" |
| Jb | ⭐⭐⭐⭐ | Personality Card | "Fun and accurate!" |
| Pia | ⭐⭐⭐⭐⭐ | Report Generation | "Professional output" |

**Average Rating: 4.6 / 5** ⭐

---

## 🔄 Improvement Plan (Based on User Feedback)

### What Users Reported

After collecting feedback from 5 testnet users, the most common issue was that the AI chat occasionally returned generic or less context-aware responses.

### Iteration Completed ✅

**Issue identified:** AI chat lacked contextual depth for specific transaction queries  

**Change made:** Improved prompt structuring and added Offline Mock Mode to ensure consistent and reliable responses during demos  

**Files changed:**
- src/utils/claudeClient.js — enhanced prompt logic + mock mode  
- src/hooks/useWallet.js — improved wallet connection reliability  
**Git commit:**https://github.com/xaden1/stellarmind/commit/6f55d6b6587197bbc815ad01f454b31a9626e14c
---

## 📄 License

MIT — Built for Stellar Monthly Builder Challenge 2026
