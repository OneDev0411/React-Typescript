export default function getTemplateInstancePreviewImage(instance) {
  if (!instance) {
    console.error('Instance is undefined')

    return ''
  }

  try {
    return `<img src="${
      instance.file.url
    }" style="max-width: 98%; display: block; margin: 1rem auto"/>`
  } catch (e) {
    console.log(e)

    return ''
  }
}
