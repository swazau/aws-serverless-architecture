output "table_name" {
  value = aws_dynamodb_table.study_reminders_table.name
}

output "table_arn" {
  value = aws_dynamodb_table.study_reminders_table.arn
}
