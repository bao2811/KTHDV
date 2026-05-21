# Terraform Mau Cho ECS + CloudWatch Tracing

## 1. Pham vi

Bo Terraform nay tao san:

- `VPC`, public/private subnets, NAT
- `ALB`
- `ECS Fargate cluster`
- `ECR repositories` cho moi service
- `RDS PostgreSQL`
- `ElastiCache Redis`
- `S3 bucket` cho upload
- `CloudWatch log groups`
- `CloudWatch dashboard`
- `CloudWatch alarms` cho ECS CPU/memory va ALB latency/5xx
- `Cloud Map` service discovery
- `ECS task definitions` cho:
  - `web`
  - `gateway`
  - `candidate-service`
  - `job-service`
  - `interview-service`
  - `matching-service`
  - `notification-service`
- `CloudWatch agent + ADOT` sidecar cho tracing backend

## 2. Diem can hieu dung

Day la stack mau co the dung lam nen tang. Ban van can:

- build va push Docker image len ECR
- dien cac gia tri secret trong `terraform.tfvars`
- xac nhan route/domain phu hop
- sua logic upload file sang `S3` neu muon production dung nghia

Luu y rieng ve upload:

- `candidate-service` da ho tro `AWS SDK S3` cho production
- local van giu duoc flow `MinIO`
- Tren ECS, neu dung IAM task role cho `S3`, co the de trong `object_storage_access_key` va `object_storage_secret_key`
- Hai bien access key/secret van duoc giu lai de ho tro truong hop muon noi den mot `S3-compatible` storage khac

## 3. Thu tu su dung

### 3.1 Dien bien

```bash
cp infra/terraform/terraform.tfvars.example infra/terraform/terraform.tfvars
```

Sua cac gia tri:

- `db_password`
- `jwt_secret`
- `jwt_refresh_secret`
- `google_client_id`
- `google_client_secret`
- `google_callback_url`
- `next_public_api_url`
- `object_storage_access_key` neu can
- `object_storage_secret_key` neu can

### 3.2 Khoi tao Terraform

```bash
cd infra/terraform
terraform init
terraform plan
terraform apply
```

### 3.3 Lay output

```bash
terraform output
```

Can dac biet quan tam:

- `alb_dns_name`
- `ecr_repository_urls`
- `rds_endpoint`
- `redis_endpoint`
- `cloudwatch_dashboard_name`

## 4. Monitoring va alerting

Terraform tao san dashboard va alarms:

- Dashboard: `<project>-<environment>-overview`
- CPU alarm cho tat ca ECS services
- Memory alarm cho tat ca ECS services
- ALB latency alarm cho `web` va `gateway`
- ALB target 5xx alarm cho `web` va `gateway`

Neu muon alarm gui notification, tao SNS topic va dien:

```hcl
alarm_sns_topic_arn = "arn:aws:sns:ap-southeast-1:<account-id>:<topic-name>"
```

Neu de rong, alarms van duoc tao de xem tren CloudWatch nhung khong gui email/Slack.

## 5. Build va push image

Sau khi co ECR URLs, build va push image cho tung service.

### 5.1 Login ECR

```bash
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-southeast-1.amazonaws.com
```

### 5.2 Frontend `web`

Frontend can build voi `NEXT_PUBLIC_API_URL` dung.

```bash
docker build \
  -f apps/web/Dockerfile \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com/api \
  -t recruitment/web:latest .
```

### 5.3 Backend

Vi du voi `gateway`:

```bash
docker build -f apps/api/gateway/Dockerfile -t recruitment/gateway:latest .
```

Sau do tag va push len ECR.

## 6. Application Signals va X-Ray

Task definitions backend da duoc gan:

- `CloudWatch agent sidecar`
- `ADOT Node auto-instrumentation init container`
- `OTEL_*` env vars cho Node.js

Tuy vay, tren mot so tai khoan ban van nen vao `CloudWatch > Application Signals` de bat tinh nang nay o cap account neu AWS console yeu cau.

## 7. Luu y quan trong voi repo nay

### 7.1 `NEXT_PUBLIC_API_URL`

Gia tri nay duoc dung boi frontend va nen duoc coi la `build-time`.

Neu URL API doi:

- can build lai image `web`

### 7.2 Upload file

Code hien tai chua chuyen day du sang `S3`.

Terraform co tao:

- `S3 bucket`

Nhung phan code upload:

- `apps/api/gateway/src/file-upload/file-upload.service.ts`
- `apps/api/candidate-service/src/file-upload/file-upload.service.ts`

van can sua neu muon production dung AWS-native hoan toan.

### 7.3 Service URLs

Gateway tren ECS duoc cau hinh goi backend bang DNS private:

- `candidate-service.recruitment.local`
- `job-service.recruitment.local`
- `interview-service.recruitment.local`
- `matching-service.recruitment.local`
- `notification-service.recruitment.local`

## 8. File lien quan

- [docker-compose.prod.yml](/home/bao/Downloads/2526II_INT3505_1_Nhom9/docker-compose.prod.yml:1)
- [.env.production.example](/home/bao/Downloads/2526II_INT3505_1_Nhom9/.env.production.example:1)
- [docs/MONITORING_TRACING_AUDIT.md](/home/bao/Downloads/2526II_INT3505_1_Nhom9/docs/MONITORING_TRACING_AUDIT.md:1)
- [docs/ENV_CHECKLIST.md](/home/bao/Downloads/2526II_INT3505_1_Nhom9/docs/ENV_CHECKLIST.md:1)
- [docs/AWS_DEPLOYMENT_GUIDE.md](/home/bao/Downloads/2526II_INT3505_1_Nhom9/docs/AWS_DEPLOYMENT_GUIDE.md:1)
