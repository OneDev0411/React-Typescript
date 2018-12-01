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

    return `<img src="${
      instance.file.url
    }" style="max-width: 98%; display: block; margin: 1rem auto"/>`
  } catch (e) {
    console.log(e)

    return null
  }
}
