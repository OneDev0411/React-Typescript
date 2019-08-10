import { FormatterOutputType, MiniContactType } from './types'

function insightFormatter(data): FormatterOutputType {
  return {
    contact_status: 'not_started',
    contact_id: data.contact,
    data: {
      name: data.display_name,
      email: data.email_address,
      profile_image_url: data.profile_image_url
    },
    meta: {}
  }
}

function contactFormatter(data): FormatterOutputType {
  // data.suumary is for regular contact
  // data.title & data.details is for association contacts (app/views/components/AssocationItem/index.js)
  return {
    contact_status: 'not_started',
    contact_id: data.id,
    data: {
      name: (data.summary && data.summary.display_name) || data.title,
      email: (data.summary && data.summary.email) || data.details,
      profile_image_url:
        (data.summary && data.summary.profile_image_url) ||
        (data.avatar && data.avatar.image)
    },
    meta: {}
  }
}

function userFormatter(data): FormatterOutputType {
  return {
    contact_status: 'not_started',
    contact_id: '',
    data: {
      name: data.display_name,
      email: data.email,
      profile_image_url: data.profile_image_url,
      phone: data.phone_number
    },
    meta: {}
  }
}

// In unexpected situations, We are trying to guess some minimum information.
function fallbackFormatter(data: any): FormatterOutputType {
  const output: FormatterOutputType = {
    contact_status: 'not_started',
    contact_id: '',
    data: {},
    meta: {}
  }

  if (!data) {
    return output
  }

  // Guessing name
  if (data.display_name) {
    output.data.name = data.display_name
  } else if (data.name || data.first_name || data.last_name) {
    const name = data.name || data.first_name
    const lastname = data.last_name

    output.data.name = `${name} ${lastname}`.trim()
  }

  // Guessing email
  if (data.email) {
    output.data.email = data.email
  }

  return output
}

export function formatter(
  type: MiniContactType,
  initData: any
): FormatterOutputType {
  // Extracting data from context (where the MiniContact is using)
  // based on type using formatters
  if (type == 'insight') {
    return insightFormatter(initData)
  }

  if (type == 'contact') {
    return contactFormatter(initData)
  }

  if (type == 'user') {
    return userFormatter(initData)
  }

  return fallbackFormatter(initData)
}
