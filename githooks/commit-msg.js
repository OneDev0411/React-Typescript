#!/usr/bin/env node

const fs = require('fs')
const os = require('os')

const [, , COMMIT_MESSAGE_FILE, BRANCH_NAME] = process.argv

function getIssueNumber(branchName) {
  const match = branchName.match(/\d{3,}/)

  if (match && match.length) {
    return `#${match[0]}`
  }

  return ''
}

function run() {
  const issueNumber = getIssueNumber(BRANCH_NAME)
  const originalCommitMessage = fs.readFileSync(COMMIT_MESSAGE_FILE, 'utf8')

  const [firstLine, ...otherLines] = originalCommitMessage.split(os.EOL)

  const firstLineWithIssueRef =
    issueNumber && !firstLine.includes(issueNumber)
      ? `${firstLine} (${issueNumber})`
      : firstLine

  fs.writeFileSync(
    COMMIT_MESSAGE_FILE,
    [firstLineWithIssueRef, ...otherLines].join(os.EOL)
  )
}

run()
