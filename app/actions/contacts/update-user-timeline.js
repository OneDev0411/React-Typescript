import _ from 'underscore'
import Contact from '../../models/Contact'
import AppStore from '../../stores/AppStore'

export default async function (user, user_action, object_class, object) {
  const params = {
    user_action,
    object_class,
    object,
    access_token: user.access_token
  }

  try {
    const response = await Contact.updateUserTimeline(params)
    // if (response.status === 200) { }
  }
  catch(e) {
  }
}
