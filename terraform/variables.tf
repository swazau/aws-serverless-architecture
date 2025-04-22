variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "ap-southeast-2"  # Changed to Sydney region
}

variable "dynamodb_table_name" {
  description = "Name of the DynamoDB table"
  type        = string
  default     = "study-reminders-table"
}

variable "api_stage" {
  description = "Stage name for the API Gateway deployment"
  type        = string
  default     = "dev"
}
