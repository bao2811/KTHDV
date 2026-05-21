# Huong Dan Deploy AWS, Monitoring Va Tracing

## 1. Muc tieu

Tai lieu nay huong dan cach deploy repo hien tai len AWS theo huong:

- `Amazon ECR` de luu Docker image
- `Amazon ECS Fargate` de chay frontend va backend
- `Application Load Balancer (ALB)` de public `gateway`
- `Amazon RDS for PostgreSQL` thay cho Postgres local
- `Amazon ElastiCache for Redis` thay cho Redis local
- `Amazon S3` thay cho MinIO neu muon chay production
- `Amazon CloudWatch Container Insights` de monitor ha tang container
- `CloudWatch Application Signals + AWS X-Ray` de tracing va APM

Tai lieu nay duoc viet theo dung cau truc cua repo hien tai:

- `apps/web`: frontend `Next.js`
- `apps/api/gateway`: API gateway `NestJS`
- `apps/api/candidate-service`
- `apps/api/job-service`
- `apps/api/interview-service`
- `apps/api/matching-service`
- `apps/api/notification-service`

## 2. Kien truc de xuat

### 2.1 Thanh phan chinh

- `web` chay thanh 1 ECS service
- `gateway` chay thanh 1 ECS service public sau ALB
- moi microservice backend chay thanh 1 ECS service private
- `RDS PostgreSQL` dung cho database chinh
- `ElastiCache Redis` dung cho cache hoac queue neu can
- `S3` dung cho upload file thay MinIO

### 2.2 Luong goi

1. User truy cap frontend `web`
2. Frontend goi `gateway` thong qua domain public
3. `gateway` goi cac microservice qua private DNS trong ECS/VPC
4. Cac service truy cap `RDS`, `Redis`, `S3`
5. Telemetry duoc day ve `CloudWatch`, `Application Signals`, `X-Ray`

## 3. Trang thai hien tai cua repo

Repo hien tai co mot so diem anh huong truc tiep den deploy:

- Chua co `Dockerfile` cho tung app
- `docker-compose.yml` moi dung local cho `postgres`, `redis`, `minio`
- Frontend dung `NEXT_PUBLIC_API_URL`
- Gateway goi service bang cac env:
  - `CANDIDATE_SERVICE_URL`
  - `JOB_SERVICE_URL`
  - `INTERVIEW_SERVICE_URL`
  - `MATCHING_SERVICE_URL`
  - `NOTIFICATION_SERVICE_URL`
- Prisma dung `DATABASE_URL`
- Upload file hien dang thiet ke theo `MINIO_*`

Khi len AWS:

- khong dung `localhost` de giao tiep giua cac service
- khong dung MinIO cho production neu muon toi uu van hanh
- nen tach ro public service va private service

## 4. Dich vu AWS can tao

### 4.1 Networking

- 1 `VPC`
- 2 public subnets
- 2 private subnets
- Internet Gateway
- NAT Gateway
- Security Groups rieng cho:
  - `ALB`
  - `ECS services`
  - `RDS`
  - `Redis`

### 4.2 Compute

- 1 `ECS Cluster` dung `Fargate`
- 7 ECS services:
  - `web`
  - `gateway`
  - `candidate-service`
  - `job-service`
  - `interview-service`
  - `matching-service`
  - `notification-service`

### 4.3 Data

- 1 `RDS PostgreSQL`
- 1 `ElastiCache Redis`
- 1 `S3 bucket` cho upload file

### 4.4 Observability

- `CloudWatch Logs`
- `CloudWatch Container Insights`
- `CloudWatch Application Signals`
- `AWS X-Ray`

## 5. Chuan bi Dockerfile

Hien tai repo chua co Dockerfile, can tao it nhat:

- `apps/web/Dockerfile`
- `apps/api/gateway/Dockerfile`
- `apps/api/candidate-service/Dockerfile`
- `apps/api/job-service/Dockerfile`
- `apps/api/interview-service/Dockerfile`
- `apps/api/matching-service/Dockerfile`
- `apps/api/notification-service/Dockerfile`

Muc tieu la moi app build thanh mot image rieng.

### 5.1 Nguyen tac

- Build tai root workspace de resolve `workspaces`
- Runtime image chi chua code can thiet
- Expose dung port cua tung service

### 5.2 Port hien tai

- `web`: `3456`
- `gateway`: `3000`
- `candidate-service`: `3001`
- `job-service`: `3002`
- `interview-service`: `3003`
- `matching-service`: `3005`
- `notification-service`: `3006`

## 6. Day image len Amazon ECR

Can tao 1 ECR repository cho moi app, vi du:

- `recruitment/web`
- `recruitment/gateway`
- `recruitment/candidate-service`
- `recruitment/job-service`
- `recruitment/interview-service`
- `recruitment/matching-service`
- `recruitment/notification-service`

Quy trinh:

1. Build image local
2. Dang nhap ECR
3. Tag image
4. Push image

Vi du:

```bash
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-southeast-1.amazonaws.com
docker build -t recruitment-gateway -f apps/api/gateway/Dockerfile .
docker tag recruitment-gateway:latest <account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/recruitment/gateway:latest
docker push <account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/recruitment/gateway:latest
```

Lam tuong tu voi cac app con lai.

## 7. Tao database va cache

### 7.1 RDS PostgreSQL

Tao `RDS for PostgreSQL`:

- Dat trong private subnet
- Bat backup
- Dat security group chi cho phep ECS truy cap
- Lay endpoint de gan vao `DATABASE_URL`

Vi du:

```env
DATABASE_URL=postgresql://admin:<password>@recruitment-db.xxxxxx.ap-southeast-1.rds.amazonaws.com:5432/recruitment_db?schema=public
```

### 7.2 ElastiCache Redis

Tao `ElastiCache Redis`:

- Dat trong private subnet
- Security group chi cho phep ECS truy cap

Neu service sau nay su dung Redis, dung endpoint private cua Redis.

## 8. Chuyen MinIO sang S3

Trong repo hien tai, upload file van dang nghi ve MinIO:

- `apps/api/gateway/src/file-upload/file-upload.service.ts`
- `apps/api/candidate-service/src/file-upload/file-upload.service.ts`

De deploy production, nen doi sang `Amazon S3`.

Trang thai hien tai cua repo sau khi cap nhat:

- `candidate-service` da ho tro `AWS SDK S3` cho production
- local van co the chay bang `MinIO`
- code van giu ten bien `MINIO_*` de tranh pha vo tuong thich nguoc
- tren ECS co the dung `IAM task role` cho upload vao `S3`

### 8.1 Cach toi thieu

- Tao 1 bucket, vi du `recruitment-cv-storage`
- Them IAM permission `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject`
- Neu muon di nhanh, tro endpoint sang `S3` va cap access key/secret
- Neu deploy tren ECS, uu tien dung `IAM task role` de `candidate-service` truy cap `S3`

### 8.2 Bien moi truong cho S3-compatible mode

Vi du khi tro sang `Amazon S3`:

```env
MINIO_ENDPOINT=s3.ap-southeast-1.amazonaws.com
MINIO_PORT=443
MINIO_ACCESS_KEY=<access-key>
MINIO_SECRET_KEY=<secret-key>
MINIO_BUCKET_NAME=recruitment-cv-storage
STORAGE_USE_SSL=true
STORAGE_REGION=ap-southeast-1
STORAGE_AUTO_CREATE_BUCKET=false
STORAGE_PRESIGNED_EXPIRY_SECONDS=3600
```

### 8.3 Huong production khuyen nghi hon

Voi repo hien tai, huong khuyen nghi la:

- `candidate-service` dung `AWS SDK S3`
- ECS task role cap quyen `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject`
- khong nhung static access key/secret trong task definition neu khong can

## 9. Bien moi truong can chuan bi

### 9.1 Frontend `apps/web`

```env
NEXT_PUBLIC_API_URL=https://api.example.com/api
```

### 9.2 Gateway `apps/api/gateway`

```env
PORT=3000
DATABASE_URL=postgresql://admin:<password>@<rds-endpoint>:5432/recruitment_db?schema=public

CANDIDATE_SERVICE_URL=http://candidate-service:3001
JOB_SERVICE_URL=http://job-service:3002
INTERVIEW_SERVICE_URL=http://interview-service:3003
MATCHING_SERVICE_URL=http://matching-service:3005
NOTIFICATION_SERVICE_URL=http://notification-service:3006

JWT_SECRET=<secret>
JWT_REFRESH_SECRET=<secret>
GOOGLE_CLIENT_ID=<value>
GOOGLE_CLIENT_SECRET=<value>
GOOGLE_CALLBACK_URL=https://api.example.com/api/auth/google/callback

MINIO_ENDPOINT=<s3-or-minio-endpoint>
MINIO_PORT=9000
MINIO_ACCESS_KEY=<value>
MINIO_SECRET_KEY=<value>
MINIO_BUCKET_NAME=cv-storage
```

### 9.3 Cac microservice backend

Moi service can it nhat:

```env
PORT=<service-port>
DATABASE_URL=postgresql://admin:<password>@<rds-endpoint>:5432/recruitment_db?schema=public
JWT_SECRET=<secret>
```

Neu service nao su dung upload file thi them `MINIO_*` hoac bien moi cho S3.

## 10. Tao ECS Cluster va Service

### 10.1 ECS Cluster

Tao 1 cluster Fargate, vi du:

- `recruitment-cluster`

### 10.2 Cach tach service

Nen tao moi app thanh 1 ECS service rieng de:

- scale doc lap
- deploy doc lap
- theo doi log va metric rieng
- tracing ro rang hon

### 10.3 Public va private

- `web`: co the public qua ALB hoac CloudFront
- `gateway`: public qua ALB
- cac microservice con lai: private only

### 10.4 Giao tiep noi bo

Nen dung `ECS Service Connect` hoac `AWS Cloud Map`.

Vi du service DNS:

- `http://candidate-service:3001`
- `http://job-service:3002`
- `http://interview-service:3003`
- `http://matching-service:3005`
- `http://notification-service:3006`

Day la phan rat quan trong vi code hien tai dang fallback ve `localhost`.

## 11. Load Balancer va domain

### 11.1 ALB

Tao `Application Load Balancer`:

- listener `80` chuyen huong sang `443`
- listener `443` forward vao target group cua `gateway`

Neu frontend `web` cung muon chay qua ECS, co the:

- dat them target group cho `web`
- route theo host:
  - `app.example.com` -> `web`
  - `api.example.com` -> `gateway`

### 11.2 SSL

- Tao certificate bang `AWS Certificate Manager`
- Gan vao ALB listener `443`

## 12. CloudWatch Logs

Moi ECS task definition nen cau hinh `awslogs`:

- log group rieng cho moi service
- retention period ro rang

Vi du:

- `/ecs/web`
- `/ecs/gateway`
- `/ecs/candidate-service`
- `/ecs/job-service`
- `/ecs/interview-service`
- `/ecs/matching-service`
- `/ecs/notification-service`

## 13. Bat Container Insights de monitoring

`CloudWatch Container Insights` dung de theo doi:

- CPU
- memory
- network
- task restart
- service health

### 13.1 Bat cho ECS

Bat `Container Insights` cho cluster.

AWS CLI:

```bash
aws ecs update-cluster-settings \
  --cluster recruitment-cluster \
  --settings name=containerInsights,value=enabled
```

Sau khi bat, co the xem metric trong namespace `ECS/ContainerInsights`.

### 13.2 Nen theo doi gi

- CPU va memory cua `gateway`
- restart count cua task
- error spike theo service
- latency khi co tang traffic

### 13.3 Dashboard va alarms trong Terraform

Bo Terraform trong `infra/terraform` da tao san:

- CloudWatch dashboard `<project>-<environment>-overview`
- CPU alarm cho tat ca ECS services
- Memory alarm cho tat ca ECS services
- ALB latency alarm cho `web` va `gateway`
- ALB target 5xx alarm cho `web` va `gateway`

Mac dinh alarms khong gui notification neu chua co SNS topic. De bat gui canh bao, tao SNS topic va dien vao `terraform.tfvars`:

```hcl
alarm_sns_topic_arn = "arn:aws:sns:ap-southeast-1:<account-id>:<topic-name>"
```

Co the tuy chinh nguong canh bao:

```hcl
ecs_cpu_alarm_threshold             = 80
ecs_memory_alarm_threshold          = 85
alb_latency_alarm_threshold_seconds = 1
alb_5xx_alarm_threshold             = 5
```

## 14. Bat tracing va APM bang Application Signals + X-Ray

Day la phan quan trong nhat neu muc tieu la monitoring va tracing.

### 14.1 Muc tieu

Muon nhin thay:

- request tu `gateway` den service nao
- latency cua moi service
- ti le loi
- service map
- trace detail cho tung request

### 14.2 Cach AWS khuyen nghi tren ECS

Dung:

- `CloudWatch agent` sidecar
- `AWS Distro for OpenTelemetry (ADOT)` auto-instrumentation
- `Application Signals`
- `X-Ray`

### 14.3 Thanh phan trong task definition cua backend

Moi backend task nen co 3 containers:

1. app container
2. `ecs-cwagent`
3. `init` container de copy Node auto-instrumentation

### 14.4 Bien moi truong cho app container Node.js

Cho `NestJS` services, them:

```env
OTEL_RESOURCE_ATTRIBUTES=service.name=gateway,deployment.environment=prod
OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true
OTEL_METRICS_EXPORTER=none
OTEL_LOGS_EXPORTER=none
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT=http://localhost:4316/v1/metrics
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://localhost:4316/v1/traces
OTEL_TRACES_SAMPLER=xray
OTEL_TRACES_SAMPLER_ARG=endpoint=http://localhost:2000
OTEL_PROPAGATORS=xray,tracecontext,baggage
NODE_OPTIONS=--require /otel-auto-instrumentation-node/autoinstrumentation.js
```

Moi service doi `service.name` thanh ten service tuong ung:

- `gateway`
- `candidate-service`
- `job-service`
- `interview-service`
- `matching-service`
- `notification-service`

### 14.5 Log correlation

Neu muon lien ket trace voi log, them vao `OTEL_RESOURCE_ATTRIBUTES`:

```env
OTEL_RESOURCE_ATTRIBUTES=service.name=gateway,deployment.environment=prod,aws.log.group.names=/ecs/gateway
```

### 14.6 Kiem tra sau khi bat tracing

Sau khi deploy:

1. Vao `CloudWatch > Application Signals`
2. Kiem tra co xuat hien service hay khong
3. Mo `Service map`
4. Chon 1 request thuc te
5. Xem trace qua `gateway -> service backend`

## 15. Frontend monitoring

### 15.1 Monitoring co ban

Neu `web` chay tren ECS:

- dung `CloudWatch Logs`
- dung `Container Insights`

### 15.2 Real User Monitoring

Neu muon theo doi hieu nang phia trinh duyet, dung them `CloudWatch RUM`.

RUM giup theo doi:

- page load
- JS error
- performance theo browser
- hanh vi user tren frontend

### 15.3 Synthetic monitoring

Neu muon kiem tra endpoint dinh ky, dung `CloudWatch Synthetics`:

- health check frontend
- health check API
- kiem tra login flow co ban

## 16. Trinh tu deploy de xuat

### Buoc 1. Chuan hoa env

- tach env local va env production
- xac dinh day du secret va URL

### Buoc 2. Tao Dockerfile

- tao Dockerfile cho `web`
- tao Dockerfile cho `gateway`
- tao Dockerfile cho cac microservice

### Buoc 3. Tao tai nguyen AWS nen

- VPC
- subnets
- security groups
- RDS
- Redis
- S3
- ECR

### Buoc 4. Push image len ECR

- build image
- push image

### Buoc 5. Tao ECS cluster va task definitions

- tao cluster
- tao task definition cho tung service
- gan env vars
- gan IAM roles

### Buoc 6. Tao ECS services

- `gateway` public
- cac microservice private
- `web` public neu chay bang ECS

### Buoc 7. Bat observability

- logs
- Container Insights
- Application Signals
- X-Ray

### Buoc 8. Test end-to-end

- test frontend goi API
- test gateway goi den moi service
- test trace xuyen service
- test log va metrics

## 17. IAM can luu y

### 17.1 ECS Task Execution Role

Can quyen cho:

- keo image tu ECR
- ghi log len CloudWatch

Thuong dung:

- `AmazonECSTaskExecutionRolePolicy`

### 17.2 ECS Task Role

Can them theo nhu cau:

- truy cap `S3`
- truy cap `Secrets Manager`
- gui telemetry cho `CloudWatch/X-Ray`

Neu dung Application Signals sidecar theo huong dan AWS, task role can co quyen phu hop de gui telemetry.

## 18. Secrets va cau hinh

Khong nen hardcode secret trong task definition.

Nen dung:

- `AWS Secrets Manager` cho:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `JWT_REFRESH_SECRET`
  - `GOOGLE_CLIENT_SECRET`
  - key upload file
- `SSM Parameter Store` cho config khong qua nhay cam

## 19. Nhung diem can sua trong code truoc khi production

### 19.1 Upload file

Code upload hien tai van mang tinh mock/local. Can uu tien sua:

- [apps/api/gateway/src/file-upload/file-upload.service.ts](/home/bao/Downloads/2526II_INT3505_1_Nhom9/apps/api/gateway/src/file-upload/file-upload.service.ts:1)
- [apps/api/candidate-service/src/file-upload/file-upload.service.ts](/home/bao/Downloads/2526II_INT3505_1_Nhom9/apps/api/candidate-service/src/file-upload/file-upload.service.ts:1)

### 19.2 Service URL

Gateway dang fallback ve `localhost`, can deploy bang env production:

- [apps/api/gateway/src/proxy/controllers/candidate-proxy.controller.ts](/home/bao/Downloads/2526II_INT3505_1_Nhom9/apps/api/gateway/src/proxy/controllers/candidate-proxy.controller.ts:1)
- [apps/api/gateway/src/proxy/controllers/job-proxy.controller.ts](/home/bao/Downloads/2526II_INT3505_1_Nhom9/apps/api/gateway/src/proxy/controllers/job-proxy.controller.ts:1)
- [apps/api/gateway/src/proxy/controllers/interview-proxy.controller.ts](/home/bao/Downloads/2526II_INT3505_1_Nhom9/apps/api/gateway/src/proxy/controllers/interview-proxy.controller.ts:1)
- [apps/api/gateway/src/proxy/controllers/matching-proxy.controller.ts](/home/bao/Downloads/2526II_INT3505_1_Nhom9/apps/api/gateway/src/proxy/controllers/matching-proxy.controller.ts:1)
- [apps/api/gateway/src/proxy/controllers/notification-proxy.controller.ts](/home/bao/Downloads/2526II_INT3505_1_Nhom9/apps/api/gateway/src/proxy/controllers/notification-proxy.controller.ts:1)

### 19.3 Frontend API URL

Frontend dang fallback local:

- [apps/web/src/lib/api.ts](/home/bao/Downloads/2526II_INT3505_1_Nhom9/apps/web/src/lib/api.ts:1)
- [apps/web/src/services/auth.service.ts](/home/bao/Downloads/2526II_INT3505_1_Nhom9/apps/web/src/services/auth.service.ts:1)
- [apps/web/src/services/file.service.ts](/home/bao/Downloads/2526II_INT3505_1_Nhom9/apps/web/src/services/file.service.ts:1)

## 20. Kiem tra sau deploy

### 20.1 Chuc nang

- mo frontend thanh cong
- login thanh cong
- gateway goi duoc backend
- ket noi duoc database

### 20.2 Monitoring

- log xuat hien day du trong CloudWatch Logs
- Container Insights co CPU/memory metrics
- ECS service health on dinh

### 20.3 Tracing

- Application Signals hien service map
- co traces trong X-Ray
- nhin thay request tu `gateway` den backend

## 21. Lam bang tay hay IaC

Neu chi can demo nhanh:

- co the tao bang AWS Console

Neu muon chay nghiem tuc:

- nen dung `Terraform` hoac `AWS CDK`

IaC nen bao gom:

- VPC
- ECS
- ECR
- ALB
- RDS
- Redis
- S3
- log groups
- IAM roles
- secrets

## 22. Tai lieu AWS tham khao

- ECS Fargate:
  - https://docs.aws.amazon.com/AmazonECS/latest/developerguide/getting-started-fargate.html
- CloudWatch Container Insights cho ECS:
  - https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-cluster.html
- CloudWatch Application Signals:
  - https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html
- ECS sidecar cho Application Signals:
  - https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-ECS-Sidecar.html
- X-Ray voi OpenTelemetry:
  - https://docs.aws.amazon.com/xray/latest/devguide/xray-opentelemetry.html
- RDS PostgreSQL:
  - https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html
- ElastiCache:
  - https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html
- CloudWatch RUM:
  - https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html
- CloudWatch Synthetics:
  - https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html

## 23. De xuat buoc tiep theo cho repo nay

Thu tu nen lam:

1. Viet Dockerfile cho tung app
2. Chuyen upload file sang S3
3. Tao env production ro rang
4. Dung Terraform/CDK de tao ha tang
5. Deploy `gateway` va 1 service truoc
6. Bat tracing cho `gateway` + 1 backend
7. Hoan tat service con lai

Neu can, co the viet tiep:

- bo `Dockerfile` cho toan bo repo
- file `docker-compose.prod.yml`
- mau `Terraform` cho ECS + RDS + CloudWatch
