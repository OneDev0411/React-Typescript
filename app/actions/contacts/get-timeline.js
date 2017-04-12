import _ from 'underscore'
import Contact from '../../models/Contact'
import AppStore from '../../stores/AppStore'

export default async function (id, user) {
  const params = {
    id,
    access_token: user.access_token
  }

  try {
    const response = await Contact.getTimeline(params)

    if (response.status === 200)
      AppStore.data.contacts[id].timeline = response.body.data

    AppStore.emitChange()
  }
  catch(e) {
  }
}
