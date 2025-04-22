const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  region: 'ap-southeast-2' // Sydney region
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = 'study-reminders-table'; // Our DynamoDB table name

// Test data
const testData = [
  // User profile
  {
    UserId: 'testuser',
    ItemId: 'PROFILE',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password', // In a real app, this would be hashed
    createdAt: new Date().toISOString()
  },
  
  // Study progress records
  {
    UserId: 'testuser',
    ItemId: 'PROGRESS_1',
    subject: 'Mathematics',
    topic: 'Calculus',
    completedAt: new Date().toISOString(),
    score: 85
  },
  {
    UserId: 'testuser',
    ItemId: 'PROGRESS_2',
    subject: 'Computer Science',
    topic: 'Data Structures',
    completedAt: new Date().toISOString(),
    score: 92
  },
  
  // Reminders
  {
    UserId: 'testuser',
    ItemId: 'REMINDER_1',
    subject: 'Physics',
    topic: 'Mechanics',
    reminderTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    notificationSent: false
  },
  {
    UserId: 'testuser',
    ItemId: 'REMINDER_2',
    subject: 'English',
    topic: 'Literature Review',
    reminderTime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
    notificationSent: false
  }
];

// Function to add items to DynamoDB
async function addItem(item) {
  const params = {
    TableName: tableName,
    Item: item
  };
  
  try {
    await dynamoDB.put(params).promise();
    console.log(`Added item: ${item.UserId} - ${item.ItemId}`);
  } catch (error) {
    console.error(`Error adding item ${item.UserId} - ${item.ItemId}:`, error);
  }
}

// Add all test data
async function initializeDB() {
  console.log('Initializing DynamoDB with test data...');
  
  for (const item of testData) {
    await addItem(item);
  }
  
  console.log('Database initialization completed.');
}

// Run the initialization
initializeDB().catch(error => {
  console.error('Initialization failed:', error);
});
