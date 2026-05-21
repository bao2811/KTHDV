# Local Prometheus And Grafana

This setup runs Prometheus and Grafana on your machine and scrapes the public
AWS ALB endpoint for the gateway metrics endpoint.

## 1. Deploy the app with metrics

Build and push the updated service images, then redeploy ECS. At minimum, the
gateway image must include the new `/api/metrics` endpoint.

```bash
docker build -f apps/api/gateway/Dockerfile \
  -t 521590706203.dkr.ecr.ap-southeast-1.amazonaws.com/kthdv/gateway:latest .

docker push 521590706203.dkr.ecr.ap-southeast-1.amazonaws.com/kthdv/gateway:latest

aws ecs update-service \
  --region ap-southeast-1 \
  --cluster kthdv-prod-cluster \
  --service gateway \
  --force-new-deployment
```

After ECS is stable, verify:

```bash
curl http://kthdv-prod-alb-650185044.ap-southeast-1.elb.amazonaws.com/api/metrics
```

## 2. Start local monitoring

```bash
docker compose -f docker-compose.monitoring.yml up -d
```

Open:

- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001`

Grafana login:

```text
admin / admin
```

## 3. Useful Prometheus queries

```promql
up
nodejs_eventloop_lag_seconds
process_cpu_user_seconds_total
process_resident_memory_bytes
nodejs_heap_size_used_bytes
rate(process_cpu_user_seconds_total[5m])
```

## 4. Stop local monitoring

```bash
docker compose -f docker-compose.monitoring.yml down
```

Không cần chạy các container local này nếu bạn đang dùng bản đã deploy trên AWS.

Hiện các container local backend đang Restarting, nghĩa là local stack của bạn đang lỗi và không liên quan trực tiếp tới AWS deploy. Nếu mục tiêu là dùng website trên AWS:

http://kthdv-prod-alb-650185044.ap-southeast-1.elb.amazonaws.com
thì bạn có thể tắt local app containers:

docker compose down
Nếu chỉ muốn dùng Grafana + Prometheus local để monitor AWS, thì chỉ chạy file monitoring:

docker compose -f docker-compose.monitoring.yml up -d
Tức là:

Không cần web, gateway, postgres, redis, minio local.
Cần prometheus và grafana local nếu bạn muốn xem dashboard trên máy.
Prometheus local sẽ scrape AWS endpoint /api/metrics, không cần backend local chạy.
Kiểm tra sau khi chạy monitoring:

docker ps
Bạn chỉ cần thấy recruitment-prometheus và recruitment-grafana là đủ.
