#!/bin/bash

ROOT_FOLDER="dist/"

echo "beginning functions deployment"

# loop through the files
for filepath in $(find "$ROOT_FOLDER" -type f -name "*.js"); do
  # extract the function name from the file path
  filename=$(basename "$filepath")
  function_name="${filename%.*}"

  echo "deploying $function_name"

  # deploy the function
  gcloud functions deploy "$function_name" \
    --trigger-http \
    --runtime=nodejs18 \
    --source "dist/$function_name" \
    --env-vars-file .env.yaml

  echo "$function_name done"

done
