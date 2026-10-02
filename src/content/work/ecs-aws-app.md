---
title: 'ECS on AWS — Go Service'
summary: A Go service on ECS Fargate with X-Ray tracing, graceful shutdown and three health endpoints that each do one job.
role: Backend Engineering
date: 2026-06-30
tags: [Go, Docker, AWS X-Ray, PostgreSQL, ECS Fargate]
repo: https://github.com/guillermofuentesgfq/ecs-aws-app
featured: true
draft: false
---

The application half of [ecs-aws-infra](/work/ecs-aws-infra). Three endpoints,
each answering a different question, and the distinction between them is the
part that matters.

**Three kinds of health**

| Endpoint | Checks | Used by |
| --- | --- | --- |
| `/health` | Nothing — returns immediately | ALB target group, liveness |
| `/ready` | `SELECT 1` against RDS | CodeDeploy `BeforeAllowTraffic` |
| `/api/db` | Query latency, wrapped in an X-Ray subsegment | Tracing and dashboards |

Keeping `/health` free of dependencies is deliberate. A liveness probe that
calls the database reports the database as unhealthy when the *task* is the
problem, and the orchestrator then restarts a container that was never broken.
`/ready` is the one that touches RDS, and it is wired to the canary deploy hook
so traffic never reaches a task that cannot serve it.

**The image**

Multi-stage build onto a distroless base: about 10 MB, no shell, no CVEs from a
base image, low memory footprint, and the native AWS X-Ray SDK. The container
handles `SIGTERM` gracefully so CodeDeploy's deregistration delay does not cut
live requests — which is the single most common way a canary deploy produces an
outage it was supposed to prevent.

**Configuration**

Everything comes from environment variables: `PORT`, the five `DB_*` values, and
`AWS_XRAY_DAEMON_ADDRESS` pointing at the daemon sidecar. `DB_SSLMODE` defaults
to `require` rather than something permissive, so a misconfigured environment
fails closed instead of opening a plaintext connection.