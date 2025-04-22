const https = require('https');
const querystring = require('querystring');

// API endpoint from Terraform output
const API_URL = 'https://yca811jfud.execute-api.ap-southeast-2.amazonaws.com/dev';

// Test data
const testUser = {
  username: 'testuser',
  password: 'password'
};

// Function to make HTTP requests
function makeRequest(path, method, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    let url = `${API_URL}${path}`;
    
    const req = https.request(url, options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          resolve({ statusCode: res.statusCode, body: data });
        } catch (error) {
          resolve({ statusCode: res.statusCode, body: body });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test auth endpoint
async function testAuth() {
  console.log('\n===== Testing Auth Endpoint =====');
  try {
    const response = await makeRequest('/auth', 'POST', testUser);
    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));
    
    if (response.statusCode === 200 && response.body.token) {
      console.log('✅ Auth endpoint test PASSED');
      return response.body.token;
    } else {
      console.log('❌ Auth endpoint test FAILED');
      return null;
    }
  } catch (error) {
    console.error('Error testing auth endpoint:', error);
    return null;
  }
}

// Test dashboard endpoint
async function testDashboard(token) {
  console.log('\n===== Testing Dashboard Endpoint =====');
  try {
    const response = await makeRequest(`/dashboard?userId=testuser`, 'GET');
    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));
    
    if (response.statusCode === 200 && response.body.studyProgress) {
      console.log('✅ Dashboard endpoint test PASSED');
    } else {
      console.log('❌ Dashboard endpoint test FAILED');
    }
  } catch (error) {
    console.error('Error testing dashboard endpoint:', error);
  }
}

// Test reminders endpoint
async function testReminders(token) {
  console.log('\n===== Testing Reminders Endpoint =====');
  try {
    const response = await makeRequest(`/reminders?userId=testuser&action=list`, 'GET');
    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));
    
    if (response.statusCode === 200 && Array.isArray(response.body)) {
      console.log('✅ Reminders endpoint test PASSED');
    } else {
      console.log('❌ Reminders endpoint test FAILED');
    }
  } catch (error) {
    console.error('Error testing reminders endpoint:', error);
  }
}

// Run all tests
async function runTests() {
  console.log('Starting API endpoint tests...');
  console.log(`API URL: ${API_URL}`);
  
  try {
    const token = await testAuth();
    await testDashboard(token);
    await testReminders(token);
    
    console.log('\n===== Test Summary =====');
    console.log('All tests completed. Check results above for each endpoint.');
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

// Run the tests
runTests();
