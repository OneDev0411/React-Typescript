import agent from 'superagent'

export async function getTemplateScreenshot(html, dimensions, viewport) {
  let response

  try {
    response = await agent
      .post('https://screenshots.api.rechat.com/screenshot')
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

  return new Promise(resolve => {
    const reader = new FileReader()

    reader.readAsDataURL(response.body)

    reader.addEventListener('load', () => {
      resolve(reader.result)
    })
  })
}
