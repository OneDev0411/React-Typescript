import templateToImage from '../template-to-image'

export async function getTemplatePreviewImage(template, imageTag = true) {
  const imageUrl = await templateToImage(template)

  if (!imageTag) {
    return imageUrl
  }

  return `<img style="width: calc(100% - 2em); margin: 1em;" src="${imageUrl}" />`
}
