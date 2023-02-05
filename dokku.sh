#!/bin/bash

# The script will deploy a new dokku app on our server.
# It will copy the configuration from an existing heroky app (Like Irish)


# Setup SSH agent as we communicate with Dokku through SSH

APP=$CI_COMMIT_REF_SLUG
echo $APP

# Create the app. Dont exit if it already exists

dokku apps:create $APP || true

dokku config:set --no-restart $APP $CONFIG

# Unlock is so previous deployments wont prevent this deployment
dokku apps:unlock $APP || true

dokku git:from-image $APP

# Generate Certificates. Due do some race conditions we should do this last.
dokku letsencrypt:list | grep $APP
if [ $? -eq 0 ]; then
  echo "Skipping letsencrypt..."
else
  dokku letsencrypt:enable $APP $CI_COMMIT_REF_SLUG
fi
