import _ from 'underscore'
import Contact from '../../models/Contact'
import AppStore from '../../stores/AppStore'

export default async function (user, id, attribute_id) {
  const params = {
    id,
    attribute_id,
    access_token: user.access_token,
  }

  try {
    const response = await Contact.deleteAttribute(params)

    AppStore.data.contacts[id] = {
      ...response.body.data,
      ...{ timeline: AppStore.data.contacts[id].timeline }
    }

    AppStore.emitChange()
  } catch(e) { console.log(e)/* nothing */ }
}
