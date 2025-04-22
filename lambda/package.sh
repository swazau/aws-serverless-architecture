#!/bin/bash

# This script packages the Lambda functions into ZIP files

# Create ZIP files for each Lambda function
echo "Packaging Lambda functions..."

# Auth function
cd auth
npm init -y
npm install aws-sdk
zip -r function.zip index.js node_modules
echo "Auth function packaged"

# Dashboard function
cd ../dashboard
npm init -y
npm install aws-sdk
zip -r function.zip index.js node_modules
echo "Dashboard function packaged"

# Reminders function
cd ../reminders
npm init -y
npm install aws-sdk
zip -r function.zip index.js node_modules
echo "Reminders function packaged"

echo "All Lambda functions packaged successfully"
