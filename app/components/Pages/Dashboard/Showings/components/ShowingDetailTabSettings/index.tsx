import { useRef, useState } from 'react'
import { Box, Typography } from '@material-ui/core'

import { withRouter, WithRouterProps } from 'react-router'

import TabContentSwitch from 'components/TabContentSwitch'

import useNotify from 'hooks/use-notify'

import { getValidShowingDetailSettingsTab } from './helpers'

import ShowingDetailTabSettingsSubjectList from './ShowingDetailTabSettingsSubjectList'
import {
  ShowingDetailSettingsTabType,
  ShowingDetailTabSettingsErrors
} from './types'
import ShowingAvailabilitiesTimes from '../ShowingAvailabilitiesTimes'
import { findTimeConflicts, hasInvalidTimeRange } from '../../helpers'
import ShowingDuration from '../ShowingDuration'
import ShowingApprovalTypeRadioGroup from '../ShowingApprovalTypeRadioGroup'
import ShowingRoleList from './ShowingRoleList'

interface ShowingDetailTabSettingsProps extends WithRouterProps {
  showing: IShowing
  setShowing: (showing: IShowing) => void
}

function ShowingDetailTabSettings({
  location,
  showing,
  setShowing
}: ShowingDetailTabSettingsProps) {
  const notify = useNotify()
  const tab = getValidShowingDetailSettingsTab(location.query.tab)
  const showingRef = useRef(showing)
  const [errors, setErrors] = useState<ShowingDetailTabSettingsErrors>({})

  const updateShowing = (showing: IShowing) => {
    setShowing(showing)

    const errors: ShowingDetailTabSettingsErrors = {}

    if (showing.availabilities !== showingRef.current.availabilities) {
      if (findTimeConflicts(showing.availabilities)) {
        errors.Availability = 'The time slots has conflicts'
      } else if (hasInvalidTimeRange(showing.availabilities)) {
        errors.Availability = 'Invalid time range'
      }
    }

    setErrors(errors)

    console.log(
      'showing.roles===showingRef.current.roles',
      showing.roles === showingRef.current.roles
    )

    if (!Object.keys(errors).length) {
      // TODO: use the update API here
      console.log('send updateShowing request then update the showingRef')
      showingRef.current = showing
      notify({
        status: 'error',
        message: 'Changes detected but there is no API to call'
      })
    }
  }

  const handleAvailabilitiesChange = (availabilities: IShowingAvailability[]) =>
    updateShowing({
      ...showing,
      availabilities
    })

  const handleDurationChange = (duration: number) =>
    updateShowing({
      ...showing,
      duration
    })

  const handleApprovalTypeChange = (approvalType: IShowingApprovalType) =>
    updateShowing({
      ...showing,
      approval_type: approvalType
    })

  const handleRolesChange = (roles: IShowingRole[]) =>
    updateShowing({
      ...showing,
      roles
    })

  return (
    <Box display="flex">
      <Box mr={4} width="100%" maxWidth={296}>
        <ShowingDetailTabSettingsSubjectList
          tab={tab}
          errors={errors}
          hasListingInfo={!!showing.address}
        />
      </Box>
      <TabContentSwitch.Container<ShowingDetailSettingsTabType> value={tab}>
        <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="Availability">
          <Box flexBasis="100%" maxWidth={580}>
            <ShowingDuration
              value={showing.duration}
              onChange={handleDurationChange}
              marginBottom={4}
            />
            <ShowingAvailabilitiesTimes
              value={showing.availabilities}
              onChange={handleAvailabilitiesChange}
              error={errors.Availability}
            />
          </Box>
        </TabContentSwitch.Item>
        {showing.address && (
          <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="ListingInfo">
            ListingInfo
          </TabContentSwitch.Item>
        )}
        <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="ApprovalTypeAndRoles">
          <Box flexBasis="100%">
            <Box maxWidth={400} mb={9}>
              <Typography variant="h6" gutterBottom>
                Appointment Type
              </Typography>
              <ShowingApprovalTypeRadioGroup
                name="approvalType"
                value={showing.approval_type}
                onChange={handleApprovalTypeChange}
              />
            </Box>
            {showing.approval_type !== 'None' && (
              <ShowingRoleList
                isHipPocket={!!showing.address}
                value={showing.roles}
                onChange={handleRolesChange}
              />
            )}
          </Box>
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
