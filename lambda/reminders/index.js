const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    // Extract user ID from query parameters
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
    
    const action = event.queryStringParameters?.action || 'list';
    
    // List all reminders for a user
    if (action === 'list') {
      const params = {
        TableName: process.env.DYNAMODB_TABLE,
        KeyConditionExpression: 'UserId = :userId AND begins_with(ItemId, :prefix)',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':prefix': 'REMINDER_'
        }
      };
      
      const result = await dynamoDB.query(params).promise();
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(result.Items || [])
      };
    }
    
    // Create a new reminder
    if (action === 'create' && event.httpMethod === 'POST') {
      const requestBody = JSON.parse(event.body || '{}');
      const { subject, topic, reminderTime } = requestBody;
      
      if (!subject || !topic || !reminderTime) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ message: 'Missing required fields: subject, topic, reminderTime' })
        };
      }
      
      // Generate a unique ID for the reminder
      const timestamp = new Date().getTime();
      const reminderId = `REMINDER_${timestamp}`;
      
      const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
          UserId: userId,
          ItemId: reminderId,
          subject: subject,
          topic: topic,
          reminderTime: reminderTime,
          notificationSent: false,
          createdAt: new Date().toISOString()
        }
      };
      
      await dynamoDB.put(params).promise();
      
      return {
        statusCode: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          message: 'Reminder created successfully',
          reminder: params.Item
        })
      };
    }
    
    // Process upcoming reminders - this could be triggered by a scheduled event
    // to send push notifications to the mobile app
    if (action === 'process') {
      const now = new Date();
      const params = {
        TableName: process.env.DYNAMODB_TABLE,
        KeyConditionExpression: 'UserId = :userId AND begins_with(ItemId, :prefix)',
        FilterExpression: 'reminderTime <= :now AND notificationSent = :notificationSent',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':prefix': 'REMINDER_',
          ':now': now.toISOString(),
          ':notificationSent': false
        }
      };
      
      const result = await dynamoDB.query(params).promise();
      
      // In a real app, you would send push notifications here
      // For each reminder that needs to be sent
      
      // Update each reminder to mark as sent
      const updatedReminders = [];
      for (const reminder of result.Items) {
        const updateParams = {
          TableName: process.env.DYNAMODB_TABLE,
          Key: {
            UserId: reminder.UserId,
            ItemId: reminder.ItemId
          },
          UpdateExpression: 'SET notificationSent = :sent',
          ExpressionAttributeValues: {
            ':sent': true
          },
          ReturnValues: 'ALL_NEW'
        };
        
        const updateResult = await dynamoDB.update(updateParams).promise();
        updatedReminders.push(updateResult.Attributes);
      }
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          message: `Processed ${updatedReminders.length} reminders`,
          reminders: updatedReminders
        })
      };
    }
    
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: 'Invalid action' })
    };
  } catch (error) {
    console.error('Error in reminders function:', error);
    
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
