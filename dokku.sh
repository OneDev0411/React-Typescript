#!/bin/bash

# The script will deploy a new dokku app on our server.
# It will copy the configuration from an existing heroky app (Like Irish)


# Install jq, we need it to parse Heroku's API response

apt-get update -y && apt-get install jq -y

# Setup SSH agent as we communicate with Dokku through SSH

eval $(ssh-agent -s)
echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
mkdir ~/.ssh
ssh-keyscan "$REVIEW_HOST" >> ~/.ssh/known_hosts

# App name based on branch name

APP=$CI_COMMIT_REF_SLUG
echo $APP

# Create the app. Dont exit if it already exists

ssh "dokku@$REVIEW_HOST" apps:create $APP || true

# Read the configuration from source Heroku app into a file

curl "https://api.heroku.com/apps/$REVIEW_SOURCE_APP/config-vars" -H "Accept: application/vnd.heroku+json; version=3" -H "Authorization: Bearer $HEROKU_API_KEY" > /tmp/configs
KEYS=$(cat /tmp/configs | jq '. | keys[]')

# We need to copy the configuration fro msource heroku application
# But we also need ot set the letsencrypt email in the config

CONFIG="DOKKU_LETSENCRYPT_EMAIL=$REVIEW_LETSENCRYPT_EMAIL"

for key in $KEYS;
do
  val=$(cat /tmp/configs | jq ".$key")
  CONFIG="$CONFIG $key=$val"
done

# Also set the new app's URL's
URL="https://$APP.$REVIEW_HOST"
CONFIG = "$CONFIG API_HOST_LOCAL=$URL APP_SHARE_URL=$URL APP_SHARE_URL=$URL"

ssh "dokku@$REVIEW_HOST" config:set --no-restart $APP $CONFIG

# Checkout the branch we need to deploy
git checkout -B $CI_COMMIT_REF_SLUG

# Generate Certificates
ssh "dokku@$REVIEW_HOST" letsencrypt $APP

# Unlck is so previous deployments wont prevent this deployment
ssh "dokku@$REVIEW_HOST" apps:unlock $APP

# Deploy
git push "dokku@$REVIEW_HOST:$APP" $CI_COMMIT_REF_SLUG:master
