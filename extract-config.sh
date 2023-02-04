echo "Source App: $REVIEW_SOURCE_APP"

# Read the configuration from source Heroku app into a file

curl "https://api.heroku.com/apps/$REVIEW_SOURCE_APP/config-vars" -H "Accept: application/vnd.heroku+json; version=3" -H "Authorization: Bearer $HEROKU_API_KEY" > /tmp/configs
KEYS=$(cat /tmp/configs | jq -r '. | keys[]')

echo '' > .env

for key in $KEYS;
do
  val=$(cat /tmp/configs | jq ".$key")
  echo $key="$val" >> .env
done
