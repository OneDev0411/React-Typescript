import React, { useRef, useState } from 'react'
import { Box, Typography } from '@material-ui/core'

import { withRouter, WithRouterProps } from 'react-router'

import { useDebouncedCallback } from 'use-debounce'

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
import ShowingInstructionsTextField from '../ShowingInstructionsTextField'
import ShowingYesNoRadioGroup from '../ShowingYesNoRadioGroup'
import { YesNoAnswer } from '../ShowingStepYesNoQuestion'
import AdvanceNoticeRadioGroup from '../AdvanceNoticeRadioGroup'

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

  const [handleInstructionsChange] = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) =>
      updateShowing({
        ...showing,
        instructions: event.target.value
      }),
    500
  )

  const handleAllowAppraisalChange = (allowAppraisal: YesNoAnswer) =>
    updateShowing({
      ...showing,
      allow_appraisal: allowAppraisal === 'Yes'
    })

  const handleAllowInspectionChange = (allowInspection: YesNoAnswer) =>
    updateShowing({
      ...showing,
      allow_inspection: allowInspection === 'Yes'
    })

  const handleAdvanceNoticeChange = (
    sameDayAllowed: boolean,
    noticePeriod: Nullable<number>
  ) =>
    updateShowing({
      ...showing,
      same_day_allowed: sameDayAllowed,
      notice_period: noticePeriod
    })

  return (
    <Box display="flex">
      <Box mr={4} flexBasis="296px" flexGrow="0" flexShrink="0">
        <ShowingDetailTabSettingsSubjectList
          tab={tab}
          errors={errors}
          hasListingInfo={!!showing.address}
        />
      </Box>
      <Box flexGrow="1" flexShrink="1">
        <TabContentSwitch.Container<ShowingDetailSettingsTabType> value={tab}>
          <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="Availability">
            <Box maxWidth={580}>
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
          <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="AdvanceNotice">
            <Box maxWidth={580}>
              <Typography variant="h6" gutterBottom>
                Is there a need for advance notice?
              </Typography>
              <AdvanceNoticeRadioGroup
                noticePeriod={showing.notice_period}
                sameDayAllowed={showing.same_day_allowed}
                onChange={handleAdvanceNoticeChange}
              />
            </Box>
          </TabContentSwitch.Item>
          {showing.address && (
            <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="ListingInfo">
              ListingInfo
            </TabContentSwitch.Item>
          )}
          <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="ApprovalTypeAndRoles">
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
          </TabContentSwitch.Item>
          <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="Instructions">
            <Typography variant="h6" gutterBottom>
              Are there any access information you’d like to provide?
            </Typography>
            <ShowingInstructionsTextField
              defaultValue={showing.instructions || ''}
              onChange={handleInstructionsChange}
            />
          </TabContentSwitch.Item>
          <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="AppraisalsAndInspections">
            <Box maxWidth={500} mb={9}>
              <Box mb={9}>
                <Typography variant="h6" gutterBottom>
                  Would you like to allow appraisals?
                </Typography>
                <ShowingYesNoRadioGroup
                  name="allow-appraisals"
                  defaultValue={showing.allow_appraisal ? 'Yes' : 'No'}
                  onChange={handleAllowAppraisalChange}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                Do you want to allow inspections and walk-through?
              </Typography>
              <ShowingYesNoRadioGroup
                name="allow-inspection"
                defaultValue={showing.allow_inspection ? 'Yes' : 'No'}
                onChange={handleAllowInspectionChange}
              />
            </Box>
          </TabContentSwitch.Item>
          <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="Feedback">
            Feedback
          </TabContentSwitch.Item>
        </TabContentSwitch.Container>
      </Box>
    </Box>
  )
}

export default withRouter(ShowingDetailTabSettings)
