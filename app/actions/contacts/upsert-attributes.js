import _ from 'underscore'
import Contact from '../../models/Contact'
import AppStore from '../../stores/AppStore'

function updateAppStore(response) {
  if (response.status !== 200)
    return

  AppStore.data.contacts[id] = {
    ...response.body.data,
    ...{ timeline: AppStore.data.contacts[id].timeline }
  }
}

export default async function (user, id, type, attributes) {
  const defaultParams = {
    id,
    type,
    access_token: user.access_token
  }

  const updates = _.filter(attributes, attr => attr.id)
  const inserts = _.filter(attributes, attr => !attr.id)

  let response
  let params

  // insert attributes
  if (inserts.length > 0) {
    params = {
      ...defaultParams,
      ...{attributes: inserts}
    }

    try {
      // send save request
      response = await Contact.createAttributes(params)

      // update app store
      updateAppStore(response)
    } catch(e) { /* nothing */}
  }

  // update attributes
  if (updates.length > 0) {
    params = {
      ...defaultParams,
      ...{attributes: updates}
    }

    try {
      // send save request
      response = await Contact.updateAttributes(params)

      // update app store
      updateAppStore(response)

    } catch(e) { /* nothing */}
  }

  AppStore.emitChange()
}
