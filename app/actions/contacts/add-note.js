import _ from 'underscore'
import Contact from '../../models/Contact'
import AppStore from '../../stores/AppStore'

export default async function (id, user, note) {
  const params = {
    id,
    note,
    access_token: user.access_token
  }

  try {
    const response = await Contact.addNote(params)

    if (response.status === 200) {
      AppStore.data.contacts[id] = {
        ...response.body.data,
        ...{ timeline: AppStore.data.contacts[id].timeline }
      }
    }

    AppStore.emitChange()
  }
  catch(e) {
    console.log(e)
  }
}
