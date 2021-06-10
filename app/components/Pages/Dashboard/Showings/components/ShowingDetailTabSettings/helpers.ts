import { Mutator } from 'final-form'

import { showingDetailSettingsTabs } from './constants'
import { ShowingDetailSettingsTabType, ShowingRoleFormValues } from './types'

function isValidSettingsTab(tab: string): tab is ShowingDetailSettingsTabType {
  return !!showingDetailSettingsTabs[tab]
}

export function getValidShowingDetailSettingsTab(
  tab?: string,
  defaultTab: ShowingDetailSettingsTabType = 'Availability'
): ShowingDetailSettingsTabType {
  return tab && isValidSettingsTab(tab) ? tab : defaultTab
}

export function getShowingRoleLabel(role: IDealRoleType): string {
  switch (role) {
    case 'SellerAgent':
      return 'Agent'

    case 'CoSellerAgent':
      return 'Co-Agent'

    case 'Tenant':
      return 'Occupant'

    default:
      return ''
  }
}

export const selectUserMutator: Mutator<ShowingRoleFormValues> = (
  [user]: [IUser],
  state,
  { changeValue }
) => {
  // TODO: remove this log
  console.log('select user', user)
  changeValue(state, 'first_name', () => user.first_name)
  changeValue(state, 'last_name', () => user.last_name)
  changeValue(state, 'email', () => user.email)
  changeValue(state, 'phone_number', () => user.phone_number)
  changeValue(state, 'user', () => user.id)
}

export const selectAgentMutator: Mutator<ShowingRoleFormValues> = (
  [agent]: [IAgent],
  state,
  { changeValue }
) => {
  // TODO: remove this log
  console.log('select agent', agent)
  changeValue(state, 'first_name', () => agent.first_name)
  changeValue(state, 'last_name', () => agent.last_name)
  changeValue(state, 'email', () => agent.email)
  changeValue(state, 'phone_number', () => agent.phone_number)
  changeValue(state, 'user', () => agent.user_id)
}

export const selectContactMutator: Mutator<ShowingRoleFormValues> = (
  [contact]: [IContact],
  state,
  { changeValue }
) => {
  // TODO: remove this log
  console.log('select contact', contact)

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
}
