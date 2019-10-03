import fecha from 'fecha'

export function getTemplateImage(template, brokerageBrand) {
  if (template.file) {
    const URL = template.file.preview_url

    return {
      original: URL,
      thumbnail: URL
    }
  }

  const brandId = brokerageBrand ? `/${brokerageBrand.id}` : ''
  const generateURL = type =>
    `${template.url}${brandId}/${type}.${template.video ? 'mp4' : 'png'}`

  return {
    original: generateURL('preview'),
    thumbnail: generateURL('thumbnail')
  }
}

export function createdAt(date) {
  return fecha.format(new Date(date * 1000), 'MMM DD, YYYY - hh:mm A')
}

export function getSelectedMediumTemplates(templates, wantedMedium) {
  return templates.filter(t => t.medium === wantedMedium)
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

  if (direction == 'previous') {
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

export function itemButtonText(item) {
  let isInstance = false
  let isEmail = false
  let text = 'Customize'

  if (item && item.template) {
    isInstance = item.type === 'template_instance'
    isEmail = item.template.medium === 'Email'
  }

  if (isInstance) {
    text = isEmail ? 'Send to' : 'Share'
  }

  return text
}

export function itemDateText(time) {
  return createdAt(time)
}

export function getTemplateType(initType, template) {
  if (template && template.template && template.template.template_type) {
    return template.template.template_type
  }

  return initType
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
