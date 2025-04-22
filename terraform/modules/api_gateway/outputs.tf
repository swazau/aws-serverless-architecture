output "api_gateway_id" {
  value = aws_apigatewayv2_api.api_gateway.id
}

output "api_url" {
  value = "${aws_apigatewayv2_api.api_gateway.api_endpoint}/${var.api_stage}"
}

output "api_execution_arn" {
  value = aws_apigatewayv2_api.api_gateway.execution_arn
}
