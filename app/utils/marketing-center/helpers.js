import fecha from 'fecha'

import getTemplateObject from 'components/InstantMarketing/helpers/get-template-object'

export function getTemplateImageOrVideo(
  template,
  fallbackImage = 'https://i.ibb.co/ZhVwVzy/template-placeholder.png'
) {
  if (template.type === 'brand_asset' && template.file.url.endsWith('.mp4')) {
    return {
      original: template.file.url
    }
  }

  if (template.template?.video && template.thumbnail?.url) {
    return {
      original: template.thumbnail.url,
      thumbnail: template.thumbnail.url
    }
  }

  if (template.template?.video && template.file?.url) {
    return {
      original: template.file.url,
      thumbnail: template.file.url
    }
  }

  if (
    template.type === 'template_instance' ||
    template.type === 'template' ||
    template.type === 'brand_asset'
  ) {
    return {
      original: template.file ? template.file.url : fallbackImage,
      thumbnail: template.file ? template.file.preview_url : fallbackImage
    }
  }

  return {
    original: template.preview ? template.preview.url : fallbackImage,
    thumbnail: template.thumbnail
      ? template.thumbnail.preview_url
      : fallbackImage
  }
}

export function createdAt(date) {
  return fecha.format(new Date(date * 1000), 'MMM DD, YYYY - hh:mm A')
}

export function getSelectedMediumTemplates(brandTemplates, wantedMedium) {
  if (!wantedMedium) {
    return brandTemplates
  }

  return brandTemplates.filter(templateOrAsset => {
    if (isBrandAsset(templateOrAsset)) {
      return templateOrAsset.medium === wantedMedium
    }

    return templateOrAsset.template.medium === wantedMedium
  })
}

function getTemplateIndex(availableTemplates, selectedTemplate) {
  return availableTemplates.findIndex(t => t.id === selectedTemplate.id)
}

function navigateBetweenTemplates(
  direction,
  templates,
  selectedTemplate,
  wantedMedium
) {
  if (!selectedTemplate) {
    return
  }

  const availableTemplates = getSelectedMediumTemplates(templates, wantedMedium)
  const selectedTemplateIndex = getTemplateIndex(
    availableTemplates,
    selectedTemplate
  )

  let nextIndex

  if (direction === 'previous') {
    nextIndex =
      selectedTemplateIndex === 0
        ? availableTemplates.length - 1
        : selectedTemplateIndex - 1
  } else {
    nextIndex =
      selectedTemplateIndex === templates.length - 1
        ? 0
        : selectedTemplateIndex + 1
  }

  return availableTemplates[nextIndex]
}

export function selectPreviousTemplate(
  templates,
  selectedTemplate,
  wantedMedium
) {
  return navigateBetweenTemplates(
    'previous',
    templates,
    selectedTemplate,
    wantedMedium
  )
}

export function selectNextTemplate(templates, selectedTemplate, wantedMedium) {
  return navigateBetweenTemplates(
    'next',
    templates,
    selectedTemplate,
    wantedMedium
  )
}

export function navigateBetweenTemplatesUsingKeyboard(
  key,
  templates,
  selectedTemplate,
  wantedMedium
) {
  if (key === 'ArrowLeft') {
    return selectPreviousTemplate(templates, selectedTemplate, wantedMedium)
  }

  if (key === 'ArrowRight') {
    return selectNextTemplate(templates, selectedTemplate, wantedMedium)
  }
}

export function isBrandTemplate(template) {
  return template.type === 'brand_template'
}

export function isTemplateInstance(template) {
  return template.type === 'template_instance'
}

export function isBrandAsset(item) {
  return item.type === 'brand_asset'
}

export function itemDateText(time) {
  return createdAt(time)
}

export function getTemplateType(fallback, template) {
  if (!template) {
    return fallback
  }

  const normalizedTemplate = getTemplateObject(template)

  return normalizedTemplate.template_type || fallback
}

export function getMedium(props) {
  if (
    props.selectedTemplate &&
    props.selectedTemplate.template &&
    props.selectedTemplate.template.medium
  ) {
    return props.selectedTemplate.template.medium
  }

  return props.medium
}

export function convertToTemplate(template) {
  if (template && template.html) {
    return {
      ...template.template,
      template: template.html,
      file: template.file,
      listings: template.listings,
      deals: template.deals,
      branch: template.branch,
      contacts: template.contacts
    }
  }

  return template
}

export function isVideoThumb(template) {
  if (template.type === 'brand_asset' && template.file?.url.endsWith('.mp4')) {
    return true
  }

  if (
    (template.template?.video && template.thumbnail?.url) ||
    (template.template?.video && template.file?.url)
  ) {
    return true
  }

  return false
}
