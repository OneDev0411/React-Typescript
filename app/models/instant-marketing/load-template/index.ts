import agent from 'superagent'

export async function loadTemplateHtml(
  template: IBrandMarketingTemplate
): Promise<string> {
  try {
    const response = await agent.get(`${template.template.url}/index.html`)

    return response.text
  } catch (e) {
    console.error(e)

    return ''
  }
}
