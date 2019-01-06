const fetch = require('isomorphic-fetch')

const config = require('../../../../../config/public').default
const storage = require('./storage').default

const API_URL = config.api_url

export function onlineSubmitHandler(data) {
  const filterContactsApiUrl = `${API_URL}/contacts/filter?limit=1`
  const attributeDefinitionsApiUrl = `${API_URL}/contacts/attribute_defs`
  const createContactApiUrl = `${API_URL}/contacts?activity=true&relax=false&get=true`
  const associateContactApiUrl = `${API_URL}/crm/tasks/${data.id}/associations`

  const requestHeaders = {
    Authorization: `Bearer ${data.agentAccessToken}`,
    'X-RECHAT-BRAND': data.data.brandId,
    'Content-Type': 'application/json'
  }

  function filterContactsByEmail(email) {
    return fetch(filterContactsApiUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({
        filter: [{ attribute_type: 'email', value: email }]
      })
    }).then(response => response.json())
  }

  function associateContactToEvent(contactId) {
    return fetch(associateContactApiUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({
        association_type: 'contact',
        contact: contactId,
        crm_task: data.id
      })
    })
  }

  function getAttributeDefinitions() {
    return fetch(attributeDefinitionsApiUrl, {
      headers: requestHeaders
    }).then(response => response.json())
  }

  function createContact(contact) {
    return getAttributeDefinitions().then(attributeDefsBody => {
      const rawAttrDefData = attributeDefsBody.data
      const neededKeys = Object.keys(data.data.registration)

      neededKeys.push('source_type', 'tag')

      const attrDefData = {}

      rawAttrDefData.forEach(attr => {
        if (!neededKeys.includes(attr.name)) {
          return
        }

        attrDefData[attr.name] = attr.id
      })

      const createContactRequestBody = {
        contacts: [
          {
            user: data.agentUserId,
            attributes: [
              {
                text: 'Open House',
                attribute_def: attrDefData.source_type
              },
              {
                text: 'Open House',
                attribute_def: attrDefData.tag
              },
              {
                text: contact.first_name,
                attribute_def: attrDefData.first_name
              },
              {
                text: contact.last_name,
                attribute_def: attrDefData.last_name
              },
              {
                is_primary: true,
                label: 'Other',
                text: contact.email,
                attribute_def: attrDefData.email
              },
              {
                is_primary: true,
                label: 'Other',
                text: contact.phone_number,
                attribute_def: attrDefData.phone_number
              }
            ]
          }
        ]
      }

      return fetch(createContactApiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${data.agentAccessToken}`,
          'X-RECHAT-BRAND': data.data.brandId,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createContactRequestBody)
      }).then(createContactResponse => createContactResponse.json())
    })
  }

  return new Promise((resolve, reject) => {
    try {
      filterContactsByEmail(data.data.registration.email).then(filterBody => {
        const contactExists = filterBody.data.length > 0

        if (contactExists) {
          const existingContactId = filterBody.data[0].id

          return associateContactToEvent(existingContactId).then(() =>
            resolve()
          )
        }

        const contact = {
          first_name: data.data.registration.first_name,
          last_name: data.data.registration.last_name,
          email: data.data.registration.email,
          phone_number: data.data.registration.phone_number
        }

        createContact(contact).then(createContactResponseBody => {
          const createdContactId = createContactResponseBody.data[0].id

          return associateContactToEvent(createdContactId).then(() => resolve())
        })
      })
    } catch (e) {
      reject(e)
    }
  })
}

export function offlineSubmitHandler(data) {
  storage.append(data.id, data)
}
