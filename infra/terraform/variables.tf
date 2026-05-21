variable "aws_region" {
  description = "AWS region to deploy into."
  type        = string
  default     = "ap-southeast-1"
}

variable "project_name" {
  description = "Project name prefix."
  type        = string
  default     = "recruitment"
}

variable "environment" {
  description = "Environment name."
  type        = string
  default     = "prod"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "AZs for public/private subnets."
  type        = list(string)
  default     = ["ap-southeast-1a", "ap-southeast-1b"]
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDRs."
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "Private subnet CIDRs."
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "db_name" {
  description = "PostgreSQL database name."
  type        = string
  default     = "recruitment_db"
}

variable "db_username" {
  description = "PostgreSQL master username."
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "PostgreSQL master password."
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS instance class."
  type        = string
  default     = "db.t4g.micro"
}

variable "db_allocated_storage" {
  description = "RDS allocated storage in GB."
  type        = number
  default     = 20
}

variable "redis_node_type" {
  description = "ElastiCache node type."
  type        = string
  default     = "cache.t4g.micro"
}

variable "container_image_tag" {
  description = "Docker image tag expected in ECR."
  type        = string
  default     = "latest"
}

variable "web_desired_count" {
  description = "Desired ECS tasks for web."
  type        = number
  default     = 1
}

variable "gateway_desired_count" {
  description = "Desired ECS tasks for gateway."
  type        = number
  default     = 1
}

variable "private_service_desired_count" {
  description = "Desired ECS tasks for private backend services."
  type        = number
  default     = 1
}

variable "log_retention_days" {
  description = "CloudWatch log retention."
  type        = number
  default     = 14
}

variable "alarm_sns_topic_arn" {
  description = "Optional SNS topic ARN used by CloudWatch alarms. Leave empty to create alarms without notifications."
  type        = string
  default     = ""
}

variable "ecs_cpu_alarm_threshold" {
  description = "Average ECS service CPU utilization percentage that triggers an alarm."
  type        = number
  default     = 80
}

variable "ecs_memory_alarm_threshold" {
  description = "Average ECS service memory utilization percentage that triggers an alarm."
  type        = number
  default     = 85
}

variable "alb_latency_alarm_threshold_seconds" {
  description = "Average ALB target response time in seconds that triggers an alarm."
  type        = number
  default     = 1
}

variable "alb_5xx_alarm_threshold" {
  description = "ALB target 5xx count per evaluation period that triggers an alarm."
  type        = number
  default     = 5
}

variable "private_dns_namespace" {
  description = "Private DNS namespace for service discovery."
  type        = string
  default     = "recruitment.local"
}

variable "frontend_origin" {
  description = "Frontend origin allowed by backend CORS."
  type        = string
  default     = "http://localhost:3456"
}

variable "next_public_api_url" {
  description = "Public API URL embedded into the frontend build."
  type        = string
  default     = "http://localhost:3000/api"
}

variable "google_client_id" {
  description = "Google OAuth client ID."
  type        = string
  default     = ""
}

variable "google_client_secret" {
  description = "Google OAuth client secret."
  type        = string
  sensitive   = true
  default     = ""
}

variable "google_callback_url" {
  description = "Google OAuth callback URL."
  type        = string
  default     = "http://localhost:3000/api/auth/google/callback"
}

variable "jwt_secret" {
  description = "JWT access token secret."
  type        = string
  sensitive   = true
}

variable "jwt_refresh_secret" {
  description = "JWT refresh token secret."
  type        = string
  sensitive   = true
}

variable "upload_bucket_name" {
  description = "S3 bucket for uploaded files."
  type        = string
  default     = "recruitment-cv-storage"
}

variable "object_storage_access_key" {
  description = "Temporary access key for S3-compatible upload flow used by current app code."
  type        = string
  sensitive   = true
  default     = ""
}

variable "object_storage_secret_key" {
  description = "Temporary secret key for S3-compatible upload flow used by current app code."
  type        = string
  sensitive   = true
  default     = ""
}

variable "cloudwatch_agent_image" {
  description = "CloudWatch agent image for ECS sidecar."
  type        = string
  default     = "public.ecr.aws/cloudwatch-agent/cloudwatch-agent:latest"
}

variable "adot_node_auto_instrumentation_image" {
  description = "ADOT Node.js auto instrumentation image."
  type        = string
  default     = "public.ecr.aws/aws-observability/adot-autoinstrumentation-node:v0.8.0"
}
