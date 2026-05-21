output "alb_dns_name" {
  description = "Public DNS of the ALB."
  value       = aws_lb.main.dns_name
}

output "ecs_cluster_name" {
  description = "ECS cluster name."
  value       = aws_ecs_cluster.main.name
}

output "cloudwatch_dashboard_name" {
  description = "CloudWatch dashboard for ECS and ALB service metrics."
  value       = aws_cloudwatch_dashboard.main.dashboard_name
}

output "ecr_repository_urls" {
  description = "ECR repositories for all services."
  value = {
    for name, repo in aws_ecr_repository.service : name => repo.repository_url
  }
}

output "rds_endpoint" {
  description = "RDS endpoint hostname."
  value       = aws_db_instance.postgres.address
}

output "redis_endpoint" {
  description = "Redis endpoint hostname."
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
}

output "upload_bucket_name" {
  description = "S3 bucket used for uploads."
  value       = aws_s3_bucket.uploads.bucket
}

output "service_discovery_namespace" {
  description = "Private DNS namespace used by backend services."
  value       = aws_service_discovery_private_dns_namespace.main.name
}
