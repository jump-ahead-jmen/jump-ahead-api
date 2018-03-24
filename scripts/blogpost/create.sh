#!/bin/bash

API="http://localhost:4741"
URL_PATH="/blogPosts"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=${TOKEN}" \
  --data '{
    "blogPost": {
      "title": "'"${TITLE}"'",
      "body": "'"${BODY}"'",
      "_organization": "5ab6a4baa635833d657bfbfb"
    }
  }'

echo
