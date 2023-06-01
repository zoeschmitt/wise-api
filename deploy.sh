#!/bin/bash
FUNCTION_NAME_1=conversations

echo "deploy cloud functions\n"
gcloud functions deploy ${FUNCTION_NAME_1} --trigger-http --runtime=nodejs18 --source dist/functions/${FUNCTION_NAME_1} --env-vars-file .env.yaml
