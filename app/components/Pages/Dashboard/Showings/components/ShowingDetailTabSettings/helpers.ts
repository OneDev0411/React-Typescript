import { showingDetailSettingsTabs } from './constants'
import { ShowingDetailSettingsTabType } from './types'

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
