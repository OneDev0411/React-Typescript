import agent from 'superagent'
import _ from 'underscore'
import moment from 'moment'
import config from '../../config/public'

const Contact = {
  get: {},
  helper: {}
}
// set api host
const api_host = config.api_url
const proxy_host = config.app.url

/**
* add new contact
*/
Contact.add = async function(params) {
  const { contacts, access_token } = params

  try {
    const response = await agent
      .post(`${api_host}/contacts`)
      .set({ Authorization: `Bearer ${access_token}` })
      .send({contacts})

    return response
  } catch (e) {
    throw e
  }
}

/**
* returns contacts list
*/
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
* returns contact's timeline
*/
Contact.getTimeline = async function(params) {
  const { id, access_token } = params
  const endpoint = `${api_host}/contacts/${id}/timeline`

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
* add note
*/
Contact.addNote = async function(params) {
  const { id, note, access_token } = params
  const endpoint = `${api_host}/contacts/${id}/attributes`
  const payload = Contact.helper.addAttribute('note', note)

  try {
    const response = await agent
      .post(endpoint)
      .set({ Authorization: `Bearer ${access_token}` })
      .send(payload)

    return response
  } catch (e) {
    throw e
  }
}

/**
* add new item to user's timeline
*/
Contact.updateUserTimeline = async function(params) {
  const { user_action, object_class, object, access_token } = params
  const endpoint = `${api_host}/users/self/timeline`

  try {
    const response = await agent
      .post(endpoint)
      .set({ Authorization: `Bearer ${access_token}` })
      .send({ action: user_action })
      .send({ object_class })
      .send({ object })

    return response
  } catch (e) {
    throw e
  }
}

/**
* create new attributes
*/
Contact.createAttributes = async function(params) {
  const { id, type, attributes, access_token } = params
  const endpoint = `${api_host}/contacts/${id}/attributes`
  const payload = Contact.helper.populateAttributes(type, attributes)

  try {
    const response = await agent
      .post(endpoint)
      .set({ Authorization: `Bearer ${access_token}` })
      .send(payload)

    return response
  } catch (e) {
    throw e
  }
}

/**
* update current attributes
*/
Contact.updateAttributes = async function(params) {
  const { id, type, attributes, access_token } = params
  const payload = Contact.helper.populateAttributes(type, attributes)

  try {
    const response = await agent
      .post(`${proxy_host}/api/contacts/update-attributes?access_token=${access_token}`)
      .set({ Authorization: `Bearer ${access_token}` })
      .send({ contact_id: id })
      .send({ attributes: payload.attributes })

    return response
  } catch (e) {
    throw e
  }
}

/**
* delete attribute
*/
Contact.deleteAttribute = async function(params) {
  const { id, attribute_id, access_token } = params

  try {
    const response = await agent
      .post(`${proxy_host}/api/contacts/delete-attribute?access_token=${access_token}`)
      .set({ Authorization: `Bearer ${access_token}` })
      .send({ contact_id: id })
      .send({ attribute_id })

    return response
  } catch (e) {
    throw e
  }
}

/**
* get tags
*/
Contact.getTags = async function(params) {
  const { access_token } = params

  try {
    const response = await agent
      .get(`${api_host}/contacts/tags`)
      .set({ Authorization: `Bearer ${access_token}` })

    return response
  } catch (e) {
    throw e
  }
}

/**
* helpers functions
*/
Contact.helper = {
  populateAttributes: (type, attributes) => {
    return {
      attributes: _.map(attributes, attr => {
        const item =  { type }

        if (attr[type])
          item[type] = attr[type]

        if (attr.id)
          item.id = attr.id

        return { ...item, ...attr }
      })
    }
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
  _all: (context, attrs, type) => {
    let list = new Array()
    _.each(context.sub_contacts, sub => {
      const collection = _.uniq(sub.attributes[attrs], type)
      list = list.concat(collection)
    })

    return _.uniq(list, type)
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
  email: (context, max = 1000) => {
    const emails = context.sub_contacts[0].attributes.emails
    const item = Contact.get._sort(emails)

    if (item)
      return Contact.get._trim(item.email, max)
  },
  emails: context => {
    return Contact.get._all(context, 'emails', 'email')
  },
  phone: context => {
    const phone_numbers = context.sub_contacts[0].attributes.phone_numbers
    const item = Contact.get._sort(phone_numbers)

    if (item)
      return item.phone_number
  },
  phones: context => {
    return Contact.get._all(context, 'phone_numbers', 'phone_number')
  },
  stage: context => {
    const stages = context.sub_contacts[0].attributes.stages
    const item = Contact.get._sort(stages)

    if (item) {
      return {
        id: item.id,
        name: item.stage
      }
    }

    return {}
  },
  address: context => {
    const addresses = context.sub_contacts[0].attributes.addresses
    const item = Contact.get._sort(addresses)
    return item ? item : {}
  },
  addresses: context => {
    let list = []
    _.each(context.sub_contacts, sub => {
      const address = Contact.get._sort(sub.attributes.addresses)
      if (address)
        list.push(address)
    })

    if (list.length === 0) {
      list = [{
        street_name: '-',
        city: '-',
        state: '-',
        postal_code: '-'
      }]
    }

    return list
  },
  birthdays: context => {
    const list = []
    _.each(context.sub_contacts, sub => {
      const item = Contact.get._sort(sub.attributes.birthdays)
      if (item)
        list.push(item)
    })

    return list
  },
  notes: context => {
    let list = new Array()
    _.each(context.sub_contacts, sub => {
      const notes = sub.attributes.notes
      if (notes && notes.length > 0)
        list = list.concat(notes)
    })

    return _.sortBy(list, item => item.created_at * -1)
  },
  tags: context => {
    let list = {}

    _.each(context.sub_contacts, sub => {
      _.each(sub.attributes.tags, item => {
        list[item.tag] = {
          ...item,
          active: true
        }
      })
    })

    // get default tags with current contact's tag
    const default_tags = _.filter(context.default_tags, item => !list[item.name])

    return {
      ..._.indexBy(default_tags, 'tag'),
      ...list
    }
  }
}

export default Contact
