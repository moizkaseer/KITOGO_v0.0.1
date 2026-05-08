# Graph Report - D:/Downlaods/kitogo/KITOGO_v0.0.1  (2026-05-07)

## Corpus Check
- Corpus is ~14,350 words - fits in a single context window. You may not need a graph.

## Summary
- 31 nodes · 21 edges · 15 communities (10 shown, 5 thin omitted)
- Extraction: 57% EXTRACTED · 43% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.84)
- Token cost: 4,200 input · 1,100 output

## Community Hubs (Navigation)
- [[_COMMUNITY_App Shell & Fonts|App Shell & Fonts]]
- [[_COMMUNITY_KITOGO Clinical AI Product|KITOGO Clinical AI Product]]
- [[_COMMUNITY_Build & Lint Config|Build & Lint Config]]
- [[_COMMUNITY_Agent & Dev Rules|Agent & Dev Rules]]
- [[_COMMUNITY_Tailwind & PostCSS|Tailwind & PostCSS]]
- [[_COMMUNITY_Graphify Knowledge Graph|Graphify Knowledge Graph]]
- [[_COMMUNITY_File Icon Asset|File Icon Asset]]
- [[_COMMUNITY_Globe Icon Asset|Globe Icon Asset]]
- [[_COMMUNITY_Window Icon Asset|Window Icon Asset]]

## God Nodes (most connected - your core abstractions)
1. `Home Page Component` - 5 edges
2. `KITOGO Website v1.1.0 â€” Marketing Landing Page` - 4 edges
3. `Root App Layout` - 3 edges
4. `KITOGO AI Patient Triage Agent â€” Clinical-grade AI for 24/7 intake, symptom assessment, and routing` - 3 edges
5. `Next.js App Router Pattern (layout.tsx + page.tsx)` - 3 edges
6. `Next.js Configuration` - 2 edges
7. `AGENTS.md â€” Next.js Agent Rules` - 2 edges
8. `Geist Font System (Geist Sans + Geist Mono via next/font/google)` - 2 edges
9. `Tailwind CSS via PostCSS Plugin Pattern` - 2 edges
10. `ESI (Emergency Severity Index) Triage Protocol` - 2 edges

## Surprising Connections (you probably didn't know these)
- `KITOGO Website v1.1.0 â€” Marketing Landing Page` --semantically_similar_to--> `Home Page Component`  [INFERRED] [semantically similar]
  KITOGO_Website_v1.1.0.html → kitogo/src/app/page.tsx
- `Home Page Component` --references--> `Next.js Logo SVG`  [EXTRACTED]
  kitogo/src/app/page.tsx → kitogo/public/next.svg
- `Home Page Component` --references--> `Vercel Logomark SVG (triangle)`  [EXTRACTED]
  kitogo/src/app/page.tsx → kitogo/public/vercel.svg
- `Geist Font System (Geist Sans + Geist Mono via next/font/google)` --semantically_similar_to--> `Tailwind CSS via PostCSS Plugin Pattern`  [INFERRED] [semantically similar]
  kitogo/src/app/layout.tsx → kitogo/postcss.config.mjs
- `Next.js Project README` --references--> `Next.js App Router Pattern (layout.tsx + page.tsx)`  [EXTRACTED]
  kitogo/README.md → kitogo/src/app/layout.tsx

## Hyperedges (group relationships)
- **Next.js Project Toolchain â€” ESLint + PostCSS/Tailwind + Next Config forming the build and lint pipeline** — eslint_config, postcss_config, next_config [INFERRED 0.85]
- **Next.js App Router Entry Points â€” layout.tsx + page.tsx + next-env.d.ts compose the app shell** — app_layout, app_page, next_env_dts [INFERRED 0.85]
- **KITOGO Clinical Triage Flow â€” AI Agent ingests patient contact, applies ESI protocol, writes structured handoff to EHR** — kitogo_ai_triage_concept, esi_triage_protocol, ehr_structured_handoff [EXTRACTED 0.95]

## Communities (15 total, 5 thin omitted)

### Community 0 - "App Shell & Fonts"
Cohesion: 0.33
Nodes (7): Root App Layout, Home Page Component, Geist Font System (Geist Sans + Geist Mono via next/font/google), Next.js App Router Pattern (layout.tsx + page.tsx), Next.js Logo SVG, Vercel Logomark SVG (triangle), Next.js Project README

### Community 1 - "KITOGO Clinical AI Product"
Cohesion: 0.83
Nodes (4): Structured EHR Handoff â€” Clinical summary written to EHR after triage, ESI (Emergency Severity Index) Triage Protocol, KITOGO AI Patient Triage Agent â€” Clinical-grade AI for 24/7 intake, symptom assessment, and routing, KITOGO Website v1.1.0 â€” Marketing Landing Page

### Community 2 - "Build & Lint Config"
Cohesion: 0.67
Nodes (3): ESLint Configuration, Next.js Configuration, Next.js TypeScript Environment Declarations

### Community 3 - "Agent & Dev Rules"
Cohesion: 0.67
Nodes (3): AGENTS.md â€” Next.js Agent Rules, kitogo/CLAUDE.md â€” Agent Rules Reference, Next.js Breaking Changes Warning â€” read node_modules/next/dist/docs before coding

## Knowledge Gaps
- **13 isolated node(s):** `ESLint Configuration`, `Next.js TypeScript Environment Declarations`, `PostCSS Configuration`, `Root CLAUDE.md â€” Graphify Knowledge Graph Rules`, `kitogo/CLAUDE.md â€” Agent Rules Reference` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Home Page Component` connect `App Shell & Fonts` to `KITOGO Clinical AI Product`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Why does `KITOGO Website v1.1.0 â€” Marketing Landing Page` connect `KITOGO Clinical AI Product` to `App Shell & Fonts`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `Home Page Component` (e.g. with `Root App Layout` and `Next.js App Router Pattern (layout.tsx + page.tsx)`) actually correct?**
  _`Home Page Component` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Root App Layout` (e.g. with `Home Page Component` and `Next.js App Router Pattern (layout.tsx + page.tsx)`) actually correct?**
  _`Root App Layout` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `KITOGO AI Patient Triage Agent â€” Clinical-grade AI for 24/7 intake, symptom assessment, and routing` (e.g. with `ESI (Emergency Severity Index) Triage Protocol` and `Structured EHR Handoff â€” Clinical summary written to EHR after triage`) actually correct?**
  _`KITOGO AI Patient Triage Agent â€” Clinical-grade AI for 24/7 intake, symptom assessment, and routing` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Next.js App Router Pattern (layout.tsx + page.tsx)` (e.g. with `Root App Layout` and `Home Page Component`) actually correct?**
  _`Next.js App Router Pattern (layout.tsx + page.tsx)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ESLint Configuration`, `Next.js TypeScript Environment Declarations`, `PostCSS Configuration` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._