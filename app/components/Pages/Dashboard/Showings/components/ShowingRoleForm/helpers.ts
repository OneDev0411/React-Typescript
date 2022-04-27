import { Mutator } from 'final-form'

import { ShowingRoleFormValues } from './types'

export const selectUserMutator: Mutator<ShowingRoleFormValues> = (
  [user]: [IUser],
  state,
  { changeValue }
) => {
  changeValue(state, 'first_name', () => user.first_name)
  changeValue(state, 'last_name', () => user.last_name)
  changeValue(state, 'email', () => user.email)
  changeValue(state, 'phone_number', () => user.phone_number)
  changeValue(state, 'user', () => user || undefined)
}

export const selectUserAgentMutator: Mutator<ShowingRoleFormValues> = (
  [agent]: [IAgent],
  state,
  { changeValue }
) => {
  changeValue(state, 'first_name', () => agent.first_name)
  changeValue(state, 'last_name', () => agent.last_name)
  changeValue(state, 'email', () => agent.email)
  changeValue(state, 'phone_number', () => agent.phone_number)
  changeValue(state, 'agent', () => agent)
}

export const selectAgentMutator: Mutator<ShowingRoleFormValues> = (
  [agent]: [IAgent],
  state,
  { changeValue }
) => {
  changeValue(state, 'first_name', () => agent.first_name)
  changeValue(state, 'last_name', () => agent.last_name)
  changeValue(state, 'email', () => agent.email)
  changeValue(state, 'phone_number', () => agent.phone_number)
  changeValue(state, 'user', () => agent.user_id || undefined)
}

export const selectContactMutator: Mutator<ShowingRoleFormValues> = (
  [contact]: [IContact],
  state,
  { changeValue }
) => {
  const attributes = contact.attributes?.reduce<
    Record<string, string | number>
  >(
    (attributes, attribute) => ({
      ...attributes,
      [attribute.attribute_type]: attribute[attribute.attribute_def.data_type]
    }),
    {}
  )

  changeValue(state, 'first_name', () => attributes?.first_name || '')
  changeValue(state, 'last_name', () => attributes?.last_name || '')
  changeValue(state, 'email', () => attributes?.email || '')
  changeValue(state, 'phone_number', () => attributes?.phone_number || '')
  changeValue(state, 'user', () => undefined)
  changeValue(state, 'contact', () => contact)
}
