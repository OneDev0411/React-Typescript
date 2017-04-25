import Contact from '../../models/Contact'
import AppStore from '../../stores/AppStore'
export default async function (user, emails, phone_numbers, first_name, last_name, stage) {

  const contact = {
    type: 'contact',
    attributes: {
      emails: emails.map(email => {
        return { type: 'email', email}
      }),
      phone_numbers: phone_numbers.map(phone_number => {
        return { type: 'phone_number', phone_number}
      }),
      names: [{
        type: 'name',
        first_name: first_name,
        last_name: last_name
      }],
      stages: [{
        type: 'stage',
        stage
      }]
    }
  }

  const params = {
    contacts: [contact],
    access_token: user.access_token
  }

  try {
    const response = await Contact.add(params)
    const newContact = response.body.data[0]
    if (response.status === 200) {
      AppStore.data.contacts = {
        ...{[newContact.id]: newContact},
        ...AppStore.data.contacts
      }

      AppStore.emitChange()
    }
  }
  catch(e) {
    console.log(e)
  }
}
