const https = require('https')

async function sendRequest(url, options) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, response => {
      response.on('error', reject)
      response.on('data', buffer => {
        const data = JSON.parse(buffer.toString())

        if (response.statusCode >= 200 && response.statusCode < 300) {
          return resolve(data)
        }

        reject(data)
      })
    })

    req.end()
  })
}

async function main() {
  const GITLAB_PRIVATE_TOKEN = process.env.GITLAB_PRIVATE_TOKEN
  const COMMIT_TITLE = process.env.CI_COMMIT_TITLE
  const labelToRemove = process.argv[2]
  const labelToAdd = process.argv[3]

  if (!COMMIT_TITLE) {
    console.warn('CI_COMMIT_TITLE should exist')

    return
  }

  const [issueNumber] = COMMIT_TITLE.match(/\d{4}/g) || []

  if (!issueNumber) {
    return
  }

  const issue = await sendRequest(
    `https://gitlab.com/api/v4/projects/rechat%2fweb/issues/${issueNumber}`,
    {
      method: 'GET',
      headers: {
        'PRIVATE-TOKEN': GITLAB_PRIVATE_TOKEN
      }
    }
  )

  const newLabels = issue.labels
    .filter(label => label !== labelToRemove)
    .concat(labelToAdd || [])

  const queryString = `labels=${newLabels.join(',')}`

  await sendRequest(
    `https://gitlab.com/api/v4/projects/rechat%2fweb/issues/${issueNumber}?${queryString}`,
    {
      method: 'PUT',
      headers: {
        'PRIVATE-TOKEN': GITLAB_PRIVATE_TOKEN
      }
    }
  )
}

main().catch(e => {
  console.error('Error updating GL issue labels', e)
})
