---
title: 'Re-Comiendo — Restaurant Platform'
summary: 'Multi-tenant restaurant platform: public site, live menu, reservations and orders on Cloudflare Workers, with per-restaurant branding.'
role: Product & Platform Engineering
date: 2026-11-09
tags: [Cloudflare Workers, React 19, D1, R2, TypeScript, Multi-tenant]
url: https://re-comiendo.es
repo: https://github.com/guillermofuentesgfq/restaurant-platform
featured: true
draft: false
---

A multi-tenant platform for restaurants, live at [re-comiendo.es](https://re-comiendo.es).
Each restaurant gets its own subdomain and public site; the platform itself runs
the landing, the signup flow and a separate administration surface.

**Five applications, one Worker**

The platform ships five React SPAs from a single Cloudflare Worker: the public
landing, the platform admin, the restaurant's public site, the restaurant admin
panel and a waiter/orders app. Routing decides between platform and tenant
surfaces before resolving the tenant, so `/platform-admin` and `/api/platform/*`
never depend on a restaurant host. Everything else resolves from the host
(`casa-ana.re-comiendo.es`), and every tenant query is cross-checked against that
resolved slug.

**Tenancy and data**

D1 holds tenants, users, menus, photos, legal acceptances and sessions; R2 holds
menu PDFs, gallery and dish images, private by default. Tenant users authenticate
with a JWT in an httpOnly cookie; platform staff go through Cloudflare Access
(OIDC), with sessions and roles stored in D1. The public site is one SPA that
resolves its tenant from the host and fetches that tenant's data, so theming,
menu, hours and legal pages are configuration rather than a per-restaurant build.

**Shipping to live tenants**

This is not a demo: there are restaurants in production. Migrations are additive
and backwards compatible — new columns arrive nullable or with a default, and old
clients keep working. GitHub Actions runs typecheck, unit tests and the build on
every push; Playwright measures real layouts at four widths and runs both locally
and in the deploy, before migrations and release. Deploys are release-based, and
that browser suite is the last gate before a restaurant sees a change.
