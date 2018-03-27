#!/bin/sh

API="http://localhost:4741"
URL_PATH="/ownedblogposts"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request GET

echo
