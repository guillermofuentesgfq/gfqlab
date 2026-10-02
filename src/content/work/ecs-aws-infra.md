---
title: 'ECS on AWS — Infrastructure as Code'
summary: 'A production-grade AWS stack in Terraform: VPC, ECS Fargate, RDS PostgreSQL and a canary deployment pipeline.'
role: Infrastructure & Platform Engineering
date: 2026-06-30
tags: [Terraform, AWS, ECS Fargate, RDS, CodePipeline, WAF]
repo: https://github.com/guillermofuentesgfq/ecs-aws-infra
featured: true
draft: false
---

A proof of concept for provisioning a complete, production-shaped AWS stack from
an empty account with a single `terraform apply`. The point is not that ECS
Fargate exists — it is that every decision behind the stack is written down as
an Architecture Decision Record, so the reasoning survives the person who made
it.

**Two repos, two lifecycles**

Infrastructure and application live in separate repositories on purpose. The
CodePipeline pipeline watches the application repo only, so an infrastructure
change never triggers an application deploy, and the two can carry different
access controls. This is [ADR-009](/work/ecs-aws-infra), and it is the decision
most worth defending in a review.

**The stack**

Five layers, each with its own set of ADRs:

- **Networking** — VPC across 3 availability zones, public and private subnets, NAT gateways, and VPC endpoints (S3 gateway plus interface endpoints for ECR, Logs, Secrets Manager and X-Ray) so that traffic to AWS services bypasses NAT entirely.
- **Compute** — ALB fronted by WAFv2, ECS Fargate cluster, FARGATE_SPOT capacity provider.
- **Data** — RDS PostgreSQL Multi-AZ with a read replica, Secrets Manager for credentials, one KMS CMK per purpose with annual rotation.
- **CI/CD** — CodePipeline and CodeBuild deploying to ECR, with CodeDeploy canary at `10% for 5 minutes` and automatic rollback on a 5xx rate above 1%.
- **Observability** — CloudWatch dashboard, X-Ray tracing, SNS alarms.

**Decisions worth arguing about**

Nine ADRs in total. The three that changed the shape of the project:

- **Fargate over EKS** — roughly 200 lines of Terraform instead of 500+, with no nodes to patch. The trade is losing the escape hatch when a workload needs something Fargate will not run.
- **RDS PostgreSQL over Aurora** — Multi-AZ gives automatic failover and a read replica scales reads independently, at roughly a third of Aurora's cost.
- **FARGATE_SPOT at a 50/50 weight split** with `base: 1` on On-Demand — about half the compute cost, and `base: 1` guarantees the service cannot be interrupted entirely by a capacity eviction.

**What it is not**

This is not a production system. It is a demonstration that the pieces fit
together and that the decisions behind them are explicit. The architecture
diagram, the ADR set and the module boundaries are the real artifact.