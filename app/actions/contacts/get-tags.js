import _ from 'underscore'
import Contact from '../../models/Contact'
import AppStore from '../../stores/AppStore'

export default async function (user, id) {
  const params = {
    id,
    access_token: user.access_token
  }

  try {
    const response = await Contact.getTags(params)

    if (response.status === 200)
      AppStore.data.contacts[id].tags = response.body.data
  }
  catch(e) {
    console.log(e)
  }
}
