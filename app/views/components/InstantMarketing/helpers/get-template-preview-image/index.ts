export default function getTemplateInstancePreviewImage(
  instance: IMarketingTemplateInstance
) {
  if (!instance) {
    console.error('Instance is undefined')

    return ''
  }

  try {
    // eslint-disable-next-line max-len
    return `<img src="${instance.file.url}" style="max-width: 98%; display: block; margin: 1rem auto"/>`
  } catch (e) {
    console.log(e)

    return ''
  }
}
