import _ from 'underscore'
import Contact from '../../models/Contact'
import AppStore from '../../stores/AppStore'

export default async function (user) {
  const params = {
    access_token: user.access_token
  }

  try {
    const response = await Contact.getContacts(params)

    if (response.status === 200)
      AppStore.data.contacts = _.indexBy(response.body.data, 'id')

    AppStore.emitChange()
  }
  catch(e) {
    console.log(e)
  }
}
