import agent from 'superagent'

export async function loadTemplateHtml(url) {
  try {
    const response = await agent.get(url)

    return response.text
  } catch (e) {
    throw e
  }
}
