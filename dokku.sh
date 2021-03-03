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

# See which app should we copy configs from
DOKKU_SOURCE_APP=`ssh "dokku@$REVIEW_HOST" config:get $APP REVIEW_SOURCE_APP`
[ -n $DOKKU_SOURCE_APP ] || REVIEW_SOURCE_APP=$DOKKU_SOURCE_APP

echo "Source App: $REVIEW_SOURCE_APP"

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
CONFIG="$CONFIG API_HOST_LOCAL=$URL APP_SHARE_URL=$URL APP_SHARE_URL=$URL"

# This is used for Sentry's "release" parameter. Heroku sents this env automatically.
CONFIG="$CONFIG SOURCE_VERSION=$APP"

ssh "dokku@$REVIEW_HOST" config:set --no-restart $APP $CONFIG

# Checkout the branch we need to deploy
git checkout -B $CI_COMMIT_REF_SLUG

# Unlock is so previous deployments wont prevent this deployment
ssh "dokku@$REVIEW_HOST" apps:unlock $APP || true

# Deploy
git push "dokku@$REVIEW_HOST:$APP" $CI_COMMIT_REF_SLUG:master --force

# Generate Certificates. Due do some race conditions we should do this last.
ssh "dokku@$REVIEW_HOST" letsencrypt $APP
