# Setup Guide for AWS Academy Learner Lab

This guide will help you set up the Study Reminders App backend on AWS Academy Learner Lab.

## Prerequisites

1. Access to AWS Academy Learner Lab
2. Git installed on your local machine
3. Node.js and npm installed
4. Terraform installed (optional, can be run via GitHub Actions)

## Step 1: Start AWS Academy Learner Lab

1. Log in to AWS Academy
2. Start your AWS Learner Lab
3. Click on "AWS Details" to get your AWS CLI credentials
4. Copy the credentials for later use

## Step 2: Clone the Repository

```bash
git clone https://github.com/yourusername/study-reminders-app.git
cd study-reminders-app
```

## Step 3: Configure AWS Credentials

You have two options:

### Option 1: Configure AWS CLI locally

```bash
aws configure
```

Enter the credentials from AWS Academy when prompted. Make sure to set the region to `ap-southeast-2`.

### Option 2: Set up environment variables

```bash
export AWS_ACCESS_KEY_ID="your_access_key"
export AWS_SECRET_ACCESS_KEY="your_secret_key"
export AWS_SESSION_TOKEN="your_session_token"
export AWS_REGION="ap-southeast-2"
```

## Step 4: Package Lambda Functions

```bash
cd lambda
chmod +x package.sh
./package.sh
cd ..
```

## Step 5: Deploy with Terraform

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

When prompted, type `yes` to confirm the deployment.

## Step 6: Initialize DynamoDB with Test Data

```bash
cd ../scripts
npm install
node init-db.js
```

## Step 7: Test the API

After deployment, Terraform will output the API URL. Use this URL to test the endpoints:

```bash
# Test authentication
curl -X POST <API_URL>/auth -H "Content-Type: application/json" -d '{"username":"testuser","password":"password"}'

# Test dashboard
curl <API_URL>/dashboard?userId=testuser

# Test reminders
curl <API_URL>/reminders?userId=testuser&action=list
```

## Step 8: Set Up GitHub Actions (Optional)

If you want to use GitHub Actions for CI/CD:

1. In your GitHub repository, go to Settings > Secrets
2. Add the following secrets:
   - `AWS_ACCESS_KEY_ID`: Your AWS access key
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
   - `AWS_SESSION_TOKEN`: Your AWS session token
3. Push changes to the main branch to trigger deployment

## Step 9: Integrate with Mobile App

Update your Android app's configuration to point to the deployed API URL.

## Troubleshooting

### Lambda Function Not Found

If you get an error about Lambda functions not being found:

```bash
cd lambda
./package.sh
cd ../terraform
terraform apply
```

### AWS Credentials Expired

AWS Academy credentials expire after a few hours. If you get authentication errors:

1. Get new credentials from AWS Academy
2. Update your local AWS configuration or GitHub secrets

### API Gateway CORS Issues

If you encounter CORS issues while testing from your app:

1. Check the CORS configuration in the API Gateway module
2. Ensure your app is sending the correct headers

## Shutting Down Resources

When you're done with the lab:

```bash
cd terraform
terraform destroy
```

Then stop your AWS Academy Learner Lab session.
