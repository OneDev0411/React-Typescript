import _ from 'underscore'
import Fetch from '../services/fetch'

const Contact = {
  get: {},
  helper: {}
}

/**
 * add note
 */
Contact.addNote = async function(id, note) {
  const endpoint = `/contacts/${id}/attributes`
  const payload = Contact.helper.populateAttributes('note', [{ note }])

  try {
    const response = await new Fetch().post(endpoint).send(payload)

    return response
  } catch (e) {
    throw e
  }
}

/**
 * add new item to user's timeline
 */
Contact.updateUserTimeline = async function(action, object_class, object) {
  const requestBody = {
    action,
    object,
    object_class
  }

  try {
    const response = await new Fetch()
      .post('/users/self/timeline')
      .send(requestBody)

    return response
  } catch (e) {
    throw e
  }
}

/**
 * create new attributes
 */
Contact.createAttributes = async function(id, type, attributes) {
  const endpoint = `/contacts/${id}/attributes`

  try {
    const response = await new Fetch().post(endpoint).send({ attributes })

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
 * update current attributes
 */
Contact.updateAttributes = async function(id, type, attributes) {
  try {
    const response = await new Fetch()
      .patch(`/contacts/${id}`)
      .send({ attributes })

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
 * delete attribute
 */
Contact.deleteAttribute = async function(id, attribute_id) {
  try {
    const response = await new Fetch().delete(
      `/contacts/${id}/attributes/${attribute_id}`
    )

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
 * get tags
 */
Contact.getTags = async function() {
  try {
    const response = await new Fetch().get('/contacts/tags')

    return response
  } catch (e) {
    throw e
  }
}

/**
 * helpers functions
 */
Contact.helper = {
  populateAttributes: (type, attributes) => ({
    attributes: attributes.map(item => ({ type, ...item }))
  })
}

/**
 * helpers functions
 */
// Contact.helper = {
//   populateAttributes: (type, attributes) => ({
//     attributes: _.map(attributes, attr => {
//       const item = { type }

//       if (attr[type]) {
//         item[type] = attr[type]
//       }

//       if (attr.id) {
//         item.id = attr.id
//       }

//       return { ...item, ...attr }
//     })
//   })
// }

/**
 * Helper class to get Contact fields
 */
Contact.get = {
  _sort: (list, sort_by = 'updated_at', order = 'desc') => {
    if (!list) {
      return null
    }

    if (list.length === 1) {
      return list[0]
    }

    const order_val = order === 'asc' ? 1 : -1
    const sorted = _.sortBy(list, item => item[sort_by] * order_val)

    return sorted[0]
  },
  _trim: (text, max) =>
    text.length < max ? text : `${text.substr(0, max)}...`,
  _all: (context, attrs, type) => {
    let list = []

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
    const avatars = context.sub_contacts[0].attributes.profile_image_urls
    let item = Contact.get._sort(avatars)

    if (item) {
      return item.profile_image_url
    }

    item = Contact.get._sort(context.users)

    if (item) {
      return item.cover_image_url
    }
  },
  source: context => {
    const source_types = context.sub_contacts[0].attributes.source_types
    const item = Contact.get._sort(source_types, 'updated_at')

    if (!item) {
      return {}
    }

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

    if (item) {
      return Contact.get._trim(item.email, max)
    }
  },
  emails: context => Contact.get._all(context, 'emails', 'email'),
  phone: context => {
    const phone_numbers = context.sub_contacts[0].attributes.phone_numbers

    if (phone_numbers && phone_numbers.length > 0) {
      return phone_numbers[0].phone_number
    }

    return ''
  },
  phones: context => Contact.get._all(context, 'phone_numbers', 'phone_number'),
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

    return item || {}
  },
  addresses: context => {
    let list = []

    _.each(context.sub_contacts, sub => {
      const address = Contact.get._sort(sub.attributes.addresses)

      if (address) {
        list.push(address)
      }
    })

    if (list.length === 0) {
      list = [
        {
          street_name: '-',
          city: '-',
          state: '-',
          postal_code: '-'
        }
      ]
    }

    return list
  },
  birthdays: context => {
    const list = []

    _.each(context.sub_contacts, sub => {
      const item = Contact.get._sort(sub.attributes.birthdays)

      if (item) {
        list.push(item)
      }
    })

    return list
  },
  notes: context => {
    let list = []

    _.each(context.sub_contacts, sub => {
      const notes = sub.attributes.notes

      if (notes && notes.length > 0) {
        list = list.concat(notes)
      }
    })

    return _.sortBy(list, item => item.updated_at * -1)
  },
  tags: (context, defaultTags) => {
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
    const tags = _.filter(defaultTags, item => !list[item.name])

    return {
      ..._.indexBy(tags, 'tag'),
      ...list
    }
  },
  attribute: ({ contact, name, type }) => Contact.get._all(contact, name, type),
  companies: context => Contact.get._all(context, 'companies', 'company')
}

Contact.uplaodCsv = async function(file, fileName = null) {
  const title = fileName || file.name

  try {
    return await new Fetch()
      .upload('/contacts/outlook.csv')
      .attach('attachment', file, title)
  } catch (e) {
    throw e
  }
}

export default Contact

export function extractUserInfoFromContact(contact) {
  const { summary, id } = contact
  const emails = Contact.get.emails(contact)
  const phones = Contact.get.phones(contact)
  const companies = Contact.get.companies(contact)
  const profile_image_url = Contact.get.avatar(contact)

  const user = {
    id,
    emails,
    phones,
    contact,
    companies,
    profile_image_url,
    ...summary
  }

  return user
}
