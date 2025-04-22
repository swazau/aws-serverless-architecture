provider "aws" {
  region = var.aws_region
  # For AWS Academy Learner Lab
  # No need to specify credentials here as they will be provided by the environment
}

# DynamoDB Module
module "dynamodb" {
  source     = "./modules/dynamodb"
  table_name = var.dynamodb_table_name
}

# IAM Module
module "iam" {
  source = "./modules/iam"
}

# API Gateway Module
module "api_gateway" {
  source        = "./modules/api_gateway"
  api_name      = "study-reminder-api"
  api_stage     = var.api_stage
}

# Lambda Modules (after API Gateway and DynamoDB are created)
module "auth_lambda" {
  source         = "./modules/lambda"
  function_name  = "auth-function"
  handler        = "index.handler"
  zip_file       = "../lambda/auth/function.zip"
  role_arn       = module.iam.lambda_role_arn
  environment_variables = {
    DYNAMODB_TABLE = module.dynamodb.table_name
  }
  api_gateway_id = module.api_gateway.api_gateway_id
  api_gateway_execution_arn = "${module.api_gateway.api_execution_arn}"
  http_method    = "POST"
  path_part      = "auth"
  depends_on     = [module.dynamodb, module.api_gateway, module.iam]
}

module "dashboard_lambda" {
  source         = "./modules/lambda"
  function_name  = "dashboard-function"
  handler        = "index.handler"
  zip_file       = "../lambda/dashboard/function.zip"
  role_arn       = module.iam.lambda_role_arn
  environment_variables = {
    DYNAMODB_TABLE = module.dynamodb.table_name
  }
  api_gateway_id = module.api_gateway.api_gateway_id
  api_gateway_execution_arn = "${module.api_gateway.api_execution_arn}"
  http_method    = "GET"
  path_part      = "dashboard"
  depends_on     = [module.dynamodb, module.api_gateway, module.iam]
}

module "reminders_lambda" {
  source         = "./modules/lambda"
  function_name  = "reminders-function"
  handler        = "index.handler"
  zip_file       = "../lambda/reminders/function.zip"
  role_arn       = module.iam.lambda_role_arn
  environment_variables = {
    DYNAMODB_TABLE = module.dynamodb.table_name
  }
  api_gateway_id = module.api_gateway.api_gateway_id
  api_gateway_execution_arn = "${module.api_gateway.api_execution_arn}"
  http_method    = "GET"
  path_part      = "reminders"
  depends_on     = [module.dynamodb, module.api_gateway, module.iam]
}

# Outputs
output "api_url" {
  value = module.api_gateway.api_url
}

output "dynamodb_table_name" {
  value = module.dynamodb.table_name
}
