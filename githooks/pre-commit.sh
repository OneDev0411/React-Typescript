#!/bin/bash
# gsed is actually required but it's exposed as sed in some macs
# it's recommended to install gnu-sed (gsed) via `brew install gnu-sed`
cmd=$(which gsed || which sed)
$cmd -i "/CI_CACHE_KEY:/c\  CI_CACHE_KEY: \"$(md5sum package-lock.json| cut -c 1-32)\"" .gitlab-ci.yml
git add .gitlab-ci.yml
