resource "aws_lambda_function" "lambda_function" {
  function_name    = var.function_name
  filename         = var.zip_file
  source_code_hash = filebase64sha256(var.zip_file)
  role             = var.role_arn
  handler          = var.handler
  runtime          = "nodejs18.x"
  timeout          = 30

  environment {
    variables = var.environment_variables
  }
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id             = var.api_gateway_id
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.lambda_function.invoke_arn
}

# Create a route for the specified HTTP method
resource "aws_apigatewayv2_route" "lambda_route" {
  api_id    = var.api_gateway_id
  route_key = "${var.http_method} /${var.path_part}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

# If this is a reminders endpoint, also create a POST route for creating reminders
resource "aws_apigatewayv2_route" "post_lambda_route" {
  count     = var.path_part == "reminders" ? 1 : 0
  api_id    = var.api_gateway_id
  route_key = "POST /${var.path_part}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_lambda_permission" "api_gateway_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_gateway_execution_arn}/*/*"
}
