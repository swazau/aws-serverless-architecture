# AWS Serverless Architecture for Study Reminders App

A complete serverless backend infrastructure deployed on AWS for a Study Reminders mobile application. This project demonstrates a modular Function-as-a-Service (FaaS) architecture that satisfies modern cloud-native application requirements.

![AWS Serverless Architecture](https://raw.githubusercontent.com/aws-samples/lambda-refarch-webapp/master/img/lambda-refarch-webapp.png)

## Architecture Overview

This project implements a complete serverless architecture following a Function-as-a-Service (FaaS) approach:

- **Lambda Functions**: Individual microservices for authentication, dashboard data, and reminders
- **API Gateway**: HTTP endpoints for mobile app integration
- **DynamoDB**: NoSQL database for persistent storage of user data, study progress, and reminders
- **IAM Roles & Policies**: Least-privilege security model for AWS resources
- **Terraform**: Infrastructure as Code for automated deployment

## Features

- **Authentication**: Secure login functionality
- **Dashboard**: Aggregated view of user profile, study progress, and upcoming reminders
- **Reminders Management**: Create and retrieve personalized study reminders
- **CI/CD Pipeline**: GitHub Actions workflow for automated deployment
- **Cross-origin Support**: CORS enabled for frontend integration

## User Journeys

The application supports the following key user journeys:

1. **User Authentication**: Securely log in to the mobile app with username/password
2. **Dashboard View**: See an overview of study progress and upcoming reminders
3. **Reminder Management**: Create and manage study reminders with topics, subjects, and times

## Technical Implementation

### Backend Components

| Component | Purpose | AWS Service |
|-----------|---------|-------------|
| Authentication Service | User login and validation | Lambda + DynamoDB |
| Dashboard Service | Retrieve user profile and study data | Lambda + DynamoDB |
| Reminders Service | Manage study reminders | Lambda + DynamoDB |
| API Layer | HTTP interface for mobile client | API Gateway |
| Persistence Layer | Data storage | DynamoDB |

### Data Model

DynamoDB uses a single-table design with the following structure:

- **Partition Key**: `UserId` (identifies the user)
- **Sort Key**: `ItemId` (categorizes different types of data)
- **Item Types**:
  - `PROFILE`: User profile information
  - `PROGRESS_*`: Study progress records
  - `REMINDER_*`: Study reminders

### API Endpoints

| Endpoint | Method | Purpose | Query Parameters | Request Body |
|----------|--------|---------|-----------------|--------------|
| `/auth` | POST | User authentication | - | `{"username": "string", "password": "string"}` |
| `/dashboard` | GET | Retrieve dashboard data | `userId` | - |
| `/reminders` | GET | List user reminders | `userId`, `action=list` | - |
| `/reminders` | POST | Create a new reminder | `userId`, `action=create` | `{"subject": "string", "topic": "string", "reminderTime": "ISO-string"}` |

## Getting Started

### Prerequisites

- AWS Account (AWS Academy Learner Lab or regular AWS account)
- Terraform installed locally
- Node.js and npm for Lambda function development
- Git for version control

### Deployment 

#### Manual Deployment

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/aws-serverless-architecture.git
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

4. Initialize the database with test data:
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

Once deployed, you can test the API using curl or Postman:

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

## Integrating with a Mobile App

The API is designed to be easily integrated with a mobile application. Here's how your mobile app can interact with this backend:

1. **Authentication**: Send user credentials to the `/auth` endpoint to receive a token
2. **Dashboard**: Call the `/dashboard` endpoint to retrieve all user data in a single request
3. **Reminders**: Use the `/reminders` endpoint with appropriate parameters to list or create reminders

## Architecture Benefits

- **Scalability**: Serverless architecture automatically scales based on demand
- **Cost-Efficiency**: Pay only for what you use - no idle resources
- **Maintenance**: Each function can be updated independently
- **Resilience**: Built-in redundancy and fault tolerance from AWS managed services
- **Security**: Fine-grained IAM permissions and isolated components

## Future Enhancements

- Add user registration functionality
- Implement reminder notifications via AWS SNS
- Add analytics and reporting features
- Enhance security with JWT tokens and Cognito integration
- Add study progress tracking and statistics

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- AWS for providing the serverless infrastructure platform
- The Terraform team for the excellent IaC tooling
- The serverless community for patterns and best practices
