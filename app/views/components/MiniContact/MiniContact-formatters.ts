import {
  FormatterOutputType,
} from './types'


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



export function formatter(type, initData): FormatterOutputType {
  let formattedData: FormatterOutputType = {
    contact_status: 'not_started',
    contact_id: '',
    data: {},
    meta: {}
  }

  // Extracting data from context (where the MiniContact is using)
  // based on type using formatters
  if (type == 'insight') {
    formattedData = insightFormatter(initData)
  }

  if (type == 'contact') {
    formattedData = contactFormatter(initData)
  }

  return formattedData
}