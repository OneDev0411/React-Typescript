#!/bin/bash

# The script will destroy a running dokku ap when the branch is merged in

# Setup SSH agent as we communicate with Dokku through SSH

eval $(ssh-agent -s)
echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
mkdir ~/.ssh
ssh-keyscan "$REVIEW_HOST" >> ~/.ssh/known_hosts

# App name based on branch name

APP=$CI_COMMIT_REF_SLUG
echo $APP


ssh "dokku@$REVIEW_HOST" apps:destroy --force $APP || true

