#!/bin/bash

# This script properly packages the Lambda functions with dependencies

# Auth function
echo "Packaging auth function..."
cd /Users/dan/Desktop/james_arch/lambda/auth
rm -rf node_modules function.zip
npm install aws-sdk
zip -r function.zip index.js node_modules
echo "Auth function packaged successfully"

# Dashboard function
echo "Packaging dashboard function..."
cd /Users/dan/Desktop/james_arch/lambda/dashboard
rm -rf node_modules function.zip
npm install aws-sdk
zip -r function.zip index.js node_modules
echo "Dashboard function packaged successfully"

# Reminders function
echo "Packaging reminders function..."
cd /Users/dan/Desktop/james_arch/lambda/reminders
rm -rf node_modules function.zip
npm install aws-sdk
zip -r function.zip index.js node_modules
echo "Reminders function packaged successfully"

echo "All Lambda functions packaged with dependencies"
