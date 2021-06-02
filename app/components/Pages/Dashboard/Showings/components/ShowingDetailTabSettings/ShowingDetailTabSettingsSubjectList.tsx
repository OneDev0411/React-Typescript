import { Box, makeStyles } from '@material-ui/core'

import { showingDetailSettingsTabs } from './constants'

import ShowingDetailTabSettingsSubjectListItem from './ShowingDetailTabSettingsSubjectListItem'
import {
  ShowingDetailSettingsTabType,
  ShowingDetailTabSettingsErrors
} from './types'

const useStyles = makeStyles(
  theme => ({
    root: {
      border: `1px solid ${theme.palette.grey[200]}`,
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(1, 0)
    }
  }),
  { name: 'ShowingDetailTabSettingsSubjectList' }
)

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
  const classes = useStyles()

  const tabs: Nullable<ShowingDetailSettingsTabType>[] = [
    'Availability',
    hasListingInfo ? 'ListingInfo' : null,
    'ApprovalTypeAndRoles',
    'AccessInformation',
    'AppraisalsAndInspections',
    'Feedback'
  ]

  return (
    <Box className={classes.root}>
      {tabs.map(
        tabName =>
          tabName && (
            <ShowingDetailTabSettingsSubjectListItem
              key={showingDetailSettingsTabs[tabName]}
              label={showingDetailSettingsTabs[tabName]}
              to={tabName}
              selected={tabName === tab}
              error={!!errors[tabName]}
            />
          )
      )}
    </Box>
  )
}

export default ShowingDetailTabSettingsSubjectList
