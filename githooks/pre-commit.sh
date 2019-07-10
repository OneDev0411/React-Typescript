#!/bin/bash
sed -i "/CI_CACHE_KEY:/c\  CI_CACHE_KEY: \"$(md5sum package-lock.json| cut -c 1-32)\"" .gitlab-ci.yml
git add .gitlab-ci.yml
