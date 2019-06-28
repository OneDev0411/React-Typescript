#!/usr/bin/env node

const fs = require('fs')

const ISSUE_NUMBER_MIN_LENGTH = 3

const [, , COMMIT_MESSAGE_FILE, BRANCH_NAME] = process.argv

function getIssueNumber(branchName) {
  const match = branchName.match(new RegExp(`\d{${ISSUE_NUMBER_MIN_LENGTH},}`))

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
