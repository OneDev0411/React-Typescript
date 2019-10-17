const https = require('https')

async function main() {
  const GITLAB_PRIVATE_TOKEN = process.env.GITLAB_PRIVATE_TOKEN
  const COMMIT_MESSAGE = process.env.CI_COMMIT_TITLE
  const labelToRemove = process.argv[2] || 'Merge Requested'
  const labelToAdd = process.argv[3] || 'Deployed to Boer'

  if (!COMMIT_MESSAGE) {
    console.warn('CI_COMMIT_TITLE should exist')

    return
  }

  const [iid] = COMMIT_MESSAGE.match(/\d{4}/g) || []

  if (!iid) {
    return
  }

  const issue = await sendRequest(
    `https://gitlab.com/api/v4/projects/rechat%2fweb/issues/${iid}`,
    {
      method: 'GET',
      headers: {
        'PRIVATE-TOKEN': GITLAB_PRIVATE_TOKEN
      }
    }
  )

  const newLabels = issue.labels
    .filter(label => label !== labelToRemove)
    .concat(labelToAdd)

  const queryString = `labels=${newLabels.join(',')}`

  await sendRequest(
    `https://gitlab.com/api/v4/projects/rechat%2fweb/issues/${iid}?${queryString}`,
    {
      method: 'PUT',
      headers: {
        'PRIVATE-TOKEN': GITLAB_PRIVATE_TOKEN
      }
    }
  )
}

main().catch(e => {
  console.error('error in updating labels', e)
})

async function sendRequest(url, options) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, response => {
      response.on('error', reject)
      response.on('data', buffer => {
        const data = JSON.parse(buffer.toString())

        if (`${response.statusCode}`[0] === '2') {
          return resolve(data)
        }

        reject(data)
      })
    })

    req.end()
  })
}
