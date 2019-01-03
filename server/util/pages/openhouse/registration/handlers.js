const fetch = require('isomorphic-fetch')

const config = require('../../../../../config/public').default
const storage = require('./storage').default

const API_URL = config.api_url

export function onlineSubmitHandler(data) {
  return new Promise((resolve, reject) => {
    try {
      console.log('ON ONLINE SUBMIT', data)

      const filterContactsApiUrl = `${API_URL}/contacts/filter?limit=1`
      const attributeDefinitionsApiUrl = `${API_URL}/contacts/attribute_defs`
      const createContactApiUrl = `${API_URL}/contacts?activity=true&relax=false&get=true`
      const associateContactApiUrl = `${API_URL}/crm/tasks/${
        data.id
      }/associations`

      fetch(filterContactsApiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${data.agentAccessToken}`,
          'X-RECHAT-BRAND': data.data.brandId,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filter: [
            { attribute_type: 'email', value: data.data.registration.email }
          ]
        })
      })
        .then(filterResponse => filterResponse.json())
        .then(filterBody => {
          const associationRequestBody = {
            association_type: 'contact',
            contact: null,
            crm_task: data.id
          }

          const contactExists = filterBody.data.length > 0

          if (contactExists) {
            const existingContactId = filterBody.data[0].id

            associationRequestBody.contact = existingContactId

            fetch(associateContactApiUrl, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${data.agentAccessToken}`,
                'X-RECHAT-BRAND': data.data.brandId,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(associationRequestBody)
            })
          } else {
            fetch(attributeDefinitionsApiUrl, {
              headers: {
                Authorization: `Bearer ${data.agentAccessToken}`,
                'X-RECHAT-BRAND': data.data.brandId
              }
            })
              .then(response => response.json())
              .then(body => {
                const rawAttrDefData = body.data
                const neededKeys = Object.keys(data.data.registration)
                const attrDefData = rawAttrDefData.filter(attr =>
                  neededKeys.includes(attr.name)
                )
                const createContactRequestBody = {
                  contacts: [
                    {
                      user: data.agentUserId,
                      attributes: [
                        {
                          text: data.data.registration.first_name,
                          attribute_def: attrDefData.find(
                            attr => attr.name == 'first_name'
                          ).id
                        },
                        {
                          text: data.data.registration.last_name,
                          attribute_def: attrDefData.find(
                            attr => attr.name == 'last_name'
                          ).id
                        },
                        {
                          is_primary: true,
                          label: 'Other',
                          text: data.data.registration.email,
                          attribute_def: attrDefData.find(
                            attr => attr.name == 'email'
                          ).id
                        },
                        {
                          is_primary: true,
                          label: 'Other',
                          text: data.data.registration.phone_number,
                          attribute_def: attrDefData.find(
                            attr => attr.name == 'phone_number'
                          ).id
                        }
                      ]
                    }
                  ]
                }

                fetch(createContactApiUrl, {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${data.agentAccessToken}`,
                    'X-RECHAT-BRAND': data.data.brandId,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(createContactRequestBody)
                })
                  .then(createContactResponse => createContactResponse.json())
                  .then(createContactResponseBody => {
                    const createdContactId =
                      createContactResponseBody.data[0].id

                    associationRequestBody.contact = createdContactId

                    fetch(associateContactApiUrl, {
                      method: 'POST',
                      headers: {
                        Authorization: `Bearer ${data.agentAccessToken}`,
                        'X-RECHAT-BRAND': data.data.brandId,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(associationRequestBody)
                    })

                    resolve()
                  })
              })
          }
        })
    } catch (e) {
      reject(e)
    }
  })
}

export function offlineSubmitHandler(data) {
  console.log('ON OFFLINE SUBMIT', data)
  storage.append(data.id, data)
}
