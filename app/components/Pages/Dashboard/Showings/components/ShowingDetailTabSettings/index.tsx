import { Box } from '@material-ui/core'

import { withRouter, WithRouterProps } from 'react-router'

import TabContentSwitch from 'components/TabContentSwitch'

import { getValidShowingDetailSettingsTab } from './helpers'

import ShowingDetailTabSettingsSubjectList from './ShowingDetailTabSettingsSubjectList'
import { ShowingDetailSettingsTabType } from './types'

type ShowingDetailTabSettingsProps = WithRouterProps

function ShowingDetailTabSettings({ location }: ShowingDetailTabSettingsProps) {
  const tab = getValidShowingDetailSettingsTab(location.query.tab)

  return (
    <Box display="flex">
      <Box mr={1} width="100%" maxWidth={288}>
        <ShowingDetailTabSettingsSubjectList tab={tab} />
      </Box>
      <TabContentSwitch.Container<ShowingDetailSettingsTabType> value={tab}>
        <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="Availability">
          Availability
        </TabContentSwitch.Item>
        <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="ListingInfo">
          ListingInfo
        </TabContentSwitch.Item>
        <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="AppointmentTypeAndParticipants">
          AppointmentTypeAndParticipants
        </TabContentSwitch.Item>
        <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="AccessInformation">
          AccessInformation
        </TabContentSwitch.Item>
        <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="AppraisalsAndInspections">
          AppraisalsAndInspections
        </TabContentSwitch.Item>
        <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="Feedback">
          Feedback
        </TabContentSwitch.Item>
      </TabContentSwitch.Container>
    </Box>
  )
}

export default withRouter(ShowingDetailTabSettings)
