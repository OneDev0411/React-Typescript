const fetch = require('isomorphic-fetch')

const config = require('../../../../../config/public').default
const storage = require('./storage').default

const API_URL = config.api_url

export function onlineSubmitHandler(data) {
  const filterContactsApiUrl = `${API_URL}/contacts/filter?limit=1&filter_type=or`
  const attributeDefinitionsApiUrl = `${API_URL}/contacts/attribute_defs`
  const createContactApiUrl = `${API_URL}/contacts?activity=true&relax=false&get=true`
  const associateContactApiUrl = `${API_URL}/crm/tasks/${data.id}/associations`

  const requestHeaders = {
    Authorization: `Bearer ${data.agentAccessToken}`,
    'X-RECHAT-BRAND': data.data.brandId,
    'Content-Type': 'application/json'
  }

  function filterContacts(email, phoneNumber) {
    return fetch(filterContactsApiUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({
        filter: [
          { attribute_type: 'email', value: email },
          { attribute_type: 'phone_number', value: phoneNumber }
        ]
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

      neededKeys.push('source_type', 'tag', 'note')

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
                text: 'OpenHouse',
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

      const agentName = data.data.registration.agent_name

      if (agentName) {
        createContactRequestBody.contacts[0].attributes.push({
          text: `Open house agent's name: ${agentName}`,
          attribute_def: attrDefData.note
        })
      } else {
        createContactRequestBody.contacts[0].attributes.push({
          text: 'Lead',
          attribute_def: attrDefData.tag
        })
      }

      return fetch(createContactApiUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(createContactRequestBody)
      }).then(createContactResponse => createContactResponse.json())
    })
  }

  return new Promise((resolve, reject) => {
    try {
      filterContacts(
        data.data.registration.email,
        data.data.registration.phone_number
      ).then(filterBody => {
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
