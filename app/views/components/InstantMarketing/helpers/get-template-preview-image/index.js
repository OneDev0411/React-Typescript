import templateToImage from '../template-to-image'

export async function getTemplatePreviewImage(template, options = {}) {
  const imageUrl = await templateToImage(template, options)

  if (options.absolute === true) {
    return imageUrl
  }

  return `<img style="width: calc(100% - 2em); margin: 1em;" src="${imageUrl}" />`
}
