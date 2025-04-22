resource "aws_dynamodb_table" "study_reminders_table" {
  name           = var.table_name
  billing_mode   = "PAY_PER_REQUEST"  # On-demand capacity
  hash_key       = "UserId"
  range_key      = "ItemId"

  attribute {
    name = "UserId"
    type = "S"
  }

  attribute {
    name = "ItemId"
    type = "S"
  }

  tags = {
    Name        = var.table_name
    Environment = "dev"
  }
}
