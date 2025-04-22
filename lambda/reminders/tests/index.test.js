const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
const lambda = require('../index');

describe('Reminders Lambda function', () => {
  // Setup environment variables from GitHub Secrets
  process.env.DYNAMODB_TABLE = process.env.DYNAMODB_TABLE || 'test-table';
  const TEST_USER_ID = process.env.TEST_USER_ID || 'test-user-123';
  
  beforeEach(() => {
    // Reset all mocks before each test
    AWSMock.restore();
  });

  test('list action: should return reminders for a user', async () => {
    // Mock DynamoDB query response
    const mockReminders = [
      {
        UserId: TEST_USER_ID,
        ItemId: 'REMINDER_123456789',
        subject: 'Study CS101',
        topic: 'Computer Science',
        reminderTime: '2025-05-01T15:00:00Z',
        notificationSent: false,
        createdAt: '2025-04-20T10:00:00Z'
      }
    ];

    AWSMock.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
      expect(params.TableName).toBe(process.env.DYNAMODB_TABLE);
      expect(params.KeyConditionExpression).toBe('UserId = :userId AND begins_with(ItemId, :prefix)');
      expect(params.ExpressionAttributeValues[':userId']).toBe(TEST_USER_ID);
      callback(null, { Items: mockReminders });
    });

    // Create mock event
    const event = {
      queryStringParameters: {
        userId: TEST_USER_ID,
        action: 'list'
      }
    };

    // Execute the function
    const result = await lambda.handler(event);

    // Verify the response
    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body).toEqual(mockReminders);
  });

  test('create action: should create a new reminder', async () => {
    // Mock DynamoDB put response
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      expect(params.TableName).toBe(process.env.DYNAMODB_TABLE);
      expect(params.Item.UserId).toBe(TEST_USER_ID);
      expect(params.Item.subject).toBe('Study Math');
      callback(null, {});
    });

    // Set up test date for predictable timestamp
    const testDate = new Date('2025-04-22T10:00:00Z');
    const originalDateNow = Date.now;
    global.Date = class extends Date {
      constructor() {
        super();
        return testDate;
      }
      
      static now() {
        return testDate.getTime();
      }
    };

    // Create mock event for creating a reminder
    const event = {
      httpMethod: 'POST',
      queryStringParameters: {
        userId: TEST_USER_ID,
        action: 'create'
      },
      body: JSON.stringify({
        subject: 'Study Math',
        topic: 'Mathematics',
        reminderTime: '2025-05-05T14:00:00Z'
      })
    };

    // Execute the function
    const result = await lambda.handler(event);

    // Restore original Date
    global.Date = Date;

    // Verify the response
    expect(result.statusCode).toBe(201);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Reminder created successfully');
    expect(body.reminder.subject).toBe('Study Math');
    expect(body.reminder.topic).toBe('Mathematics');
    expect(body.reminder.UserId).toBe(TEST_USER_ID);
  });

  test('process action: should process due reminders', async () => {
    // Mock DynamoDB query and update responses
    const dueReminders = [
      {
        UserId: TEST_USER_ID,
        ItemId: 'REMINDER_123456789',
        subject: 'Past due reminder',
        topic: 'Important',
        reminderTime: '2025-04-21T00:00:00Z',
        notificationSent: false
      }
    ];

    AWSMock.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
      expect(params.TableName).toBe(process.env.DYNAMODB_TABLE);
      expect(params.FilterExpression).toContain('notificationSent = :notificationSent');
      callback(null, { Items: dueReminders });
    });

    AWSMock.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
      expect(params.TableName).toBe(process.env.DYNAMODB_TABLE);
      expect(params.Key.UserId).toBe(TEST_USER_ID);
      expect(params.UpdateExpression).toBe('SET notificationSent = :sent');
      callback(null, { 
        Attributes: {
          ...dueReminders[0],
          notificationSent: true
        }
      });
    });

    // Create mock event
    const event = {
      queryStringParameters: {
        userId: TEST_USER_ID,
        action: 'process'
      }
    };

    // Execute the function
    const result = await lambda.handler(event);

    // Verify the response
    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Processed 1 reminders');
    expect(body.reminders.length).toBe(1);
    expect(body.reminders[0].notificationSent).toBe(true);
  });

  test('should return 401 when userId is missing', async () => {
    const event = {
      queryStringParameters: {
        action: 'list'
      }
    };

    const result = await lambda.handler(event);
    expect(result.statusCode).toBe(401);
  });

  test('should handle errors properly', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
      callback(new Error('DynamoDB error'), null);
    });

    const event = {
      queryStringParameters: {
        userId: TEST_USER_ID,
        action: 'list'
      }
    };

    const result = await lambda.handler(event);
    expect(result.statusCode).toBe(500);
  });
});
