import { showingDetailSettingsTabs } from './constants'
import ShowingDetailTabSettingsSubjectListItem from './ShowingDetailTabSettingsSubjectListItem'
import {
  ShowingDetailSettingsTabType,
  ShowingDetailTabSettingsErrors
} from './types'

interface ShowingDetailTabSettingsSubjectListProps {
  tab: ShowingDetailSettingsTabType
  errors: ShowingDetailTabSettingsErrors
  hasListingInfo: boolean
}

function ShowingDetailTabSettingsSubjectList({
  tab,
  errors,
  hasListingInfo
}: ShowingDetailTabSettingsSubjectListProps) {
  const tabs: Nullable<ShowingDetailSettingsTabType>[] = [
    'Availability',
    'AdvanceNotice',
    hasListingInfo ? 'ListingInfo' : null,
    'ApprovalTypeAndRoles',
    'Instructions',
    'AppraisalsAndInspections'
    // 'Feedback' // TODO: uncomment this when we have something for feedback on showing
  ]

  return (
    <>
      {tabs.map(
        tabName =>
          tabName && (
            <ShowingDetailTabSettingsSubjectListItem
              key={showingDetailSettingsTabs[tabName]}
              label={showingDetailSettingsTabs[tabName]}
              to={tabName}
              selected={tabName === tab}
              error={!!errors && !!errors[tabName]}
            />
          )
      )}
    </>
  )
}

export default ShowingDetailTabSettingsSubjectList
