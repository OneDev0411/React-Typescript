#!/bin/bash

apt-get update -y && apt install jq -y
eval $(ssh-agent -s)
echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
mkdir ~/.ssh
ssh-keyscan rechat.co >> ~/.ssh/known_hosts

APP=$CI_PROJECT_NAME-$CI_COMMIT_REF_SLUG
echo $APP

ssh dokku@rechat.co apps:create $APP || true
curl https://api.heroku.com/apps/rechat-irish/config-vars -H "Accept: application/vnd.heroku+json; version=3" -H "Authorization: Bearer $HEROKU_API_KEY" > /tmp/configs
KEYS=$(cat /tmp/configs | jq '. | keys[]')

CONFIG=''

for key in $KEYS;
do
  val=$(cat /tmp/configs | jq ".$key")
  CONFIG="$CONFIG $key=$val"
done
ssh dokku@rechat.co config:set --no-restart $APP $CONFIG

git checkout -B $CI_COMMIT_REF_SLUG
git push dokku@rechat.co:$APP $CI_COMMIT_REF_SLUG:master
