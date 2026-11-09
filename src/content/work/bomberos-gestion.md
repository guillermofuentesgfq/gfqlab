---
title: 'Bomberos Gestión — Self-hosted Management System'
summary: 'Open-source, self-hosted inventory, personnel and public-site system for Chilean fire brigades: one Worker, D1 and private R2.'
role: Product Engineering
date: 2026-10-31
tags: [Cloudflare Workers, Hono, React 19, D1, R2, TypeScript]
repo: https://github.com/guillermofuentesgfq/bomberos-gestion
featured: true
draft: false
---

An open-source, self-hosted system for fire brigades in Chile: inventory,
personnel, assignments, maintenance and a public institutional website. Each
institution deploys its own installation in its own Cloudflare account; there is
no central platform and no shared database.

**One Worker, one origin**

A single Cloudflare Worker (TypeScript, Hono, Zod) serves both the REST API and
the React SPA, so the browser talks to the same origin: no CORS, session cookies
stay simple and the CSP can remain strict. D1 stores the data, R2 keeps files
private — downloads go through the Worker, which checks session and permission —
and KV is optional cache only.

**Inventory that cannot go negative**

D1 has no interactive transactions across requests, so stock integrity is
enforced by the schema and by `db.batch()`. Subtracting stock is a conditional
`UPDATE` backed by `CHECK (quantity >= 0)`; a batch wraps the stock, assignment
and movement writes so a failure rolls the whole operation back. Sensitive
operations accept an `Idempotency-Key` tied to the caller, so a retry returns the
original response instead of duplicating a delivery. The audit trail is written
after the business operation commits and is deliberately fail-tolerant: losing an
audit row is preferable to losing a real inventory movement.

**Self-hosting as a product constraint**

Every institution runs its own installation, so the project is designed to deploy
from an empty Cloudflare account with documented migrations, backups and a restore
procedure. Roles are granular (admin, inventory, assignments, site editor,
read-only), files are private by default, and the public site is a CMS with
pages, news, activities and galleries rather than hardcoded content.
