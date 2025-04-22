#!/bin/bash

# API URL from Terraform output
API_URL="https://yca811jfud.execute-api.ap-southeast-2.amazonaws.com/dev"

echo "===== Testing API Endpoints ====="
echo "API URL: $API_URL"

# Test Auth Endpoint
echo -e "\n1. Testing Auth Endpoint..."
auth_response=$(curl -s -X POST "$API_URL/auth" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password"}')

echo "Response: $auth_response"

# Extract token (this is a simple extraction, might need adjustment)
token=$(echo $auth_response | grep -o '"token":"[^"]*"' | cut -d':' -f2 | tr -d '"')

# Test Dashboard Endpoint
echo -e "\n2. Testing Dashboard Endpoint..."
dashboard_response=$(curl -s -X GET "$API_URL/dashboard?userId=testuser")
echo "Response: $dashboard_response"

# Test Reminders Endpoint
echo -e "\n3. Testing Reminders Endpoint..."
reminders_response=$(curl -s -X GET "$API_URL/reminders?userId=testuser&action=list")
echo "Response: $reminders_response"

echo -e "\nAll tests completed."
