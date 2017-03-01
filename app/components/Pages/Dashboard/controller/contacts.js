// controller/contacts.js
const controller = {
  getContactsForSearch(contacts) {
    if (!contacts)
      return
    const contacts_found = []
    contacts.forEach((contact, i) => {
      const users = contact.users
      if (users) {
        // Loop through users
        contact.users.forEach(user => {
          const deep_search = `${user.first_name ? user.first_name : ''} ${user.last_name ? user.last_name : ''} ${user.email ? user.email : ''} ${user.phone_number ? user.phone_number : ''} `
          contacts_found.push({
            value: user,
            label: user.first_name ? user.first_name : user.phone_number,
            deep_search,
            type: 'user',
            index: i
          })
        })
      } else {
        const sub_contact = contact.sub_contacts[0]
        if (sub_contact.attributes.emails) {
          // Loop through emails
          sub_contact.attributes.emails.forEach(email_obj => {
            const deep_search = `${contact.display_name} ${email_obj.email}`
            contacts_found.push({
              value: email_obj.email,
              label: `${contact.display_name} ${email_obj.email}`,
              deep_search,
              type: 'email',
              index: i
            })
          })
        }
        // Loop through phone numbers
        if (sub_contact.attributes.phone_numbers) {
          sub_contact.attributes.phone_numbers.forEach(phone_number_obj => {
            const deep_search = `${contact.display_name} ${phone_number_obj.phone_number}`
            contacts_found.push({
              value: phone_number_obj.phone_number,
              label: `${contact.display_name} ${phone_number_obj.phone_number}`,
              deep_search,
              type: 'phone_number',
              index: i
            })
          })
        }
      }
    })
    return contacts_found
  }
}
export default controller