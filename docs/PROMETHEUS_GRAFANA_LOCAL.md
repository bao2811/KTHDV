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
