# CV -- Jim Nguyen

**Location:** Hawthorne, CA
**Email:** jim.nguyen2017@gmail.com
**Phone:** (424)-374-7892
**LinkedIn:** linkedin.com/in/jimnguyen2017
**GitHub:** github.com/jimdnguyen
**Portfolio:** jimdnguyen.dev

## Professional Summary

Backend-focused software engineer with 3+ years building and operating production systems at a compliance tech startup. Founding engineer at ComplyAi, where I helped scale a prototype into a multi-client SaaS platform monitoring 2,400+ active ad accounts and ~2.8M ads across AWS and GCP infrastructure. Experienced in Python/Flask, PostgreSQL, Celery, and cloud operations, and now a core engineer on ComplyAi's live v2 platform (Next.js, FastAPI, Supabase) — originally built by an outside team and handed off, which I've been helping fix and adapt for production. Works in an agentic development style — Claude Code with parallel subagents and git worktrees — to ship features faster across the stack.

## Work Experience

### ComplyAi -- Remote (El Segundo, CA)
**Software Engineer I**
October 2023 - Present

- As a founding engineer on a lean 2–3 person team, helped evolve a prototype into a production-ready full-stack application using React, Flask, and PostgreSQL, collaborating closely with CEO and CFO
- Authored 2,000+ merged pull requests across 5 production repositories over ~3.5 years (Python/FastAPI, TypeScript/React, Postgres), including 530+ on the V2 platform in 6 months
- Maintained, operated, and extended cloud infrastructure across AWS (ECS, ECR, Secrets Manager, Route 53, ELB) and GCP (Cloud Run, Cloud SQL, Secrets Manager), ensuring system reliability for 15+ clients
- Core engineer on a Meta-ads compliance platform monitoring 2,400+ active ad accounts and ~2.8M ads via real-time webhook ingestion on a multi-replica API
- Used Claude Code to generate the PostgreSQL data model — schema and migrations spanning the v1 pipeline and the v2 platform — reviewing and refining the output before applying it
- Implemented Celery background task queues, Auth0 authentication, and an RBAC system following OWASP security guidelines to improve system performance and security
- Designed and shipped hybrid subscription + usage-based billing on Stripe (86 PRs): pricing and quota engine, spend-based coverage fees with multi-currency conversion, automated cycle-close invoicing, and the full subscription lifecycle (cancel, churn, resubscribe), reconciled against Stripe
- One of the core engineers on ComplyAi's live v2 platform — Next.js frontend, FastAPI backend, Supabase (Postgres + auth), BullMQ/Redis for background jobs, deployed on Railway with Sentry and Grafana for error tracking and observability; inherited the initial codebase from an outside team and have been fixing and adapting it for production
- Owned production reliability across Sentry, Grafana/Loki, Railway, and Supabase; resolved 66 bugs with a median under 24 hours from report to shipped fix
- Drive an agentic development workflow with Claude Code — running parallel subagents and isolating concurrent feature work in git worktrees — to accelerate feature delivery, code review, and debugging across the stack
- Built a persistent Claude Code work agent integrated with Linear, Slack, and GitHub (with Obsidian as a shared inbox), and maintain the CLAUDE.md project context and conventions that guide it
- Built a custom /ticket skill that takes a feature from Linear ticket to reviewed pull request; currently building a browser interface for the agent

**Intern Software Engineer**
August 2022 - October 2023

- Built AWS Lambda serverless functions and RESTful APIs integrating with Facebook's Marketing API, supporting an international React dev team
- Developed an automated daily reporting system in Google Sheets to track and analyze Facebook ad disapprovals across 1,000+ ads for 5+ clients, reducing manual compliance monitoring overhead
- Collaborated in an agile environment using JIRA for task management and sprint planning

## Education

- BS Computer Science and Engineering, UC Merced (2022)

### Coursework

**Software Engineering Capstone** -- UC Merced (2022)

- Collaborated with Western Digital employees to gather and define Key Insight Report requirements
- Built a full-stack application integrating with Jira via RESTful APIs (Spring Boot), with interactive data visualizations (React, Redux, Tailwind CSS), automated email notifications, and a PostgreSQL database
- Presented the working solution to Western Digital clients and a faculty committee in May 2022

## Projects

### FinAlly — AI Trading Workstation (finally.jimdnguyen.dev)
AI-powered trading workstation with live SSE price streaming, simulated $10k portfolio with market orders, and an LLM assistant that analyzes holdings and auto-executes trades via natural language. Includes portfolio heatmap, P&L chart, and watchlist. Next.js, FastAPI, LiteLLM, Zustand, SQLite, Docker; Playwright E2E test suite and GitHub Actions CI.

### Kanban Studio — AI Project Board (pm.jimdnguyen.dev)
AI-powered Kanban board with drag-and-drop reordering (dnd-kit) and an LLM chat sidebar that creates, moves, and edits cards from plain English commands. Multi-board support, card metadata (priority, labels, due dates), JWT-free cookie-based auth. Next.js 16, FastAPI, SQLite, OpenRouter, Docker.

### Prelegal — AI Legal Document Generator (prelegal.jimdnguyen.dev)
AI chat interface for filling and exporting 12 legal document types (NDAs, DPAs, SLAs, HIPAA BAAs, etc.). LLM populates `{{field}}` templates from plain English; one-click PDF export. JWT auth, document history, guest mode. SolidJS + TypeScript, FastAPI, SQLite, LiteLLM, Docker.

### Portfolio + AI Digital Twin (jimdnguyen.dev)
Personal portfolio with an AI chat widget that answers visitor questions by proxying to an LLM via SSE streaming. SolidJS, FastAPI (Python 3.13), LiteLLM/OpenRouter; deployed on Oracle Cloud free tier via Caddy reverse proxy + Docker Compose.

### Multi-Agent Sales Pipeline — AI Builder (n8n) course capstone
Hands-on capstone built and deployed while completing the AI Builder (n8n) course: a low-code, multi-agent outbound-sales system. A Business Development Manager agent orchestrates Prospecting (Firecrawl + Hunter.io via MCP), RevOps, and SDR sub-agents; an Account Executive agent handles deal recording and demo booking, fronted by an ElevenLabs voice agent reachable over a Twilio phone line, with Pushover notifications. The Prospecting sub-agent was exposed as its own MCP server consumed by an external chat client. Deployed to n8n Cloud and ElevenLabs. n8n, MCP, Firecrawl, Hunter.io, ElevenLabs, Twilio, Pushover.

### Product Expert Voice Agent — AI Builder (n8n) course project
Retrieval-augmented voice agent that answers questions about an electronic-store product catalog. Built an agentic RAG pipeline in n8n: catalog data embedded into a Supabase vector store (pgvector, 1536-dimension embeddings, match_documents retrieval), queried by an ElevenLabs voice agent. Built and deployed on n8n Cloud and ElevenLabs. n8n, ElevenLabs, Supabase (pgvector), RAG, OpenRouter.

## Certifications & Courses

- **AI Coder: Vibe Coder to Agentic Engineer in 3 Weeks** -- Edward Donner / Udemy (2026)
  Topics: Agentic engineering workflows, multi-agent orchestration (sub-agents, swarms, orchestrators), Claude Code, MCP, Hooks, Skills, Claude Agent SDK, Cursor, Copilot, Codex, OpenCode
- **AI Builder: Create Agents, Voice Agents & Automations in n8n** -- Edward Donner / Udemy (2026)
  Topics: n8n workflow automation & agents, voice agents (ElevenLabs STT/TTS), RAG with Supabase vector store (embeddings, match_documents), MCP (Hunter MCP), sub-agents & context engineering, agent security (the "Lethal Trifecta"), self-hosting (Docker, Ollama local models), integrations (OpenRouter, Gmail, Slack, Pushover, Google Sheets/Drive, Firecrawl, Pipedrive CRM)
  Built & deployed 3 end-of-week projects on n8n Cloud + ElevenLabs: an equity-portfolio rebalancing agent (Google Sheets + live market data), a RAG product-expert voice agent (Supabase vector store), and the multi-agent sales-pipeline capstone with an ElevenLabs voice agent

## Skills

- **Languages:** Python, TypeScript, JavaScript, SQL
- **Backend:** Flask, FastAPI, Celery, BullMQ, Redis, PostgreSQL, Supabase, RESTful APIs, AWS Lambda, Spring Boot
- **Frontend:** React, Next.js
- **Cloud/DevOps:** AWS (ECS, ECR, RDS, S3, SQS, Secrets Manager, Route 53, ELB), GCP (Cloud Run, Cloud SQL, Secrets Manager), Railway, Docker, CI/CD, GitHub Actions
- **Observability:** Sentry, Grafana
- **AI/Agentic:** Claude Code, Claude Agent SDK, multi-agent orchestration, parallel subagents, git worktrees, MCP, Hooks, LLM-assisted development workflows
- **Tools:** Auth0, Facebook Marketing API, Linear, JIRA, Git, SendGrid, Slack, Stripe
- **Languages (spoken):** English, Vietnamese
