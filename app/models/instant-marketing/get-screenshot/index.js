import agent from 'superagent'

export async function getTemplateScreenshot(
  html,
  dimensions,
  viewport,
  options
) {
  let request
  let response

  options = Object.assign(
    {
      absolute: false
    },
    options
  )

  const baseUrl = 'https://screenshots.api.rechat.com'
  const endpoint = options.absolute ? '/screenshot' : '/screenshot.png'

  try {
    request = await agent.post(`${baseUrl}${endpoint}`).send({
      html,
      width: dimensions[0],
      height: dimensions[1],
      viewport
    })

    if (options.absolute === false) {
      request.responseType('blob')
    }

    response = await request
  } catch (e) {
    throw e
  }

  if (options.absolute) {
    return response.body.url
  }

  return new Promise(resolve => {
    const reader = new FileReader()

    reader.readAsDataURL(response.body)

    reader.addEventListener('load', () => {
      resolve(reader.result)
    })
  })
}
