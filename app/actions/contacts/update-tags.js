import _ from 'underscore'
import Contact from '../../models/Contact'
import AppStore from '../../stores/AppStore'

export default async function (user, id, newTags, removeTags) {
  let response

  try {
    let add_params = {
      id,
      access_token: user.access_token,
      tags: newTags
    }
    const response = await Contact.addTags(add_params)

    if (response.status === 200) {
      AppStore.data.contacts[id] = {
        ...response.body.data,
        ...{ timeline: AppStore.data.contacts[id].timeline }
      }
    }

  } catch(e) { console.log(e)/* nothing */ }

  AppStore.emitChange()
}
