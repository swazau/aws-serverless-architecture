# Setting Up GitHub Secrets for Reminders Testing

To properly test the reminder functionality in GitHub Actions, you need to add the following secrets to your GitHub repository:

## Required Secrets

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `AWS_ACCESS_KEY_ID` | Your AWS access key ID | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret access key | `wJal...` |
| `AWS_REGION` | AWS region for testing | `ap-southeast-2` |
| `TEST_DYNAMODB_TABLE` | DynamoDB table name for testing | `study-reminders-table-test` |
| `TEST_USER_ID` | User ID to use in tests | `test-user-123` |

## How to Add These Secrets

1. Navigate to your GitHub repository
2. Go to Settings > Secrets and variables > Actions
3. Click on "New repository secret"
4. Add each of the secrets listed above

## Important Security Notes

- Use an IAM user with limited permissions for testing
- For the test DynamoDB table, create a separate table for testing purposes
- Never use production credentials in your GitHub secrets
