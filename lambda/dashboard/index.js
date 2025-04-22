const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    // Extract user ID from authorization header or query parameters
    // In a real app, you would validate JWT token
    const userId = event.queryStringParameters?.userId;
    
    if (!userId) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ message: 'Unauthorized: User ID is required' })
      };
    }
    
    // Get user profile
    const profileParams = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        UserId: userId,
        ItemId: 'PROFILE'
      }
    };
    
    const profileResult = await dynamoDB.get(profileParams).promise();
    
    // Get user study progress
    const progressParams = {
      TableName: process.env.DYNAMODB_TABLE,
      KeyConditionExpression: 'UserId = :userId AND begins_with(ItemId, :prefix)',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':prefix': 'PROGRESS_'
      }
    };
    
    const progressResult = await dynamoDB.query(progressParams).promise();
    
    // Get upcoming reminders
    const reminderParams = {
      TableName: process.env.DYNAMODB_TABLE,
      KeyConditionExpression: 'UserId = :userId AND begins_with(ItemId, :prefix)',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':prefix': 'REMINDER_'
      }
    };
    
    const reminderResult = await dynamoDB.query(reminderParams).promise();
    
    // Compile dashboard data
    const dashboardData = {
      profile: profileResult.Item || {},
      studyProgress: progressResult.Items || [],
      upcomingReminders: reminderResult.Items || []
    };
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(dashboardData)
    };
  } catch (error) {
    console.error('Error in dashboard function:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};
