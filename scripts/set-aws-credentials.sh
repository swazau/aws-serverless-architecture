#!/bin/bash

# Set AWS credentials - replace with your actual AWS Academy credentials
export AWS_ACCESS_KEY_ID="your_access_key_here"
export AWS_SECRET_ACCESS_KEY="your_secret_key_here"
export AWS_SESSION_TOKEN="your_session_token_here"
export AWS_REGION="ap-southeast-2"

echo "AWS credentials have been set."
echo "Now you can run: node init-db.js"
