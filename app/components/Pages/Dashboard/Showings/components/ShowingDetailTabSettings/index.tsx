import React, { useRef, useState } from 'react'
import { Box, Grid, Typography } from '@material-ui/core'

import { withRouter, WithRouterProps } from 'react-router'

import { useDebouncedCallback } from 'use-debounce'

import TabContentSwitch from 'components/TabContentSwitch'

import useNotify from 'hooks/use-notify'

import useAsync from 'hooks/use-async'

import updateShowing from 'models/showing/update-showing'

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
import AdvanceNoticeRadioGroup from '../ShowingAdvanceNoticeRadioGroup'
import ShowingDetailTabSettingsSaveButton from './ShowingDetailTabSettingsSaveButton'

interface ShowingDetailTabSettingsProps extends WithRouterProps {
  showing: IShowing
  setShowing: (showing: IShowing) => void
}

function ShowingDetailTabSettings({
  location,
  showing,
  setShowing
}: ShowingDetailTabSettingsProps) {
  const tab = getValidShowingDetailSettingsTab(location.query.tab)

  const notify = useNotify()
  const showingRef = useRef(showing)
  const [errors, setErrors] = useState<ShowingDetailTabSettingsErrors>(null)

  const { run, isLoading: isSaving } = useAsync()

  const handleSave = () => {
    if (errors) {
      notify({
        status: 'error',
        message: 'Please fix the validation issues'
      })

      return
    }

    run(async () => {
      await updateShowing(showing.id, {
        start_date: showing.start_date,
        end_date: showing.end_date,
        duration: showing.duration,
        aired_at: showing.aired_at,
        notice_period: showing.notice_period ?? undefined, // TODO: fix the related showing types
        same_day_allowed: showing.same_day_allowed,
        approval_type: showing.approval_type,
        feedback_template: undefined, // TODO: remove this later
        deal: showing.deal?.id,
        listing: showing.listing?.id,
        address: showing.address,
        // gallery: showing.gallery, // TODO: fix the gallery type
        availabilities: showing.availabilities.map(availability => ({
          weekday: availability.weekday,
          availability: availability.availability
        })),
        allow_appraisal: showing.allow_appraisal,
        allow_inspection: showing.allow_inspection,
        instructions: showing.instructions,
        brand: showing.brand
      })

      showingRef.current = showing

      notify({
        status: 'success',
        message: 'The showing saved successfully'
      })
    })
  }

  const handleShowingUpdate = (
    showing: IShowing,
    updateShowingRef: boolean = false
  ) => {
    setShowing(showing)

    if (updateShowingRef) {
      showingRef.current = showing
    }

    const errors: ShowingDetailTabSettingsErrors = {}

    if (showing.availabilities !== showingRef.current.availabilities) {
      if (findTimeConflicts(showing.availabilities)) {
        errors.Availability = 'The time slots has conflicts'
      } else if (hasInvalidTimeRange(showing.availabilities)) {
        errors.Availability = 'Invalid time range'
      }
    }

    setErrors(Object.keys(errors).length ? errors : null)
  }

  const handleAvailabilitiesChange = (availabilities: IShowingAvailability[]) =>
    handleShowingUpdate({
      ...showing,
      availabilities
    })

  const handleDurationChange = (duration: number) =>
    handleShowingUpdate({
      ...showing,
      duration
    })

  const handleApprovalTypeChange = (approvalType: IShowingApprovalType) =>
    handleShowingUpdate({
      ...showing,
      approval_type: approvalType
    })

  const handleRolesChange = (roles: IShowingRole[]) =>
    handleShowingUpdate(
      {
        ...showing,
        roles
      },
      true
    )

  const [handleInstructionsChange] = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) =>
      handleShowingUpdate({
        ...showing,
        instructions: event.target.value
      }),
    500
  )

  const handleAllowAppraisalChange = (allowAppraisal: YesNoAnswer) =>
    handleShowingUpdate({
      ...showing,
      allow_appraisal: allowAppraisal === 'Yes'
    })

  const handleAllowInspectionChange = (allowInspection: YesNoAnswer) =>
    handleShowingUpdate({
      ...showing,
      allow_inspection: allowInspection === 'Yes'
    })

  const handleAdvanceNoticeChange = (
    sameDayAllowed: boolean,
    noticePeriod: Nullable<number>
  ) =>
    handleShowingUpdate({
      ...showing,
      same_day_allowed: sameDayAllowed,
      notice_period: noticePeriod
    })

  const saveDisabled = showing === showingRef.current || !!errors

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
              <Grid container spacing={0}>
                <Grid item xs={12} sm={12} md={5}>
                  <Box mr={2}>
                    <ShowingDuration
                      value={showing.duration}
                      onChange={handleDurationChange}
                      marginBottom={4}
                      width="100%"
                    />
                  </Box>
                </Grid>
              </Grid>
              <ShowingAvailabilitiesTimes
                value={showing.availabilities}
                onChange={handleAvailabilitiesChange}
                error={errors?.Availability}
              >
                <ShowingDetailTabSettingsSaveButton
                  isSaving={isSaving}
                  disabled={saveDisabled}
                  onClick={handleSave}
                />
              </ShowingAvailabilitiesTimes>
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
              <ShowingDetailTabSettingsSaveButton
                isSaving={isSaving}
                disabled={saveDisabled}
                alignRight
                onClick={handleSave}
              />
            </Box>
          </TabContentSwitch.Item>
          {showing.address && (
            <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="ListingInfo">
              ListingInfo
            </TabContentSwitch.Item>
          )}
          <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="ApprovalTypeAndRoles">
            <Box maxWidth={400} mb={2}>
              <Typography variant="h6" gutterBottom>
                Appointment Type
              </Typography>
              <ShowingApprovalTypeRadioGroup
                name="approvalType"
                value={showing.approval_type}
                onChange={handleApprovalTypeChange}
              />
            </Box>
            <ShowingRoleList
              showingId={showing.id}
              value={showing.roles}
              onChange={handleRolesChange}
              hasNotificationTypeFields={showing.approval_type !== 'None'}
            >
              <ShowingDetailTabSettingsSaveButton
                isSaving={isSaving}
                disabled={saveDisabled}
                onClick={handleSave}
              />
            </ShowingRoleList>
          </TabContentSwitch.Item>
          <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="Instructions">
            <Typography variant="h6" gutterBottom>
              Are there any access information you’d like to provide?
            </Typography>
            <ShowingInstructionsTextField
              defaultValue={showing.instructions || ''}
              onChange={handleInstructionsChange}
            />
            <ShowingDetailTabSettingsSaveButton
              isSaving={isSaving}
              disabled={saveDisabled}
              alignRight
              onClick={handleSave}
            />
          </TabContentSwitch.Item>
          <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="AppraisalsAndInspections">
            <Box maxWidth={500}>
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
              <ShowingDetailTabSettingsSaveButton
                isSaving={isSaving}
                disabled={saveDisabled}
                alignRight
                onClick={handleSave}
              />
            </Box>
          </TabContentSwitch.Item>
          <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="Feedback">
            <Box maxWidth={500}>
              <Typography variant="h6" gutterBottom>
                Do you want to get feedback on this showing?
              </Typography>
              <ShowingYesNoRadioGroup
                name="has-feedback"
                // TODO: read this from showing and apply the change
                defaultValue="Yes"
                onChange={() => {}}
              />
              <ShowingDetailTabSettingsSaveButton
                isSaving={isSaving}
                disabled={saveDisabled}
                alignRight
                onClick={handleSave}
              />
            </Box>
          </TabContentSwitch.Item>
        </TabContentSwitch.Container>
      </Box>
    </Box>
  )
}

export default withRouter(ShowingDetailTabSettings)
