#/bin/bash

usage() { 
  echo "Usage: $0 [-i <6899>] [-t <branch-short-description>]" 1>&2; 
  exit 1; 
}

while getopts ":i:t:" o; do
  case "${o}" in
    i)
      i=${OPTARG}
      issueNumber=$i
      ;;
    t)
      t=${OPTARG}
      title=$t
      ;;
    *)
      usage
      ;;
  esac
done
shift $((OPTIND-1))

if [ -z "${i}" ] || [ -z "${t}" ]; then
  usage
fi

branchName="$issueNumber--$title"

echo "[ + ] Creating a new branch"
echo "[ + ] Branch Name: $branchName"

git stash save

git checkout master
git pull origin master

git checkout stage
git pull origin stage
git merge master

git checkout master
git checkout -b $branchName