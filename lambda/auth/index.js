const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { username, password } = requestBody;
    
    // In a real application, you would validate credentials against a secure store
    // and use proper authentication methods like JWT or OAuth
    
    // For this demo, we'll do a simple check in DynamoDB
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        UserId: username,
        ItemId: 'PROFILE'
      }
    };
    
    const result = await dynamoDB.get(params).promise();
    
    if (!result.Item || result.Item.password !== password) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ message: 'Invalid credentials' })
      };
    }
    
    // Generate a simple token (in a real app, use JWT)
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Login successful',
        token,
        userId: username
      })
    };
  } catch (error) {
    console.error('Error in auth function:', error);
    
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
