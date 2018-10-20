import { getTemplateScreenshot } from 'models/instant-marketing'

export default async function templateToImage(template) {
  return getTemplateScreenshot(
    template.result,
    [template.width, template.height],
    {
      width: template.width / 2,
      height: template.height / 2
    }
  )
}
