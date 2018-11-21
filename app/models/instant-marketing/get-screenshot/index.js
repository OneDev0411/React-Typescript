import agent from 'superagent'

export async function getTemplateScreenshot(
  html,
  dimensions,
  viewport,
  options
) {
  let response

  options = Object.assign(
    {
      absolute: false
    },
    options
  )

  try {
    response = await agent
      .post('https://screenshots.api.rechat.com/screenshot.png')
      .responseType('blob')
      .send({
        html,
        width: dimensions[0],
        height: dimensions[1],
        viewport
      })
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
