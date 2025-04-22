variable "api_name" {
  description = "Name of the API Gateway"
  type        = string
}

variable "api_stage" {
  description = "Stage name for the API Gateway deployment"
  type        = string
  default     = "dev"
}
