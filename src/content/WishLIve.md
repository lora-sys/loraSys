---
title: 'Building WishLive: A Multi-Agent Runtime with Real Economics'
description: 'How I designed and built a runtime system where agents execute, negotiate, and settle — with Solidity smart contracts, Redis event streams, and graceful AI fallback.'
date: '2026-06-14'
categories:
  - engineering
  - hackathon
  - agents
published: true
---

## The Idea

Most agent frameworks treat agents like stateless functions. Call in, response out. No memory, no runtime, no economics.

I wanted something different: **a runtime where agents are first-class actors**. They register, discover each other, negotiate terms, execute work, and settle payments — all inside an event-driven system with observable state.

This is the story of building that system in 48 hours for a hackathon.

---

## Architecture: Six Layers, One Event Bus

The system is structured as six layers, each independently designed but communication-coupled through an event bus:

<svg viewBox="0 0 720 860" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;margin:2rem auto;display:block;font-family:system-ui,-apple-system,sans-serif;">
  <defs>
    <linearGradient id="busGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <linearGradient id="layerGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect x="0" y="0" width="720" height="860" rx="12" fill="#0a0a0f"/>
  <!-- Event Bus -->
  <rect x="60" y="60" width="600" height="36" rx="18" fill="url(#busGrad)" opacity="0.9"/>
  <text x="360" y="84" text-anchor="middle" fill="#fff" font-size="14" font-weight="600">Event Bus — Source of Truth</text>

  <!-- Concierge -->
  <rect x="210" y="116" width="300" height="56" rx="10" fill="url(#layerGrad)" stroke="#8b5cf6" stroke-width="1.5"/>
  <text x="360" y="140" text-anchor="middle" fill="#c4b5fd" font-size="14" font-weight="600">Concierge</text>
  <text x="360" y="158" text-anchor="middle" fill="#94a3b8" font-size="11">LLM-powered observability & explanation</text>
  <line x1="360" y1="172" x2="360" y2="188" stroke="#334155" stroke-width="1.5" stroke-dasharray="4,3"/>

  <!-- Settlement -->
  <rect x="210" y="188" width="300" height="56" rx="10" fill="url(#layerGrad)" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="360" y="212" text-anchor="middle" fill="#fcd34d" font-size="14" font-weight="600">Settlement</text>
  <text x="360" y="230" text-anchor="middle" fill="#94a3b8" font-size="11">Escrow · NFT tickets · on-chain & local</text>
  <line x1="360" y1="244" x2="360" y2="260" stroke="#334155" stroke-width="1.5" stroke-dasharray="4,3"/>

  <!-- Negotiation -->
  <rect x="210" y="260" width="300" height="56" rx="10" fill="url(#layerGrad)" stroke="#10b981" stroke-width="1.5"/>
  <text x="360" y="284" text-anchor="middle" fill="#6ee7b7" font-size="14" font-weight="600">Negotiation</text>
  <text x="360" y="302" text-anchor="middle" fill="#94a3b8" font-size="11">propose · counter · accept · reject → deal</text>
  <line x1="360" y1="316" x2="360" y2="332" stroke="#334155" stroke-width="1.5" stroke-dasharray="4,3"/>

  <!-- Runtime -->
  <rect x="210" y="332" width="300" height="56" rx="10" fill="url(#layerGrad)" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="360" y="356" text-anchor="middle" fill="#93c5fd" font-size="14" font-weight="600">Runtime Engine</text>
  <text x="360" y="374" text-anchor="middle" fill="#94a3b8" font-size="11">AI agent execution · dual-mode · session lifecycle</text>
  <line x1="360" y1="388" x2="360" y2="404" stroke="#334155" stroke-width="1.5" stroke-dasharray="4,3"/>

  <!-- Workflow -->
  <rect x="210" y="404" width="300" height="56" rx="10" fill="url(#layerGrad)" stroke="#06b6d4" stroke-width="1.5"/>
  <text x="360" y="428" text-anchor="middle" fill="#67e8f9" font-size="14" font-weight="600">Workflow</text>
  <text x="360" y="446" text-anchor="middle" fill="#94a3b8" font-size="11">Wish aggregation → threshold → demand → matching</text>
  <line x1="360" y1="460" x2="360" y2="476" stroke="#334155" stroke-width="1.5" stroke-dasharray="4,3"/>

  <!-- Registry -->
  <rect x="210" y="476" width="300" height="56" rx="10" fill="url(#layerGrad)" stroke="#ec4899" stroke-width="1.5"/>
  <text x="360" y="500" text-anchor="middle" fill="#f9a8d4" font-size="14" font-weight="600">Registry</text>
  <text x="360" y="518" text-anchor="middle" fill="#94a3b8" font-size="11">Agent cards · heartbeat · A2A discovery · 57 agents</text>

  <!-- Inbound arrow -->
  <rect x="280" y="558" width="160" height="36" rx="18" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
  <text x="360" y="580" text-anchor="middle" fill="#cbd5e1" font-size="12">User Wish →</text>
  <line x1="360" y1="558" x2="360" y2="540" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow)"/>

  <!-- Side labels: event streams -->
  <rect x="30" y="116" width="140" height="28" rx="6" fill="#1e293b" stroke="#334155" stroke-width="0.5"/>
  <text x="100" y="135" text-anchor="middle" fill="#64748b" font-size="10">agent.runtime</text>
  <rect x="30" y="188" width="140" height="28" rx="6" fill="#1e293b" stroke="#334155" stroke-width="0.5"/>
  <text x="100" y="207" text-anchor="middle" fill="#64748b" font-size="10">settlement.events</text>
  <rect x="30" y="260" width="140" height="28" rx="6" fill="#1e293b" stroke="#334155" stroke-width="0.5"/>
  <text x="100" y="279" text-anchor="middle" fill="#64748b" font-size="10">negotiation.events</text>
  <rect x="30" y="332" width="140" height="28" rx="6" fill="#1e293b" stroke="#334155" stroke-width="0.5"/>
  <text x="100" y="351" text-anchor="middle" fill="#64748b" font-size="10">agent.task</text>
  <rect x="30" y="404" width="140" height="28" rx="6" fill="#1e293b" stroke="#334155" stroke-width="0.5"/>
  <text x="100" y="423" text-anchor="middle" fill="#64748b" font-size="10">wish/demand.events</text>
  <rect x="30" y="476" width="140" height="28" rx="6" fill="#1e293b" stroke="#334155" stroke-width="0.5"/>
  <text x="100" y="495" text-anchor="middle" fill="#64748b" font-size="10">agent.lifecycle</text>

  <!-- Connection lines from bus to layers -->
  <line x1="210" y1="78" x2="210" y2="116" stroke="#6366f1" stroke-width="0.5" opacity="0.3"/>
  <line x1="210" y1="78" x2="210" y2="188" stroke="#6366f1" stroke-width="0.5" opacity="0.3"/>
  <line x1="210" y1="78" x2="210" y2="260" stroke="#6366f1" stroke-width="0.5" opacity="0.3"/>
  <line x1="210" y1="78" x2="210" y2="332" stroke="#6366f1" stroke-width="0.5" opacity="0.3"/>
  <line x1="210" y1="78" x2="210" y2="404" stroke="#6366f1" stroke-width="0.5" opacity="0.3"/>
  <line x1="210" y1="78" x2="210" y2="476" stroke="#6366f1" stroke-width="0.5" opacity="0.3"/>
  <line x1="510" y1="78" x2="510" y2="116" stroke="#6366f1" stroke-width="0.5" opacity="0.3"/>
  <line x1="510" y1="78" x2="510" y2="188" stroke="#6366f1" stroke-width="0.5" opacity="0.3"/>
  <line x1="510" y1="78" x2="510" y2="260" stroke="#6366f1" stroke-width="0.5" opacity="0.3"/>
  <line x1="510" y1="78" x2="510" y2="332" stroke="#6366f1" stroke-width="0.5" opacity="0.3"/>
  <line x1="510" y1="78" x2="510" y2="404" stroke="#6366f1" stroke-width="0.5" opacity="0.3"/>
  <line x1="510" y1="78" x2="510" y2="476" stroke="#6366f1" stroke-width="0.5" opacity="0.3"/>
</svg>

Every layer publishes to typed event streams. The event log is the source of truth — no hidden state.

---

## Layer 1: Registry — The Agent Internet

The registry is the DNS + service discovery for agents. Each agent registers with a typed card:

```typescript
interface AgentCard {
	agent_id: string;
	type: 'musician' | 'venue' | 'manager' | 'audience' | 'business';
	name: string;
	skills: string[];
	reputation: number;
	// ...
}
```

Agents send heartbeats every 60 seconds. If they miss, the registry marks them OFFLINE. The `discover()` method implements an A2A discovery protocol — one agent asks a manager agent to find matching candidates by skill, genre, city, or capacity.

The system seeds 57 agents across 6 types on startup. The `onlineCount()` method tracks availability by type in real time.

**Key runtime behavior**: `ensureSeeded()` auto-seeds on first access, so every service that depends on the registry gets a populated agent network without explicit initialization order.

---

## Layer 2: Wish → Workflow Pipeline

Users submit wishes: "I want to see Artist X in City Y on Date Z." The WishWorkflowService:

1. Aggregates wishes by cohort key (genre + city)
2. Runs an agent to record the wish processing
3. When a cohort reaches threshold (10 wishes), triggers demand creation
4. The matching engine finds candidate musicians and venues from the registry
5. Publishes demand events that drive the rest of the system

The threshold is a deliberate design choice — it prevents premature negotiation on insufficient demand.

---

## Layer 3: Runtime — The Execution Engine

This is the core. `AgentRuntimeService.run()` creates a session, then executes in a loop:

```
session started → agent thinks → tool execution → message → session completed
```

<svg viewBox="0 0 600 480" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;margin:2rem auto;display:block;font-family:system-ui,-apple-system,sans-serif;">
  <defs>
    <linearGradient id="r1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
    <linearGradient id="r2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="r3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="r4" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ec4899"/><stop offset="100%" stop-color="#db2777"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="600" height="480" rx="12" fill="#0a0a0f"/>

  <!-- Loop arrow -->
  <path d="M 460 300 A 130 130 0 0 1 460 130" fill="none" stroke="#475569" stroke-width="2" stroke-dasharray="6,4"/>
  <polygon points="448,130 460,115 472,130" fill="#475569"/>
  <text x="540" y="220" fill="#64748b" font-size="11" transform="rotate(90,540,220)">repeat</text>

  <!-- Step 1 -->
  <rect x="60" y="40" width="480" height="56" rx="10" fill="#0f172a" stroke="url(#r1)" stroke-width="1.5"/>
  <circle cx="90" cy="68" r="12" fill="#3b82f6"/><text x="90" y="73" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">1</text>
  <text x="116" y="64" fill="#93c5fd" font-size="14" font-weight="600">Session Started</text>
  <text x="116" y="82" fill="#64748b" font-size="11">Create session · register telemetry · publish agent.session.started</text>
  <line x1="60" y1="96" x2="60" y2="116" stroke="#334155" stroke-width="2"/>

  <!-- Step 2 -->
  <rect x="60" y="116" width="480" height="56" rx="10" fill="#0f172a" stroke="url(#r2)" stroke-width="1.5"/>
  <circle cx="90" cy="144" r="12" fill="#10b981"/><text x="90" y="149" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">2</text>
  <text x="116" y="140" fill="#6ee7b7" font-size="14" font-weight="600">Agent Thinks</text>
  <text x="116" y="158" fill="#64748b" font-size="11">LLM decides which tools to call · publishes agent.thought event</text>
  <line x1="60" y1="172" x2="60" y2="192" stroke="#334155" stroke-width="2"/>

  <!-- Step 3 -->
  <rect x="60" y="192" width="480" height="56" rx="10" fill="#0f172a" stroke="url(#r3)" stroke-width="1.5"/>
  <circle cx="90" cy="220" r="12" fill="#f59e0b"/><text x="90" y="225" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">3</text>
  <text x="116" y="216" fill="#fcd34d" font-size="14" font-weight="600">Tool Execution</text>
  <text x="116" y="234" fill="#64748b" font-size="11">discover · quote · propose · counter · accept · track reputation</text>
  <line x1="60" y1="248" x2="60" y2="268" stroke="#334155" stroke-width="2"/>

  <!-- Step 4 -->
  <rect x="60" y="268" width="480" height="56" rx="10" fill="#0f172a" stroke="url(#r4)" stroke-width="1.5"/>
  <circle cx="90" cy="296" r="12" fill="#ec4899"/><text x="90" y="301" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">4</text>
  <text x="116" y="292" fill="#f9a8d4" font-size="14" font-weight="600">Session Completed</text>
  <text x="116" y="310" fill="#64748b" font-size="11">Persist session · publish agent.session.completed · push to store</text>

  <!-- Simulated fallback path -->
  <rect x="80" y="360" width="440" height="40" rx="8" fill="none" stroke="#dc2626" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="300" y="385" text-anchor="middle" fill="#f87171" font-size="12">AI API fails → auto-fallback to simulated mode + deterministic tools</text>
  <line x1="300" y1="248" x2="300" y2="360" stroke="#dc2626" stroke-width="1" stroke-dasharray="4,3"/>

  <!-- bottom note -->

<text x="300" y="440" text-anchor="middle" fill="#475569" font-size="11">Every step publishes to agent.runtime event stream · Langfuse telemetry on all sessions</text>
</svg>

The runtime supports **dual-mode execution**:

- **Real mode**: Uses the Vercel AI SDK with `generateText()`, passing runtime tools for discovery, pricing, proposals. The agent decides which tools to call based on the user message.
- **Simulated mode**: Deterministic fallback when no AI provider is configured. Executes the same tool plan but returns structured mock responses.

The graceful degradation is intentional — **simulated mode means I can demo the entire system without an API key**. The switch happens transparently at the session level:

```typescript
if (mode === 'real') {
	try {
		result = await generateWithAISDK(agent, input, session);
	} catch (error) {
		mode = 'simulated'; // graceful fallback
		result = await executePlannedTools(agent, input, session, mode);
	}
} else {
	result = await executePlannedTools(agent, input, session, mode);
}
```

Every step publishes to the `agent.runtime` event stream — thoughts, tool calls, messages, session lifecycle. Langfuse telemetry is wired in for production observability.

---

## Layer 4: Negotiation — Stateful Agent Coordination

The negotiation service models multi-agent coordination as explicit, stateful protocols:

```
create → propose → counter → accept → deal
                    ↓
                 reject
```

Each negotiation has a workflowId, conversationId, and tracks all proposals. The `runAutonomousNegotiation()` method runs the full pipeline automatically:

<svg viewBox="0 0 620 480" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;margin:2rem auto;display:block;font-family:system-ui,-apple-system,sans-serif;">
  <defs>
    <linearGradient id="mBlue" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
    <linearGradient id="mGreen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="mAmber" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="620" height="480" rx="12" fill="#0a0a0f"/>

  <!-- title -->

<text x="310" y="30" text-anchor="middle" fill="#64748b" font-size="12" font-weight="600">AUTONOMOUS NEGOTIATION PROTOCOL</text>

  <!-- lanes -->

<text x="160" y="58" text-anchor="middle" fill="#93c5fd" font-size="12" font-weight="600">Musician Agent</text>
<text x="310" y="58" text-anchor="middle" fill="#64748b" font-size="11">Registry</text>
<text x="460" y="58" text-anchor="middle" fill="#fcd34d" font-size="12" font-weight="600">Venue Agent</text>
<line x1="30" y1="64" x2="590" y2="64" stroke="#1e293b" stroke-width="1"/>

  <!-- dotted lanes -->
  <line x1="230" y1="64" x2="230" y2="440" stroke="#1e293b" stroke-width="1" stroke-dasharray="4,4"/>
  <line x1="390" y1="64" x2="390" y2="440" stroke="#1e293b" stroke-width="1" stroke-dasharray="4,4"/>

  <!-- 1. Match -->
  <rect x="30" y="80" width="180" height="36" rx="8" fill="#0f172a" stroke="#3b82f6" stroke-width="1"/>
  <text x="120" y="103" text-anchor="middle" fill="#93c5fd" font-size="12">1. createNegotiation()</text>
  <line x1="210" y1="98" x2="240" y2="98" stroke="#475569" stroke-width="1.5" stroke-dasharray="4,2"/>

  <!-- 2. Registry lookup -->
  <rect x="250" y="80" width="120" height="36" rx="8" fill="#0f172a" stroke="#6366f1" stroke-width="1"/>
  <text x="310" y="103" text-anchor="middle" fill="#a5b4fc" font-size="11">lookup agents</text>
  <line x1="310" y1="116" x2="310" y2="136" stroke="#334155" stroke-width="1.5"/>

  <!-- 3. Initial Proposal -->
  <rect x="30" y="136" width="180" height="44" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1"/>
  <text x="120" y="156" text-anchor="middle" fill="#6ee7b7" font-size="12">2. sendProposal()</text>
  <text x="120" y="172" text-anchor="middle" fill="#475569" font-size="10">venueFee: 800 · split: 60/40</text>
  <path d="M 210 158 L 230 158 L 230 158 L 390 158" fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#arrowGreen)"/>
  <polygon points="390,153 400,158 390,163" fill="#10b981"/>

  <!-- 4. Counter Proposal -->
  <rect x="410" y="180" width="180" height="44" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="1"/>
  <text x="500" y="200" text-anchor="middle" fill="#fcd34d" font-size="12">3. counterProposal()</text>
  <text x="500" y="216" text-anchor="middle" fill="#475569" font-size="10">venueFee: 1000 · split: 50/50</text>
  <path d="M 410 202 L 230 202 L 210 202" fill="none" stroke="#f59e0b" stroke-width="2"/>
  <polygon points="210,197 200,202 210,207" fill="#f59e0b"/>

  <!-- 5. Accept -->
  <rect x="30" y="250" width="180" height="36" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1"/>
  <text x="120" y="273" text-anchor="middle" fill="#6ee7b7" font-size="12">4. acceptProposal()</text>
  <path d="M 210 268 L 230 268 L 390 268" fill="none" stroke="#10b981" stroke-width="2"/>
  <polygon points="390,263 400,268 390,273" fill="#10b981"/>

  <!-- 6. Deal Created -->
  <rect x="160" y="320" width="300" height="44" rx="22" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
  <text x="310" y="340" text-anchor="middle" fill="#6ee7b7" font-size="14" font-weight="600">Deal Created ✓</text>
  <text x="310" y="356" text-anchor="middle" fill="#475569" font-size="10">ready for settlement → escrow · tickets</text>
  <line x1="310" y1="286" x2="310" y2="320" stroke="#10b981" stroke-width="1.5"/>

  <!-- Reject path -->

<text x="500" y="300" fill="#ef4444" font-size="11" font-style="italic">or → reject → negotiation ends</text>

  <!-- human override -->
  <rect x="100" y="400" width="420" height="36" rx="8" fill="none" stroke="#64748b" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="310" y="423" text-anchor="middle" fill="#64748b" font-size="11">Human-in-the-loop: each step has API endpoints for manual override</text>
</svg>

1. Matches top musician and venue candidates from demand
2. Musician sends initial proposal with terms (venue fee, split percentage)
3. Venue counters with adjusted terms
4. Musician accepts
5. A Deal is created, ready for settlement

The protocol is general enough for human-in-the-loop override — each step has API endpoints for manual accept/reject/counter.

---

## Layer 5: Settlement — Economics On-Chain and Off

Settlement is where execution becomes real. The system supports **dual settlement modes**:

**On-chain (production)**:

- Solidity smart contracts: Escrow (lock/release funds), TicketNFT (mint event tickets), AgentProfile (agent identity)
- Hardhat deployment to local or testnet
- Funds held in escrow until deal confirmed

**Local (development)**:

- Deterministic hash-based transaction IDs
- `localTxHash()` generates consistent 0x-prefixed hashes
- Full simulation of the settlement flow without a blockchain

<svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;margin:2rem auto;display:block;font-family:system-ui,-apple-system,sans-serif;">
  <defs>
    <linearGradient id="s1" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="s2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="600" height="320" rx="12" fill="#0a0a0f"/>

  <!-- title -->

<text x="300" y="30" text-anchor="middle" fill="#64748b" font-size="12">SETTLEMENT PIPELINE</text>
<line x1="160" y1="36" x2="440" y2="36" stroke="#1e293b" stroke-width="1"/>

  <!-- 1. Deal Confirmed -->
  <rect x="30" y="56" width="100" height="44" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="80" y="76" text-anchor="middle" fill="#fcd34d" font-size="11" font-weight="600">Deal</text>
  <text x="80" y="92" text-anchor="middle" fill="#fcd34d" font-size="11" font-weight="600">Confirmed</text>
  <path d="M 130 78 L 160 78" fill="none" stroke="#475569" stroke-width="2"/>

  <!-- Human Gate -->
  <rect x="160" y="56" width="120" height="44" rx="22" fill="none" stroke="#dc2626" stroke-width="2" stroke-dasharray="5,3"/>
  <text x="220" y="76" text-anchor="middle" fill="#f87171" font-size="10">human confirm</text>
  <text x="220" y="92" text-anchor="middle" fill="#f87171" font-size="10">required</text>
  <path d="M 280 78 L 310 78" fill="none" stroke="#475569" stroke-width="2"/>

  <!-- 2. Create Escrow -->
  <rect x="310" y="48" width="100" height="60" rx="8" fill="#0f172a" stroke="url(#s1)" stroke-width="1.5"/>
  <text x="360" y="68" text-anchor="middle" fill="#fcd34d" font-size="11" font-weight="600">Escrow</text>
  <text x="360" y="84" text-anchor="middle" fill="#94a3b8" font-size="10">lock funds</text>
  <text x="360" y="98" text-anchor="middle" fill="#64748b" font-size="9">$1,000</text>

  <!-- branch: on-chain vs local -->
  <path d="M 410 78 L 440 78" fill="none" stroke="#475569" stroke-width="2"/>
  <line x1="440" y1="55" x2="440" y2="135" stroke="#475569" stroke-width="2"/>
  <line x1="440" y1="78" x2="550" y2="55" stroke="#475569" stroke-width="2"/>
  <line x1="440" y1="135" x2="550" y2="135" stroke="#475569" stroke-width="2"/>

  <rect x="450" y="38" width="130" height="34" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="1"/>
  <text x="515" y="58" text-anchor="middle" fill="#6ee7b7" font-size="10">On-chain</text>
  <text x="515" y="68" text-anchor="middle" fill="#475569" font-size="8">Solidity · Hardhat</text>

  <rect x="450" y="118" width="130" height="34" rx="6" fill="#0f172a" stroke="#3b82f6" stroke-width="1"/>
  <text x="515" y="138" text-anchor="middle" fill="#93c5fd" font-size="10">Local</text>
  <text x="515" y="148" text-anchor="middle" fill="#475569" font-size="8">simulated tx hash</text>

  <!-- 3. Execution -->
  <path d="M 360 108 L 360 160" fill="none" stroke="#334155" stroke-width="2"/>
  <rect x="260" y="160" width="200" height="44" rx="8" fill="#0f172a" stroke="#6366f1" stroke-width="1.5"/>
  <text x="360" y="180" text-anchor="middle" fill="#a5b4fc" font-size="11">Agent executes → show happens</text>
  <text x="360" y="196" text-anchor="middle" fill="#475569" font-size="10">settlement.events streamed in real-time</text>
  <path d="M 360 204 L 360 230" fill="none" stroke="#334155" stroke-width="2"/>

  <!-- 4. Release -->
  <rect x="160" y="230" width="120" height="44" rx="22" fill="none" stroke="#dc2626" stroke-width="2" stroke-dasharray="5,3"/>
  <text x="220" y="250" text-anchor="middle" fill="#f87171" font-size="10">human confirm</text>
  <text x="220" y="264" text-anchor="middle" fill="#f87171" font-size="10">required</text>
  <path d="M 280 252 L 310 252" fill="none" stroke="#475569" stroke-width="2"/>

  <rect x="310" y="236" width="100" height="44" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
  <text x="360" y="256" text-anchor="middle" fill="#6ee7b7" font-size="11" font-weight="600">Release</text>
  <text x="360" y="270" text-anchor="middle" fill="#94a3b8" font-size="10">funds distributed</text>

  <!-- 5. Ticket -->
  <path d="M 410 258 L 440 258" fill="none" stroke="#475569" stroke-width="2"/>
  <rect x="440" y="244" width="100" height="36" rx="8" fill="#0f172a" stroke="#ec4899" stroke-width="1.5"/>
  <text x="490" y="260" text-anchor="middle" fill="#f9a8d4" font-size="11" font-weight="600">NFT Ticket</text>
  <text x="490" y="274" text-anchor="middle" fill="#64748b" font-size="9">minted ✓</text>

  <!-- bottom -->

<text x="300" y="310" text-anchor="middle" fill="#475569" font-size="10">All settlement actions require human confirmation before execution</text>
</svg>

The critical design choice: **human confirmation gates**. Every settlement action requires explicit confirmation:

```typescript
async createEscrow(input, options: { confirmed: boolean }) {
  if (!options.confirmed) {
    throw new SettlementError(409, "Human confirmation required");
  }
  // ...
}
```

This prevents autonomous agents from moving real money without oversight.

---

## Layer 6: Concierge — The Observability Layer

The concierge is an LLM-powered interface over the entire runtime. It reads event streams from all layers and answers:

- "What is happening right now?"
- "Why is the negotiation stuck?"
- "What happens next in this workflow?"

It supports both streaming and non-streaming responses, with Langfuse tracking on every interaction. When no AI provider is configured, it falls back to a rule-based simulator that summarizes system state from event data.

---

## The Event Bus: Where Everything Connects

All subsystems communicate through typed event streams. The bus has two implementations:

- **MemoryEventBus**: In-memory array, perfect for development and testing
- **RedisEventBus**: Redis Streams with XADD/XREVRANGE, for production persistence

Event types include:

- `agent.lifecycle` — registration, heartbeat, offline transitions
- `agent.runtime` — session lifecycle, thoughts, tool calls
- `agent.task` — A2A message passing between agents
- `negotiation.events` — proposals, counters, accepts, rejections
- `settlement.events` — escrow creation, fund release, ticket minting
- `wish.events` / `demand.events` / `matching.events` — workflow pipeline

<svg viewBox="0 0 620 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;margin:2rem auto;display:block;font-family:system-ui,-apple-system,sans-serif;">
  <defs>
    <linearGradient id="eBus" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="620" height="280" rx="12" fill="#0a0a0f"/>
  <rect x="210" y="20" width="200" height="36" rx="18" fill="url(#eBus)" opacity="0.9"/>
  <text x="310" y="44" text-anchor="middle" fill="#fff" font-size="13" font-weight="600">Event Bus</text>
  <rect x="160" y="76" width="130" height="28" rx="6" fill="#0f172a" stroke="#3b82f6" stroke-width="1"/>
  <text x="225" y="95" text-anchor="middle" fill="#93c5fd" font-size="10">MemoryEventBus</text>
  <rect x="330" y="76" width="130" height="28" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1"/>
  <text x="395" y="95" text-anchor="middle" fill="#fcd34d" font-size="10">RedisEventBus</text>
  <path d="M 290 38 L 290 76" fill="none" stroke="#475569" stroke-width="1.5"/>
  <line x1="290" y1="86" x2="330" y2="86" stroke="#475569" stroke-width="1.5" stroke-dasharray="4,2"/>
  <text x="225" y="118" fill="#475569" font-size="9" text-anchor="middle">dev / test</text>
  <text x="395" y="118" fill="#475569" font-size="9" text-anchor="middle">production</text>
  <text x="310" y="155" text-anchor="middle" fill="#64748b" font-size="11">Event Streams</text>
  <line x1="80" y1="162" x2="540" y2="162" stroke="#1e293b" stroke-width="1"/>
  <rect x="30" y="178" width="120" height="28" rx="6" fill="#1e293b" stroke="#334155" stroke-width="0.5"/>
  <text x="90" y="197" text-anchor="middle" fill="#a5b4fc" font-size="9">agent.lifecycle</text>
  <rect x="160" y="178" width="120" height="28" rx="6" fill="#1e293b" stroke="#334155" stroke-width="0.5"/>
  <text x="220" y="197" text-anchor="middle" fill="#6ee7b7" font-size="9">agent.runtime</text>
  <rect x="290" y="178" width="120" height="28" rx="6" fill="#1e293b" stroke="#334155" stroke-width="0.5"/>
  <text x="350" y="197" text-anchor="middle" fill="#fcd34d" font-size="9">negotiation.events</text>
  <rect x="420" y="178" width="120" height="28" rx="6" fill="#1e293b" stroke="#334155" stroke-width="0.5"/>
  <text x="480" y="197" text-anchor="middle" fill="#f9a8d4" font-size="9">settlement.events</text>
  <rect x="90" y="216" width="120" height="28" rx="6" fill="#1e293b" stroke="#334155" stroke-width="0.5"/>
  <text x="150" y="235" text-anchor="middle" fill="#67e8f9" font-size="9">wish.events</text>
  <rect x="230" y="216" width="120" height="28" rx="6" fill="#1e293b" stroke="#334155" stroke-width="0.5"/>
  <text x="290" y="235" text-anchor="middle" fill="#f87171" font-size="9">agent.task</text>
  <rect x="370" y="216" width="120" height="28" rx="6" fill="#1e293b" stroke="#334155" stroke-width="0.5"/>
  <text x="430" y="235" text-anchor="middle" fill="#fdba74" font-size="9">contract.events</text>
  <text x="310" y="268" text-anchor="middle" fill="#475569" font-size="10">All events: immutable · traceable · replayable · every envelope has traceId/spanId</text>
</svg>

```typescript
interface EventEnvelope {
	id: string;
	type: string;
	source: string;
	timestamp: number;
	data: Record<string, unknown>;
	metadata: {
		traceId: string;
		spanId: string;
	};
}
```

Every event carries trace context, enabling end-to-end flow reconstruction.

---

## What I Learned

**Graceful degradation is not optional.** The dual-mode runtime (AI + simulated) meant I could develop and demo the entire system without API keys, then flip to real AI when deploying. This pattern should be standard in every agent framework.

**Event-driven architecture makes multi-agent systems debuggable.** Because every agent action is published to typed event streams, I can reconstruct exactly what happened — even across negotiation rounds, session restarts, and settlement failures.

**Human gates are critical for economic execution.** Without explicit confirmation before escrow creation and fund release, autonomous agents become a financial liability. The `confirmed` flag on every settlement method is the simplest correct design.

**57 seed agents = instant ecosystem.** Seeding the registry with diverse agent cards means every demo starts with a populated marketplace. The auto-seeding pattern (first access triggers population) eliminated initialization order bugs entirely.

---

## The Stack

- **Runtime**: TypeScript, Vercel AI SDK, Zod validation
- **Events**: Redis Streams (prod), in-memory (dev)
- **Contracts**: Solidity, Hardhat, viem
- **Frontend**: Next.js 14, Tailwind CSS
- **Observability**: Langfuse
- **Infrastructure**: Docker Compose, pnpm workspace

---

## Final Thought

WishLive started as a hackathon project. But the architecture — a layered runtime with event-driven communication, dual-mode execution, and on-chain settlement — maps to real production concerns. Agents aren't functions you call. They're actors in a system with state, economics, and coordination.

The code is at [github.com/lora-sys/Hackthon](https://github.com/lora-sys/Hackthon).
