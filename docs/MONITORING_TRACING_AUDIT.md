# Monitoring Va Tracing Audit

Ngay kiem tra: 2026-05-18

## Ket luan

Du an da co nen tang monitoring va tracing cho production AWS.

Da co:

- Health endpoint cho cac service backend: `/health`
- Readiness endpoint cho cac service backend: `/ready`
- Readiness endpoint cho gateway qua global prefix: `/api/ready`
- Readiness endpoint cho Next.js web: `/ready`
- Docker healthcheck trong `docker-compose.prod.yml`
- ECS healthcheck trong Terraform
- CloudWatch Logs cho tung ECS service
- CloudWatch Container Insights cho ECS cluster
- CloudWatch Application Signals + AWS X-Ray tracing cho backend NestJS bang ADOT auto-instrumentation
- CloudWatch dashboard va alarm co ban cho ECS/ALB

Chua nen coi la hoan tat neu chua:

- tao SNS topic/email/Slack webhook va gan vao `alarm_sns_topic_arn`
- chay traffic that qua he thong de xac nhan traces xuat hien trong `Application Signals` va `X-Ray`
- cau hinh HTTPS/domain production cho ALB
- chuyen secret production sang Secret Manager/SSM thay vi hard-code trong tfvars

## Vi tri trong source

### Health va readiness

- `apps/api/gateway/src/app.controller.ts`
- `apps/api/candidate-service/src/app.controller.ts`
- `apps/api/job-service/src/app.controller.ts`
- `apps/api/interview-service/src/app.controller.ts`
- `apps/api/matching-service/src/app.controller.ts`
- `apps/api/notification-service/src/app.controller.ts`
- `apps/web/src/app/health/route.ts`
- `apps/web/src/app/ready/route.ts`

### Docker production healthcheck

- `docker-compose.prod.yml`

### AWS monitoring va tracing

- `infra/terraform/main.tf`
- `infra/terraform/variables.tf`
- `infra/terraform/outputs.tf`
- `infra/terraform/terraform.tfvars.example`

Terraform tao:

- log group `/ecs/<project>-<env>/<service>`
- log group rieng cho CloudWatch agent sidecar
- ECS cluster bat `containerInsights`
- CloudWatch dashboard `<project>-<env>-overview`
- CPU/memory alarm cho tat ca ECS services
- ALB latency va target 5xx alarm cho `web` va `gateway`
- CloudWatch agent sidecar cho backend services
- ADOT Node.js auto-instrumentation init container cho backend services
- bien `OTEL_*` va `NODE_OPTIONS` de bat tracing tu dong

## Cach deploy len AWS production

Dung tai lieu chinh:

- [AWS_DEPLOYMENT_GUIDE.md](/home/bao/Downloads/2526II_INT3505_1_Nhom9/docs/AWS_DEPLOYMENT_GUIDE.md:1)
- [infra/terraform/README.md](/home/bao/Downloads/2526II_INT3505_1_Nhom9/infra/terraform/README.md:1)

Luon chay theo thu tu:

1. Dien `infra/terraform/terraform.tfvars`
2. `terraform init`
3. `terraform plan`
4. `terraform apply`
5. Build/tag/push Docker images len ECR
6. Force new deployment ECS
7. Kiem tra ALB `/ready` va `/api/ready`
8. Kiem tra CloudWatch Logs, dashboard, alarms, Application Signals, X-Ray

## Kiem tra sau deploy

### Endpoint

```bash
curl http://<alb-dns>/ready
curl http://<alb-dns>/api/ready
curl http://<alb-dns>/api/health
```

### CloudWatch

Kiem tra:

- `CloudWatch > Dashboards > <project>-<env>-overview`
- `CloudWatch > Log groups > /ecs/<project>-<env>/<service>`
- `CloudWatch > Alarms`
- `CloudWatch > Container Insights`
- `CloudWatch > Application Signals`
- `X-Ray > Traces`

### Alarm notification

Neu can gui canh bao qua email:

1. Tao SNS topic.
2. Subscribe email vao topic.
3. Confirm email subscription.
4. Gan topic ARN vao `alarm_sns_topic_arn` trong `terraform.tfvars`.
5. Chay lai `terraform apply`.

