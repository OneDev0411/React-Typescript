import agent from 'superagent'
import _ from 'underscore'
import config from '../../config/public'

const Contact = {
  get: {}
}
// set api host
const api_host = config.api_url

Contact.getContacts = async function(params) {
  const { access_token } = params
  const endpoint = `${api_host}/contacts?limit=10000`

  try {
    const response = await agent
      .get(endpoint)
      .set({ Authorization: `Bearer ${access_token}` })

    return response
  } catch (e) {
    throw e
  }
}

/**
* Helper class to get Contact fields
*/
Contact.get = {
  _sort: (list, sort_by = 'updated_at', order = 'desc') => {
    if (!list)
      return null

    if (list.length === 1)
      return list[0]

    const order_val = order === 'asc' ? 1 : -1
    const sorted = _.sortBy(list, item => item[sort_by] * order_val)
    return sorted[0]
  },
  _trim: (text, max) => {
    return text.length < max ? text : text.substr(0, max) + '...'
  },
  name: (context, max = 1000) => {
    const name = context.display_name.trim()
    return Contact.get._trim(name, max)
  },
  avatar: context => {
    const item = Contact.get._sort(context.users)

    if (item)
      return item.cover_image_url
  },
  source: context => {
    const source_types = context.sub_contacts[0].attributes.source_types
    const item = Contact.get._sort(source_types, 'created_at')

    if (item)
      return item.source_type
  },
  email: (context, max = 30) => {
    const emails = context.sub_contacts[0].attributes.emails
    const item = Contact.get._sort(emails)

    if (item)
       return Contact.get._trim(item.email, max)
  },
  phone: context => {
    const phone_numbers = context.sub_contacts[0].attributes.phone_numbers
    const item = Contact.get._sort(phone_numbers)

    if (item)
      return item.phone_number
  },
  stage: context => {
    const stages = context.sub_contacts[0].attributes.stages
    const item = Contact.get._sort(stages)

    if (item)
      return item.stage
  }
}

export default Contact
