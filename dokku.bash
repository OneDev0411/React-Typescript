#!/bin/bash

apt-get update -y && apt install jq -y
eval $(ssh-agent -s)
echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
mkdir ~/.ssh
ssh-keyscan rechat.co >> ~/.ssh/known_hosts

APP=$CI_COMMIT_REF_SLUG
echo $APP

ssh dokku@rechat.co apps:create $APP || true
curl https://api.heroku.com/apps/rechat-irish/config-vars -H "Accept: application/vnd.heroku+json; version=3" -H "Authorization: Bearer $HEROKU_API_KEY" > /tmp/configs
KEYS=$(cat /tmp/configs | jq '. | keys[]')

CONFIG='DOKKU_LETSENCRYPT_EMAIL=emil@rechat.com'

for key in $KEYS;
do
  val=$(cat /tmp/configs | jq ".$key")
  CONFIG="$CONFIG $key=$val"
done
ssh dokku@rechat.co config:set --no-restart $APP $CONFIG
ssh dokku@rechat.co letsencrypt $APP

git checkout -B $CI_COMMIT_REF_SLUG
ssh dokku@rechat.co letsencrypt $APP
ssh dokku@rechat.co apps:unlock $APP
# git push dokku@rechat.co:$APP $CI_COMMIT_REF_SLUG:master

# CI_MERGE_REQUEST_IID=$(curl --request GET --header "Private-Token: $GITLAB_PERSONAL_API_PRIVATE_TOKEN" "https://gitlab.your-server.com/api/v4/projects/$CI_PROJECT_ID/repository/commits/$CI_COMMIT_SHA/merge_requests" --insecure | jq --raw-output ".[0].iid")
# $ curl --request POST --header "Private-Token: aPs-aU-kL_YUtWiyD_QG" https://gitlab.com/api/v4/projects/$CI_MERGE_REQUEST_PROJECT_ID/merge_requests/11/notes --data "Comment test"

echo "CI_MERGE_REQUEST_ID:  $CI_MERGE_REQUEST_ID"
echo "CI_MERGE_REQUEST_IID: $CI_MERGE_REQUEST_IID"
echo "CI_MERGE_REQUEST_PROJECT_ID: $CI_MERGE_REQUEST_PROJECT_ID"
