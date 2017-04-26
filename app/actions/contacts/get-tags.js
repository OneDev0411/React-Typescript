import _ from 'underscore'
import Contact from '../../models/Contact'
import AppStore from '../../stores/AppStore'

export default async function (user) {
  const params = {
    access_token: user.access_token
  }

  try {
    const response = await Contact.getTags(params)

    if (response.status === 200) {
      AppStore.data.contacts_tags = _.indexBy(response.body.data, 'tag') //index by name
      AppStore.emitChange()
    }
  } catch(e) {
    console.log(e)
  }
}
