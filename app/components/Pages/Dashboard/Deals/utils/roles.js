import pick from 'lodash/pick'

const aliases = {
  Title: 'Escrow Officer',
  Lender: 'Lending Agent'
}

export function roleName(role) {
  const name = aliases[role] || role

  return name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/Co\s/g, 'Co-')
}

export function normalizeContact(contact) {
  const newContact = contact

  delete newContact.id

  const {
    legal_prefix,
    legal_last_name,
    legal_middle_name,
    legal_first_name,
    title,
    last_name,
    middle_name,
    first_name,
    email,
    phone_number
  } = contact

  const firstName =
    first_name !== email && first_name !== phone_number && first_name
  const legalFirstName =
    legal_first_name !== email &&
    legal_first_name !== phone_number &&
    legal_first_name

  const fakeRole = {
    ...newContact,
    legal_prefix: legal_prefix || title,
    legal_first_name: legalFirstName || firstName,
    legal_middle_name: legal_middle_name || middle_name,
    legal_last_name: legal_last_name || last_name
  }

  return fakeRole
}

export function normalizedFormDataAsContact(formData = {}) {
  const { email, phone_number } = formData
  let emails
  let phone_numbers

  if (email) {
    emails = [email]
    delete formData.email
  }

  if (phone_number) {
    phone_numbers = [phone_number]
    delete formData.phone_number
  }

  return {
    ...formData,
    emails,
    phone_numbers
  }
}

export async function getUpdatedNameAttribute(formData = {}) {
  const { contact } = formData
  const { summary, sub_contacts } = contact
  const updateList = [
    'legal_prefix',
    'legal_first_name',
    'legal_middle_name',
    'legal_last_name'
  ]

  const { names } = sub_contacts[0].attributes
  const namesId = Array.isArray(names) ? names[0].id : undefined

  const nameFields = [
    'title',
    'nickname',
    'first_name',
    'middle_name',
    'last_name',
    'legal_prefix',
    'legal_first_name',
    'legal_middle_name',
    'legal_last_name'
  ]

  const nameAttribute = pick(summary, nameFields)

  const updatedNamesList = Object.keys(formData)
    .filter(attr => updateList.includes(attr))
    .filter(attr => {
      if (formData[attr]) {
        return !nameAttribute[attr] || formData[attr] !== nameAttribute[attr]
      }
    })

  const updatedNames = {}

  updatedNamesList.forEach(name => {
    updatedNames[name] = formData[name]
  })

  if (Object.keys(updatedNames).length > 0) {
    return {
      ...nameAttribute,
      ...updatedNames,
      id: namesId,
      type: 'name'
    }
  }

  return null
}

export async function getNewAttributes(formData = {}) {
  const {
    email,
    phone_number,
    emails,
    phones,
    company_title: company,
    companies
  } = formData
  const newAttributes = []

  const isNewEmail = email && !emails.map(item => item.email).includes(email)

  const isNewCompany =
    company && !companies.map(item => item.company).includes(company)

  const isNewPhoneNumber =
    phone_number &&
    !phones.map(item => item.phone_number).includes(phone_number)

  if (isNewEmail) {
    newAttributes.push({
      email,
      type: 'email',
      is_primary: emails.length === 0
    })
  }

  if (isNewCompany) {
    newAttributes.push({
      company,
      type: 'company',
      is_primary: companies.length === 0
    })
  }

  if (isNewPhoneNumber) {
    newAttributes.push({
      phone_number,
      type: 'phone_number',
      is_primary: phones.length === 0
    })
  }

  return newAttributes
}

export function getPrimaryAgent(deal, roles) {
  const roleType = deal.deal_type === 'Buying' ? 'BuyerAgent' : 'SellerAgent'

  if (deal.roles) {
    const primaryRole = _.find(
      deal.roles,
      roleId => roles[roleId].role === roleType
    )

    return `${roles[primaryRole].legal_first_name} ${
      roles[primaryRole].legal_last_name
    }`
  }

  return ''
}
