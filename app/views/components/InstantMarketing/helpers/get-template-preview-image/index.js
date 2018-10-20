import templateToImage from '../template-to-image'

export default async function getTemplatePreviewImage(template) {
  const imageUrl = await templateToImage(template)

  return `<img style="width: calc(100% - 2em); margin: 1em;" src="${imageUrl}" />`
}
