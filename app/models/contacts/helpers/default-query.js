const associations = [
  'contact.attributes',
  'contact.summary',
  'contact.users',
  'contact_attribute.attribute_def'
]

export const defaultQuery = { associations }

export const updateContactQuery = {
  associations: [
    ...associations,
    'user.last_seen_by',
    'contact.user',
    'contact.created_by',
    'contact.updated_by'
  ]
}

export const makeQueryAssociations = (list, associationName) =>
  list.map(item => `crm_${associationName}.${item}`)

const CRM_TASK_ASSOCIATIONS = makeQueryAssociations(
  ['reminders', 'assignees', 'created_by', 'updated_by', 'associations'],
  'task'
)

const CRM_ASSOCIATIONS_TYPES = makeQueryAssociations(
  ['deal', 'contact', 'listing', 'email'],
  'association'
)

export const CRM_TASKS_QUERY = {
  associations: [
    ...CRM_TASK_ASSOCIATIONS,
    ...CRM_ASSOCIATIONS_TYPES,
    'contact.summary',
    'deal.brand',
    'email_campaign.emails',
    'email_campaign.template'
  ]
}
