locals {
  name_prefix = "${var.project_name}-${var.environment}"

  services = {
    web = {
      port          = 3456
      cpu           = 512
      memory        = 1024
      desired_count = var.web_desired_count
      public        = true
      tracing       = false
    }
    gateway = {
      port          = 3000
      cpu           = 512
      memory        = 1024
      desired_count = var.gateway_desired_count
      public        = true
      tracing       = true
    }
    candidate-service = {
      port          = 3001
      cpu           = 512
      memory        = 1024
      desired_count = var.private_service_desired_count
      public        = false
      tracing       = true
    }
    job-service = {
      port          = 3002
      cpu           = 512
      memory        = 1024
      desired_count = var.private_service_desired_count
      public        = false
      tracing       = true
    }
    interview-service = {
      port          = 3003
      cpu           = 512
      memory        = 1024
      desired_count = var.private_service_desired_count
      public        = false
      tracing       = true
    }
    matching-service = {
      port          = 3005
      cpu           = 512
      memory        = 1024
      desired_count = var.private_service_desired_count
      public        = false
      tracing       = true
    }
    notification-service = {
      port          = 3006
      cpu           = 512
      memory        = 1024
      desired_count = var.private_service_desired_count
      public        = false
      tracing       = true
    }
  }

  backend_services = {
    for name, service in local.services : name => service if service.tracing
  }

  database_url = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.postgres.address}:5432/${var.db_name}?schema=public"

  redis_url = "redis://${aws_elasticache_cluster.redis.cache_nodes[0].address}:6379"

  common_backend_env = {
    APP_ENV      = var.environment
    AWS_REGION   = var.aws_region
    DATABASE_URL = local.database_url
    JWT_SECRET   = var.jwt_secret
    REDIS_URL    = local.redis_url
  }

  gateway_env = {
    JWT_REFRESH_SECRET               = var.jwt_refresh_secret
    GOOGLE_CLIENT_ID                 = var.google_client_id
    GOOGLE_CLIENT_SECRET             = var.google_client_secret
    GOOGLE_CALLBACK_URL              = var.google_callback_url
    FRONTEND_URL                     = var.frontend_origin
    FRONTEND_ORIGIN                  = var.frontend_origin
    CANDIDATE_SERVICE_URL            = "http://candidate-service.${var.private_dns_namespace}:3001"
    JOB_SERVICE_URL                  = "http://job-service.${var.private_dns_namespace}:3002"
    INTERVIEW_SERVICE_URL            = "http://interview-service.${var.private_dns_namespace}:3003"
    MATCHING_SERVICE_URL             = "http://matching-service.${var.private_dns_namespace}:3005"
    NOTIFICATION_SERVICE_URL         = "http://notification-service.${var.private_dns_namespace}:3006"
    STORAGE_BACKEND                  = "s3"
    STORAGE_USE_SSL                  = "true"
    STORAGE_REGION                   = var.aws_region
    STORAGE_AUTO_CREATE_BUCKET       = "false"
    STORAGE_PRESIGNED_EXPIRY_SECONDS = "3600"
    MINIO_ENDPOINT                   = "s3.${var.aws_region}.amazonaws.com"
    MINIO_PORT                       = "443"
    MINIO_ACCESS_KEY                 = var.object_storage_access_key
    MINIO_SECRET_KEY                 = var.object_storage_secret_key
    MINIO_BUCKET_NAME                = var.upload_bucket_name
  }

  candidate_service_env = {
    STORAGE_BACKEND                  = "s3"
    STORAGE_USE_SSL                  = "true"
    STORAGE_REGION                   = var.aws_region
    STORAGE_AUTO_CREATE_BUCKET       = "false"
    STORAGE_PRESIGNED_EXPIRY_SECONDS = "3600"
    MINIO_ENDPOINT                   = "s3.${var.aws_region}.amazonaws.com"
    MINIO_PORT                       = "443"
    MINIO_ACCESS_KEY                 = var.object_storage_access_key
    MINIO_SECRET_KEY                 = var.object_storage_secret_key
    MINIO_BUCKET_NAME                = var.upload_bucket_name
  }

  service_specific_env = {
    gateway              = merge(local.common_backend_env, local.gateway_env)
    candidate-service    = merge(local.common_backend_env, local.candidate_service_env)
    job-service          = local.common_backend_env
    interview-service    = local.common_backend_env
    matching-service     = local.common_backend_env
    notification-service = local.common_backend_env
  }
}
