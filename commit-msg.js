#!/usr/bin/env node

const fs = require('fs')

const [, , COMMIT_MESSAGE_FILE, BRANCH_NAME] = process.argv

function getIssueNumber(branchName) {
  const match = branchName.match(/\d{3,}/)

  if (match && match.length) {
    return `#${match[0]} `
  }

  return ''
}

function run() {
  const issueNumber = getIssueNumber(BRANCH_NAME)
  const originalCommitMessage = fs.readFileSync(COMMIT_MESSAGE_FILE)

  fs.writeFileSync(
    COMMIT_MESSAGE_FILE,
    `${issueNumber}${originalCommitMessage}`
  )
}

run()
