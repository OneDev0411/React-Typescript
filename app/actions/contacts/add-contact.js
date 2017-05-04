import Contact from '../../models/Contact'
import AppStore from '../../stores/AppStore'

export default async function (user, emails, phone_numbers, first_name, last_name, stage) {
  const contact = {
    type: 'contact',
    attributes: {
      names: [{
        type: 'name',
        first_name: first_name,
        last_name: last_name
      }],
      stages: [{
        type: 'stage',
        stage
      }],
      source_types: [{
        type: 'source_type',
        source_type: 'ExplicitlyCreated'
      }]
    }
  }

  const filtered_phone_numbers = phone_numbers.filter(phone_number => phone_number)
  const filtered_emails = emails.filter(email => email)

  if (filtered_phone_numbers.length > 0) {
    contact.attributes['phone_numbers'] = filtered_phone_numbers.map(phone_number => {
      return { type: 'phone_number', phone_number}
    })
  }

  if (filtered_emails.length > 0) {
    contact.attributes['emails'] = filtered_emails.map(email => {
      return { type: 'email', email}
    })
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
    throw e
  }
}
