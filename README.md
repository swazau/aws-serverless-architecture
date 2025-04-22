# AWS Serverless Architecture with Terraform

A complete serverless backend infrastructure deployed on AWS using a modular Function-as-a-Service (FaaS) approach. This project demonstrates infrastructure as code with Terraform for deploying serverless architectures on AWS.

## Architecture Overview

This project implements a complete serverless architecture following a Function-as-a-Service (FaaS) approach:

- **Lambda Functions**: Individual microservices for different business domains
- **API Gateway**: HTTP endpoints for service exposure
- **DynamoDB**: NoSQL database for persistent storage
- **IAM Roles & Policies**: Least-privilege security model for AWS resources
- **Terraform**: Infrastructure as Code for automated deployment

## Technical Implementation

### Backend Components

| Component | Purpose | AWS Service |
|-----------|---------|-------------|
| Authentication Service | User authentication | Lambda + DynamoDB |
| Dashboard Service | Aggregated data retrieval | Lambda + DynamoDB |
| Reminders Service | Data management | Lambda + DynamoDB |
| API Layer | HTTP interface | API Gateway |
| Persistence Layer | Data storage | DynamoDB |

### Data Model

DynamoDB uses a single-table design with the following structure:

- **Partition Key**: `UserId` (identifies the user)
- **Sort Key**: `ItemId` (categorises different types of data)
- **Item Types**:
  - `PROFILE`: User profile information
  - `PROGRESS_*`: Progress records
  - `REMINDER_*`: Reminders data

### API Endpoints

| Endpoint | Method | Purpose | Query Parameters | Request Body |
|----------|--------|---------|-----------------|--------------|
| `/auth` | POST | Authentication | - | `{"username": "string", "password": "string"}` |
| `/dashboard` | GET | Retrieve aggregated data | `userId` | - |
| `/reminders` | GET | List reminders | `userId`, `action=list` | - |
| `/reminders` | POST | Create data | `userId`, `action=create` | `{"subject": "string", "topic": "string", "reminderTime": "ISO-string"}` |

## Getting Started

### Prerequisites

- AWS Account
- Terraform installed locally
- Node.js and npm for Lambda function development
- Git for version control

### Deployment 

#### Manual Deployment

1. Clone the repository:
   ```bash
   git clone https://github.com/swazau/aws-serverless-architecture.git
   cd aws-serverless-architecture
   ```

2. Package the Lambda functions:
   ```bash
   cd lambda
   chmod +x package.sh
   ./package.sh
   cd ..
   ```

3. Deploy the infrastructure using Terraform:
   ```bash
   cd terraform
   terraform init
   terraform apply
   ```

4. Initialise the database with test data:
   ```bash
   cd ../scripts
   npm install
   node init-db.js
   ```

#### CI/CD Deployment

This repository includes GitHub Actions workflow for automated deployment:

1. Fork this repository to your GitHub account
2. Set up the following secrets in your GitHub repository:
   - `AWS_ACCESS_KEY_ID`: Your AWS access key
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
   - `AWS_REGION`: Your preferred AWS region (e.g., ap-southeast-2)

3. Push changes to the main branch to trigger the deployment

### Testing the API

Once deployed, you can test the API using curl:

```bash
# Authenticate a user
curl -X POST "https://your-api-id.execute-api.your-region.amazonaws.com/dev/auth" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password"}'

# Get dashboard data
curl "https://your-api-id.execute-api.your-region.amazonaws.com/dev/dashboard?userId=testuser"

# List reminders
curl "https://your-api-id.execute-api.your-region.amazonaws.com/dev/reminders?userId=testuser&action=list"

# Create a reminder
curl -X POST "https://your-api-id.execute-api.your-region.amazonaws.com/dev/reminders?userId=testuser&action=create" \
  -H "Content-Type: application/json" \
  -d '{"subject":"Biology","topic":"Cell Structure","reminderTime":"2025-04-23T15:00:00Z"}'
```

## Architecture Benefits

- **Scalability**: Serverless architecture automatically scales based on demand
- **Cost-Efficiency**: Pay only for what you use - no idle resources
- **Maintenance**: Each function can be updated independently
- **Resilience**: Built-in redundancy and fault tolerance from AWS managed services
- **Security**: Fine-grained IAM permissions and isolated components

## Project Structure

```
.
├── .github/
│   └── workflows/         # CI/CD configuration
├── lambda/                # Lambda function code
│   ├── auth/              # Authentication function
│   ├── dashboard/         # Data aggregation function
│   ├── reminders/         # Data management function
│   └── package.sh         # Packaging script
├── scripts/               # Utility scripts
│   └── init-db.js         # Database initialisation
└── terraform/             # Infrastructure as code
    ├── main.tf            # Main Terraform configuration
    ├── variables.tf       # Terraform variables
    └── modules/           # Terraform modules
        ├── api_gateway/   # API Gateway module
        ├── dynamodb/      # DynamoDB module
        ├── iam/           # IAM module
        └── lambda/        # Lambda module
```
