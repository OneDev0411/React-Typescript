import _ from 'underscore'
import moment from 'moment'
import config from '../../config/public'
import Fetch from '../services/fetch'

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
  const { contacts } = params

  try {
    const response = await new Fetch()
      .post('/contacts')
      .send({contacts})

    return response
  } catch (e) {
    throw e
  }
}

/**
* returns contacts list
*/
Contact.getContacts = async function(user) {
  const { access_token } = user

  try {
    const fetchContacts = new Fetch()
      .get('/contacts?limit=10000&sorting_value=Update')

    // required on ssr
    if (access_token)
      fetchContacts.set({ Authorization: `Bearer ${access_token}` })

    return await fetchContacts
  } catch (e) {}
}

/**
* returns contact's timeline
*/
Contact.getTimeline = async function(id) {
  const endpoint = `/contacts/${id}/timeline`

  try {
    const response = await new Fetch()
      .get(endpoint)

    return response
  } catch (e) {
    throw e
  }
}

/**
* add note
*/
Contact.addNote = async function(params) {
  const { id, note } = params
  const endpoint = `/contacts/${id}/attributes`
  const payload = Contact.helper.populateAttributes('note', [{ note }])

  try {
    const response = await new Fetch()
      .post(endpoint)
      .send(payload)

    return response
  } catch (e) {
    throw e
  }
}

/**
* add new item to user's timeline
*/
Contact.updateUserTimeline = async function(user, user_action, object_class, object) {
  const endpoint = `${api_host}/users/self/timeline`

  try {
    const response = await new Fetch()
      .post(endpoint)
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
  const { id, type, attributes } = params
  const endpoint = `/contacts/${id}/attributes`
  const payload = Contact.helper.populateAttributes(type, attributes)

  try {
    const response = await new Fetch()
      .post(endpoint)
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
  const { id, type, attributes } = params
  const payload = Contact.helper.populateAttributes(type, attributes)

  try {
    const response = await new Fetch()
      .put(`/contacts/update-attributes`)
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
  const { id, attribute_id } = params

  try {
    const response = await new Fetch()
      .delete(`/contacts/delete-attribute`)
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
Contact.getTags = async function() {
  try {
    const response = await new Fetch()
      .get(`/contacts/tags`)

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
    const item = Contact.get._sort(source_types, 'updated_at')

    if (!item)
      return {}

    let label

    switch (item.source_type) {
      case 'BrokerageWidget':
        label = 'Created from a brokerage widget'
        break
      case 'ExplicitlyCreated':
        label = 'Created by you'
        break
      case 'IOSAddressBook':
        label = 'From your address book'
        break
      case 'SharesRoom':
        label = 'Created because you share a room'
        break
      case 'Unknown':
        label = 'Unknown'
        break
    }

    return {
      name: item.source_type,
      label
    }
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

    return {
      name: 'General'
    }
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

    return _.sortBy(list, item => item.updated_at * -1)
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
