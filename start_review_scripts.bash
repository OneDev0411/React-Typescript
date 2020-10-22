#!/bin/bash -ex

curl -X POST https://api.heroku.com/teams/apps -H "Accept: application/vnd.heroku+json; version=3" -H "Authorization: Bearer $HEROKU_API_KEY" -H "Content-Type: application/json" -d "{\"name\":\"rechat-$CI_PROJECT_NAME-$CI_COMMIT_REF_SLUG\",\"region\":\"us\", \"team\":\"rechat\"}"
curl https://api.heroku.com/apps/rechat-irish/config-vars -H "Accept: application/vnd.heroku+json; version=3" -H "Authorization: Bearer $HEROKU_API_KEY" > .configs
curl -X PATCH https://api.heroku.com/apps/$CI_PROJECT_NAME-$CI_COMMIT_REF_SLUG/config-vars -H "Accept: application/vnd.heroku+json; version=3" -H "Authorization: Bearer $HEROKU_API_KEY" -H 'Content-Type: application/json' -d '@./configs' > /dev/null
git checkout -B $CI_COMMIT_REF_SLUG
git push https://heroku:$HEROKU_API_KEY@git.heroku.com/rechat-$CI_PROJECT_NAME-$CI_COMMIT_REF_SLUG.git $CI_COMMIT_REF_SLUG:master
