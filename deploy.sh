#!/bin/bash

ROOT_FOLDER="dist"

echo "beginning functions deployment"

# loop through the files
for filepath in $(find "$ROOT_FOLDER" -type f -name "*.js"); do
  # extract the function name from the file path
  filename=$(basename "$filepath")
  function_name="${filename%.*}"
  directory=$(dirname "$filepath")

  # skip if index found (indicates already deployed function)
  if [ "$function_name" = "index" ]; then
    continue
  fi

  # change file name to camel case
  IFS='-' read -ra words <<<"$function_name"
  camel_case=""
  for word in "${words[@]}"; do
    if [[ $camel_case == "" ]]; then
      camel_case+="${word}"
    else
      camel_case+="$(tr '[:lower:]' '[:upper:]' <<<${word:0:1})${word:1}"
    fi
  done

  # rename as index for gcp to pick up
  new_filepath="$directory/index.js"
  mv "$filepath" "$new_filepath"

  echo "deploying $camel_case"

  # deploy the function
  gcloud functions deploy "$camel_case" \
    --trigger-http \
    --runtime=nodejs18 \
    --source "$directory" \
    --env-vars-file .env.yaml

  echo "$camel_case done"

done
