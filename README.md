# ⚓ OSS First Mate

> AI-powered assistant for open source maintainers — built for the [Pirates of the Coral-bean Hackathon](https://wemakedevs.org/hackathons/coral)

OSS First Mate uses **Coral's SQL interface** to query GitHub as a database, feeds the results to an LLM, and produces actionable intelligence for OSS maintainers — all in one dashboard.

---

## What it does

| Feature | Description |
|---|---|
| **Issue triage** | Fetches open issues via Coral SQL → classifies each as bug/feature/docs with priority |
| **Duplicate detection** | Finds pairs of issues describing the same problem with confidence scores |
| **Release notes** | Drafts a markdown changelog from merged PRs |
| **Slack insights** | Cross-source JOIN: matches GitHub issues to Slack channel discussions |
| **SQL log** | Shows every Coral query that ran — transparent, auditable |
| **Run history** | All past runs stored in MongoDB Atlas |

---

## How Coral Powers This

Every data fetch goes through Coral's SQL interface. No custom API wrappers. No ETL.

```sql
-- Triage: fetch open issues as SQL
SELECT number, title, body, labels, created_at, state
FROM github.issues
WHERE owner = 'expressjs' AND repo = 'express'
AND state = 'open'
ORDER BY created_at DESC
LIMIT 10;
```

```sql
-- Duplicate detection
SELECT number, title, body, labels, created_at
FROM github.issues
WHERE owner = 'expressjs' AND repo = 'express'
AND state = 'open'
ORDER BY created_at DESC
LIMIT 20;
```

```sql
-- Slack insights: cross-source join
-- GitHub issues fetched via Coral SQL
-- Slack messages fetched via Slack Web API
-- Groq LLM joins them semantically
SELECT number, title, body
FROM github.issues
WHERE owner = 'expressjs' AND repo = 'express'
AND state = 'open'
ORDER BY created_at DESC
LIMIT 10;
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **SQL Query Layer** | Coral v0.3.0 |
| **LLM** | Groq API — `llama-3.3-70b-versatile` (free tier) |
| **Frontend** | React + Vite + Tailwind |
| **Backend** | Node.js + Express |
| **Database** | MongoDB Atlas |
| **Messaging** | Slack Web API |
| **3D Landing** | Spline |

---

## Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free)
- Groq API key (free at [console.groq.com](https://console.groq.com))
- GitHub Personal Access Token
- Slack Bot Token *(optional, for Slack insights)*
- Coral v0.3.0 binary

### Install Coral

**Mac:**
```bash
brew install withcoral/tap/coral
```

**Windows:**  
Download from [Coral releases](https://github.com/withcoral/coral/releases/latest) and extract to a folder.

### Clone and Install

```bash
git clone https://github.com/Atharva-026/oss-first-mate-coral
cd oss-first-mate-coral

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Configure Environment

Create `.env` in the root directory:

```env
GROQ_API_KEY=your_groq_key
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=expressjs
GITHUB_REPO=express
SLACK_TOKEN=xoxb-your-slack-token
MONGODB_URI=mongodb+srv://...
PORT=5000
CORAL_PATH=/path/to/coral
```

### Add GitHub Source to Coral

```bash
coral source add github
# Enter your GitHub token when prompted
```

### Run

```bash
# Terminal 1 — backend
cd server && nodemon index.js

# Terminal 2 — frontend
cd client && npm run dev
```

Open `http://localhost:5173`

---

## Demo

1. Enter any public GitHub repo in the header (`owner/repo`)
2. Click **Triage** → Run triage → see issues classified by AI
3. Click **Duplicates** → Find duplicates → see similar issues paired
4. Click **Release notes** → Generate → get markdown changelog
5. Click **Slack insights** → Find links → see GitHub ↔ Slack cross-source join
6. Click **SQL log** → see every Coral query that ran

---

## Project Structure
├── client/                  # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── TriageBoard.jsx
│       │   ├── DuplicatesPanel.jsx
│       │   ├── ReleaseNotes.jsx
│       │   ├── SlackInsights.jsx
│       │   ├── SqlLog.jsx
│       │   ├── RunHistory.jsx
│       │   └── LandingPage.jsx
│       └── App.jsx
├── server/                  # Node.js + Express backend
│   ├── routes/              # triage, duplicates, release-notes, slack, history
│   ├── services/            # coralService, groqService, slackService
│   └── models/              # RunHistory MongoDB schema
└── coral-queries/           # Raw SQL queries used by the agent
├── triage.sql
├── duplicates.sql
└── release_notes.sql

---

## Judging Criteria Alignment

| Criterion | How We Address It |
|---|---|
| **Best Use of Coral** | All GitHub data fetched via Coral SQL — issues, pulls, cross-source joins |
| **Potential Impact** | Saves OSS maintainers hours of manual triage every week |
| **Creativity** | Slack ↔ GitHub semantic join via LLM on top of Coral SQL results |
| **Technical Implementation** | Full MERN stack, async Coral process management, MongoDB run history |
| **Aesthetics & UX** | 3D Spline landing page, table layout, real-time SQL log |

---

Built with ❤️ for [Pirates of the Coral-bean Hackathon](https://wemakedevs.org/hackathons/coral) by [@Atharva-026](https://github.com/Atharva-026)