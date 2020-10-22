#!/bin/bash -ex

curl -X POST https://api.heroku.com/apps -H "Accept: application/vnd.heroku+json; version=3" -H "Authorization: Bearer $HEROKU_API_KEY" -H "Content-Type: application/json" -d "{\"name\":\"$PROJECT_NAME-$CI_COMMIT_REF_SLUG\",\"region\":\"eu\"}"
git checkout -B $CI_COMMIT_REF_SLUG
git config user.email $GITLAB_USER_EMAIL
git config user.name $GITLAB_USER_NAME
git add .
git commit -m "Ready to push latest changes to new heroku review app"
git push https://heroku:$HEROKU_API_KEY@git.heroku.com/$PROJECT_NAME-$CI_COMMIT_REF_SLUG.git $CI_COMMIT_REF_SLUG:master
