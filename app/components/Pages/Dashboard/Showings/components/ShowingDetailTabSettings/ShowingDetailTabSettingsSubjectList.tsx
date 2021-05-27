import { Box, makeStyles } from '@material-ui/core'

import { showingDetailSettingsTabs } from './constants'

import ShowingDetailTabSettingsSubjectListItem from './ShowingDetailTabSettingsSubjectListItem'
import { ShowingDetailSettingsTabType } from './types'

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

const tabs: ShowingDetailSettingsTabType[] = [
  'Availability',
  'ListingInfo',
  'AppointmentTypeAndParticipants',
  'AccessInformation',
  'AppraisalsAndInspections',
  'Feedback'
]

interface ShowingDetailTabSettingsSubjectListProps {
  tab: ShowingDetailSettingsTabType
}

function ShowingDetailTabSettingsSubjectList({
  tab
}: ShowingDetailTabSettingsSubjectListProps) {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      {tabs.map(tabName => (
        <ShowingDetailTabSettingsSubjectListItem
          key={showingDetailSettingsTabs[tabName]}
          label={showingDetailSettingsTabs[tabName]}
          to={tabName}
          selected={tabName === tab}
        />
      ))}
    </Box>
  )
}

export default ShowingDetailTabSettingsSubjectList
