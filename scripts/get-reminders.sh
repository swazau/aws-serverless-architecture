#!/bin/bash

# API URL
API_URL="https://yca811jfud.execute-api.ap-southeast-2.amazonaws.com/dev"

# Get list of reminders
echo "Retrieving all reminders..."
reminders_response=$(curl -s -X GET "$API_URL/reminders?userId=testuser&action=list")

# Format the JSON output for better readability
echo "Reminders:"
echo $reminders_response | python -m json.tool
