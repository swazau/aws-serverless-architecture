#!/bin/bash

# API URL
API_URL="https://yca811jfud.execute-api.ap-southeast-2.amazonaws.com/dev"

# Create a new reminder
echo "Creating a new study reminder..."
create_response=$(curl -s -X POST "$API_URL/reminders?userId=testuser&action=create" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Biology",
    "topic": "Cell Structure",
    "reminderTime": "2025-04-23T15:00:00Z"
  }')

echo "Response: $create_response"

# Extract reminder ID from response
reminder_id=$(echo $create_response | grep -o '"ItemId":"[^"]*"' | cut -d'"' -f4)
echo "Created reminder with ID: $reminder_id"
