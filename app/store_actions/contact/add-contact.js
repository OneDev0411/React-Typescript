import Contact from '../../models/Contact'
import types from '../../constants/contact'

function contactCreated(contact) {
  return {
    type: types.ADD_CONTACT,
    contact
  }
}

export function addContact(args) {
  let {
    first_name,
    last_name,
    middle_name,
    legal_first_name,
    legal_middle_name,
    legal_last_name,
    stage,
    legal_prefix,
    emails,
    phone_numbers
  } = args

  const contact = {
    type: 'contact',
    attributes: {
      names: [
        {
          type: 'name',
          first_name,
          middle_name,
          last_name,
          legal_prefix,
          legal_first_name,
          legal_middle_name,
          legal_last_name,
          title: legal_prefix
        }
      ],
      source_types: [
        {
          type: 'source_type',
          source_type: 'ExplicitlyCreated'
        }
      ]
    }
  }

  if (typeof stage === 'string') {
    const stages = [
      {
        type: 'stage',
        stage
      }
    ]

    const attributes = {
      ...contact.attributes,
      stages
    }

    contact.attributes = attributes
  }

  if (phone_numbers && Array.isArray(phone_numbers) && phone_numbers.length > 0) {
    const phoneNumbers = attributeNormalizer({
      attributeName: 'phone_number',
      attributeValue: phone_numbers
    })

    const attributes = {
      ...contact.attributes,
      phone_numbers: phoneNumbers
    }

    contact.attributes = attributes
  }

  if (emails && Array.isArray(emails) && emails.length > 0) {
    const normalizedEmails = attributeNormalizer({
      attributeName: 'email',
      attributeValue: emails
    })

    const attributes = {
      ...contact.attributes,
      emails: normalizedEmails
    }

    contact.attributes = attributes
  }

  const params = {
    contacts: [contact]
  }

  return async dispatch => {
    const response = await Contact.add(params)

    const contact = response.body.data[0]

    dispatch(contactCreated(contact))

    return contact.id
  }
}

function attributeNormalizer({ attributeName, attributeValue }) {
  return attributeValue.filter(item => item != null).map(item => ({
    type: attributeName,
    [attributeName]: item
  }))
}
