const aliases = {
  Title: 'Escrow Officer',
  Lender: 'Lending Agent',
  BuyerPowerOfAttorney: 'Power of Attorney - Buyer',
  SellerPowerOfAttorney: 'Power of Attorney - Seller',
  LandlordPowerOfAttorney: 'Power of Attorney - Landlord',
  TenantPowerOfAttorney: 'Power of Attorney - Tenant'
}

export function roleName(role) {
  const name = aliases[role] || role

  return name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/Co\s/g, 'Co-')
}

export function normalizeContactAsRole(contact) {
  const newContact = contact

  delete newContact.id

  let {
    title,
    last_name,
    middle_name,
    first_name,
    email,
    phone_number
  } = contact

  if (first_name === email || first_name === phone_number) {
    first_name = ''
  }

  let { company_title } = contact

  if (!contact.company_title && contact.companies && contact.companies[0]) {
    company_title = contact.companies[0].company
  }

  const fakeRole = {
    ...newContact,
    company_title,
    legal_prefix: title,
    legal_first_name: first_name,
    legal_middle_name: middle_name,
    legal_last_name: last_name
  }

  return fakeRole
}

export function normalizeNewRoleFormDataAsContact(formData = {}) {
  let emails
  let phone_numbers
  let companies
  const {
    email,
    phone_number,
    company_title,
    legal_prefix,
    legal_first_name,
    legal_middle_name,
    legal_last_name
  } = formData

  if (email) {
    emails = [email]
    delete formData.email
  }

  if (phone_number) {
    phone_numbers = [phone_number]
    delete formData.phone_number
  }

  if (company_title) {
    companies = [company_title]
    delete formData.company_title
  }

  return {
    emails,
    phone_numbers,
    companies,
    title: legal_prefix,
    first_name: legal_first_name,
    middle_name: legal_middle_name,
    last_name: legal_last_name
  }
}

export async function getUpdatedNameAttribute(formData) {
  const { contact } = formData

  if (!contact) {
    return null
  }

  const {
    legal_prefix: title,
    legal_first_name: first_name,
    legal_middle_name: middle_name,
    legal_last_name: last_name
  } = formData

  const formNameFields = {
    title,
    first_name,
    middle_name,
    last_name
  }

  let name = {
    id: undefined,
    type: 'name'
  }
  const { names } = contact.sub_contacts[0].attributes

  if (Array.isArray(names) && names.length > 0) {
    name = {
      ...name,
      ...names[0]
    }
  }

  const fieldsList = ['title', 'first_name', 'middle_name', 'last_name']

  const updatedFieldsList = Object.keys(formNameFields)
    .filter(attr => fieldsList.includes(attr))
    .filter(attr => !name[attr] || formNameFields[attr] !== name[attr])

  if (updatedFieldsList.length > 0) {
    const updatedFields = {}

    updatedFieldsList.forEach(field => {
      updatedFields[field] = formNameFields[field]
    })

    return {
      ...name,
      ...updatedFields
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

    if (primaryRole) {
      return `${roles[primaryRole].legal_first_name} ${
        roles[primaryRole].legal_last_name
      }`
    }
  }

  return ''
}
