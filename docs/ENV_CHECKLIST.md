# Env Checklist

## 1. Muc tieu

Tai lieu nay la checklist de dien bien moi truong cho repo truoc khi:

- chay `docker-compose.prod.yml`
- build image production
- deploy len `AWS ECS`

## 2. Bien bat buoc cho tat ca moi truong

- `NODE_ENV`
- `APP_ENV`
- `AWS_REGION`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `DATABASE_URL`

## 3. Frontend `apps/web`

Bat buoc:

- `NEXT_PUBLIC_API_URL`

Luu y:

- Bien nay nen duoc coi la `build-time` cho image `web`
- Khi build Docker image frontend, can truyen gia tri nay bang `--build-arg NEXT_PUBLIC_API_URL=...`
- Neu domain API doi, can build lai image `web`

Vi du:

```bash
docker build \
  -f apps/web/Dockerfile \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com/api \
  -t recruitment/web:prod .
```

## 4. Gateway `apps/api/gateway`

Bat buoc:

- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `CANDIDATE_SERVICE_URL`
- `JOB_SERVICE_URL`
- `INTERVIEW_SERVICE_URL`
- `MATCHING_SERVICE_URL`
- `NOTIFICATION_SERVICE_URL`

Neu dung Google login:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`

Neu van giu co che upload hien tai:

- `MINIO_ENDPOINT`
- `MINIO_PORT`
- `MINIO_ACCESS_KEY`
- `MINIO_SECRET_KEY`
- `MINIO_BUCKET_NAME`
- `STORAGE_BACKEND`
- `STORAGE_USE_SSL`
- `STORAGE_REGION`
- `STORAGE_AUTO_CREATE_BUCKET`
- `STORAGE_PRESIGNED_EXPIRY_SECONDS`

## 5. Backend microservices

Moi service can it nhat:

- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`

Rieng `candidate-service` hien co lien quan upload file, can them:

- `MINIO_ENDPOINT`
- `MINIO_PORT`
- `MINIO_ACCESS_KEY`
- `MINIO_SECRET_KEY`
- `MINIO_BUCKET_NAME`
- `STORAGE_BACKEND`
- `STORAGE_USE_SSL`
- `STORAGE_REGION`
- `STORAGE_AUTO_CREATE_BUCKET`
- `STORAGE_PRESIGNED_EXPIRY_SECONDS`

## 6. Production tren AWS

### 6.1 RDS

- `DATABASE_URL` phai tro den `RDS PostgreSQL`

Vi du:

```env
DATABASE_URL=postgresql://admin:<password>@recruitment-db.xxxxxx.ap-southeast-1.rds.amazonaws.com:5432/recruitment_db?schema=public
```

### 6.2 Service discovery

Gateway phai goi backend bang DNS private, vi du:

```env
CANDIDATE_SERVICE_URL=http://candidate-service.recruitment.local:3001
JOB_SERVICE_URL=http://job-service.recruitment.local:3002
INTERVIEW_SERVICE_URL=http://interview-service.recruitment.local:3003
MATCHING_SERVICE_URL=http://matching-service.recruitment.local:3005
NOTIFICATION_SERVICE_URL=http://notification-service.recruitment.local:3006
```

### 6.3 CloudWatch tracing cho backend

Neu bat `Application Signals + X-Ray`, moi backend container can co:

- `OTEL_RESOURCE_ATTRIBUTES`
- `OTEL_AWS_APPLICATION_SIGNALS_ENABLED`
- `OTEL_METRICS_EXPORTER`
- `OTEL_LOGS_EXPORTER`
- `OTEL_EXPORTER_OTLP_PROTOCOL`
- `OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT`
- `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT`
- `OTEL_TRACES_SAMPLER`
- `OTEL_TRACES_SAMPLER_ARG`
- `OTEL_PROPAGATORS`
- `NODE_OPTIONS`

### 6.4 Object storage tren AWS

Voi code hien tai, `candidate-service` co the noi den:

- `MinIO` khi local
- `Amazon S3` theo kieu `S3-compatible endpoint` khi production

Gia tri goi y cho production:

```env
STORAGE_BACKEND=s3
MINIO_ENDPOINT=s3.ap-southeast-1.amazonaws.com
MINIO_PORT=443
MINIO_BUCKET_NAME=recruitment-cv-storage
STORAGE_USE_SSL=true
STORAGE_REGION=ap-southeast-1
STORAGE_AUTO_CREATE_BUCKET=false
STORAGE_PRESIGNED_EXPIRY_SECONDS=3600
```

Luu y:

- Code van dung ten bien `MINIO_*` de giu tuong thich nguoc
- Khi tro sang AWS, day khong con la MinIO nua ma la endpoint S3-compatible
- `candidate-service` da ho tro AWS SDK native cho `S3`, nen neu chay tren ECS co the bo trong `MINIO_ACCESS_KEY` va `MINIO_SECRET_KEY` de dung IAM task role
- Bucket tren AWS nen duoc tao san, khong de app tu tao

## 7. Nhung diem con thieu trong code hien tai

- Upload file len AWS chua duoc chuyen sang `S3` trong code
- Frontend dung `NEXT_PUBLIC_API_URL`, nen can build lai image khi doi API domain
- Gateway fallback `localhost` neu khong set env day du

## 8. Checklist truoc khi deploy

- Da tao `.env.production` tu file mau
- Da dien `JWT_SECRET` va `JWT_REFRESH_SECRET`
- Da dien `DATABASE_URL`
- Da dien `NEXT_PUBLIC_API_URL`
- Da dien service URLs cho `gateway`
- Da dien `GOOGLE_*` neu can OAuth
- Da quyet dinh dung `MinIO` tam thoi hay sua code sang `S3`
- Neu dung AWS, da dat `STORAGE_BACKEND=s3`
- Neu dung AWS, da doi `MINIO_ENDPOINT` sang endpoint S3 va bat `STORAGE_USE_SSL=true`
