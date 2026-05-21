# Production Readiness Review

Ngay kiem tra: 2026-05-18

## Ket luan ngan

Du an da co the dong goi va deploy thu len moi truong AWS production-like bang Terraform/ECS.

Chua nen coi la production-ready hoan toan neu chua xu ly cac viec bat buoc ben duoi:

- dien secret/domain that trong `terraform.tfvars`
- bat HTTPS cho ALB bang ACM certificate
- tao SNS topic cho CloudWatch alarms
- chay `terraform validate` tren may co Terraform
- chay migration/seed production co kiem soat
- xac nhan upload file dung S3 that, khong dung MinIO/default credentials
- test OAuth callback voi domain production

## Ket qua kiem tra da chay

### Build

Da chay thanh cong:

```bash
npm run build
```

Lenh nay build:

- `apps/web`
- `apps/api/candidate-service`
- `apps/api/gateway`
- `apps/api/interview-service`
- `apps/api/job-service`
- `apps/api/matching-service`
- `apps/api/notification-service`

Da sua root build script de khong build nham cac workspace library chua hoan chinh.

### Docker Compose

Da chay thanh cong:

```bash
docker compose -f docker-compose.prod.yml config
```

Luu y: compose production van co fallback dev/default values de tien chay local. Khi deploy that, bat buoc dung `.env.production` voi secret that.

### Terraform

Chua chay duoc:

```bash
terraform fmt -recursive infra/terraform
terraform validate
```

Ly do: may hien tai chua cai lenh `terraform`.

## Cac thay doi da thuc hien trong lan review nay

- Sua root `npm run build` de build dung app workspaces.
- Sua root `npm run lint` de lint dung app workspaces.
- Gateway CORS doc domain production tu `FRONTEND_URL`, `FRONTEND_ORIGIN`, hoac `NEXT_PUBLIC_API_URL`.
- Terraform truyen `FRONTEND_URL` va `FRONTEND_ORIGIN` vao gateway task.
- `.env.production.example` co them `FRONTEND_URL` va `FRONTEND_ORIGIN`.

## Blockers truoc khi production that

### 1. HTTPS/domain

Terraform hien moi co ALB HTTP listener port `80`.

Can them truoc production:

- ACM certificate
- ALB listener `443`
- redirect `80 -> 443`
- Route53 record cho frontend/API domain

### 2. Secret management

`terraform.tfvars` khong nen la noi quan ly secret dai han.

Nen chuyen cac gia tri sau sang AWS Secrets Manager hoac SSM Parameter Store:

- `db_password`
- `jwt_secret`
- `jwt_refresh_secret`
- `google_client_secret`
- object storage credentials neu con dung access key/secret

### 3. Object storage

Production nen dung S3/IAM role. Khong dung MinIO credentials mac dinh.

Can xac nhan flow upload/download CV tren ECS voi:

- `STORAGE_BACKEND=s3`
- bucket S3 production
- IAM task role co quyen can thiet

### 4. Database migration

Can co quy trinh migration rieng truoc khi rollout app:

```bash
prisma migrate deploy
```

Khong chay seed test account len production neu khong chu dong chap nhan.

### 5. Monitoring alert notification

Dashboard/alarm da co, nhung alarm chi gui notification khi set:

```hcl
alarm_sns_topic_arn = "arn:aws:sns:ap-southeast-1:<account-id>:<topic-name>"
```

## Go/No-go

Go cho staging/production-like:

- build pass
- Docker Compose config hop le
- health/readiness co san
- Terraform co ECS/RDS/Redis/S3/CloudWatch/tracing

No-go cho production that neu chua lam:

- HTTPS
- real secrets
- Terraform validate
- S3 upload verification
- OAuth production callback verification
- CloudWatch alarm notification

