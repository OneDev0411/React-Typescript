import Contact from '../../models/Contact'
import AppStore from '../../stores/AppStore'

export default async function (user) {
  const params = {
    access_token: user.access_token
  }

  try {
    const response = await Contact.getContacts(params)

    if (response.status === 200)
      AppStore.data.contacts = response.body.data

    AppStore.emitChange('contacts')
  }
  catch(e) {
    console.log(e)
  }
}
