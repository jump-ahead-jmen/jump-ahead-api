#!/bin/bash

API="http://localhost:4741"
URL_PATH="/organizations"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=${TOKEN}" \
  --data '{
    "organization": {
      "name": "'"${NAME}"'",
      "address": "'"${ADDRESS}"'",
      "logo": "'"${LOGO}"'",
      "description": "'"${DESCRIPTION}"'",
      "mission_statement": "'"${MISSION_STATEMENT}"'"
    }
  }'

echo
