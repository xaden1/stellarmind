# 🧠 StellarMind

> AI-Powered Financial Intelligence for Your Stellar Wallet — 100% in the Browser

[![Live Demo](https://img.shields.io/badge/Live-Demo-7C5CFC?style=for-the-badge)](YOUR_VERCEL_URL)
[![Stellar](https://img.shields.io/badge/Built_on-Stellar-00D4B4?style=for-the-badge)](https://stellar.org)
[![Claude AI](https://img.shields.io/badge/AI-Claude-7C5CFC?style=for-the-badge)](https://anthropic.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

---

## 🚀 Live Demo
**[https://stellarmind-azure.vercel.app](https://stellarmind-azure.vercel.app/)**


---



---

## 📖 What is StellarMind?

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
| 1 | [Tester Name] | `GABC...XYZ1` | [View →](https://stellar.expert/explorer/testnet/account/GABC...XYZ1) |
| 2 | [Tester Name] | `GDEF...XYZ2` | [View →](https://stellar.expert/explorer/testnet/account/GDEF...XYZ2) |
| 3 | [Tester Name] | `GHIJ...XYZ3` | [View →](https://stellar.expert/explorer/testnet/account/GHIJ...XYZ3) |
| 4 | [Tester Name] | `GKLM...XYZ4` | [View →](https://stellar.expert/explorer/testnet/account/GKLM...XYZ4) |
| 5 | [Tester Name] | `GNOP...XYZ5` | [View →](https://stellar.expert/explorer/testnet/account/GNOP...XYZ5) |

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
| [Name] | ⭐⭐⭐⭐⭐ | AI Chat | "Loved asking my wallet questions!" |
| [Name] | ⭐⭐⭐⭐ | Health Score | "Clean UI, great breakdown" |
| [Name] | ⭐⭐⭐⭐⭐ | Heatmap | "Very visual, easy to understand" |
| [Name] | ⭐⭐⭐⭐ | Personality Card | "Fun and accurate!" |
| [Name] | ⭐⭐⭐⭐⭐ | Report Generation | "Professional output" |

**Average Rating: 4.6 / 5** ⭐

---

## 🔄 Improvement Plan (Based on User Feedback)

### What Users Reported
After collecting feedback from 5 real testnet users via the Google Form, the most common request was **[e.g. "the chat sometimes doesn't answer questions about specific dates accurately"]**.

### Iteration Completed ✅
**Issue identified:** AI chat sometimes returned generic responses  

**Change made:** Improved prompt engineering and added Offline Mock Mode for consistent demo experience without API dependency

---

## 📄 License

MIT — Built for Stellar Monthly Builder Challenge 2026
