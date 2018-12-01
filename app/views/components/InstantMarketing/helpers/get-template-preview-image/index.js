// import templateToImage from '../template-to-image'
import { getTemplateInstances } from 'models/instant-marketing/get-template-instances'

export async function getTemplatePreviewImage(template, data) {
  if (!template.id) {
    console.error('Template id is undefined')

    return false
  }

  try {
    const instance = await getTemplateInstances(template.id, {
      ...data,
      html: template.result
    })

    return instance.file.url
  } catch (e) {
    console.log(e)

    return null
  }
}
