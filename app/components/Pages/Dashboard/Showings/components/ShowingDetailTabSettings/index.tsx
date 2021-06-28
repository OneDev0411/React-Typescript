import { useRef, useState, ChangeEvent } from 'react'
import { Box, makeStyles } from '@material-ui/core'

import { withRouter, WithRouterProps } from 'react-router'

import { useDebouncedCallback } from 'use-debounce'

import TabContentSwitch from 'components/TabContentSwitch'

import useNotify from 'hooks/use-notify'
import useAsync from 'hooks/use-async'

import updateShowing from 'models/showing/update-showing'

import { hasTimeConflicts, hasInvalidTimeRange } from '../../helpers'

import { getValidShowingDetailSettingsTab } from './helpers'
import ShowingDetailTabSettingsSubjectList from './ShowingDetailTabSettingsSubjectList'
import {
  ShowingDetailSettingsTabType,
  ShowingDetailTabSettingsErrors
} from './types'
import { YesNoAnswer } from '../ShowingYesNoRadioGroup'
import ShowingDetailTabSettingsSaveButton, {
  ShowingDetailTabSettingsSaveButtonProps
} from './ShowingDetailTabSettingsSaveButton'
import ShowingDetailTabSettingsTabAvailability from './ShowingDetailTabSettingsTabAvailability'
import ShowingDetailTabSettingsTabAdvanceNotice from './ShowingDetailTabSettingsTabAdvanceNotice'
import ShowingDetailTabSettingsTabApprovalTypeAndRoles from './ShowingDetailTabSettingsTabApprovalTypeAndRoles'
import ShowingDetailTabSettingsTabInstructions from './ShowingDetailTabSettingsTabInstructions'
import ShowingDetailTabSettingsTabAppraisalsAndInspections from './ShowingDetailTabSettingsTabAppraisalsAndInspections'
import ShowingDetailTabSettingsTabFeedback from './ShowingDetailTabSettingsTabFeedback'

const useStyles = makeStyles(
  {
    content: { overflowX: 'hidden' }
  },
  { name: 'ShowingDetailTabSettings' }
)

interface ShowingDetailTabSettingsProps extends WithRouterProps {
  showing: IShowing
  setShowing: (showing: IShowing) => void
}

function ShowingDetailTabSettings({
  location,
  showing,
  setShowing
}: ShowingDetailTabSettingsProps) {
  const classes = useStyles()

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
        notice_period: showing.notice_period ?? undefined,
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
      if (hasTimeConflicts(showing.availabilities)) {
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
    (event: ChangeEvent<HTMLTextAreaElement>) =>
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

  const saveButtonProps: ShowingDetailTabSettingsSaveButtonProps = {
    isSaving,
    disabled: saveDisabled,
    onClick: handleSave
  }

  return (
    <Box display="flex">
      <Box mr={4} flexBasis="296px" flexGrow="0" flexShrink="0">
        <ShowingDetailTabSettingsSubjectList
          tab={tab}
          errors={errors}
          hasListingInfo={!!showing.address}
        />
      </Box>
      <Box flexGrow="1" flexShrink="1" className={classes.content}>
        <TabContentSwitch.Container<ShowingDetailSettingsTabType> value={tab}>
          <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="Availability">
            <ShowingDetailTabSettingsTabAvailability
              duration={showing.duration}
              onDurationChange={handleDurationChange}
              availabilities={showing.availabilities}
              onAvailabilitiesChange={handleAvailabilitiesChange}
              availabilitiesError={errors?.Availability}
            >
              <ShowingDetailTabSettingsSaveButton {...saveButtonProps} />
            </ShowingDetailTabSettingsTabAvailability>
          </TabContentSwitch.Item>
          <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="AdvanceNotice">
            <ShowingDetailTabSettingsTabAdvanceNotice
              noticePeriod={showing.notice_period}
              sameDayAllowed={showing.same_day_allowed}
              onChange={handleAdvanceNoticeChange}
            >
              <ShowingDetailTabSettingsSaveButton
                {...saveButtonProps}
                alignRight
              />
            </ShowingDetailTabSettingsTabAdvanceNotice>
          </TabContentSwitch.Item>
          {showing.address && (
            <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="ListingInfo">
              ListingInfo {/* TODO: Implement this step */}
            </TabContentSwitch.Item>
          )}
          <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="ApprovalTypeAndRoles">
            <ShowingDetailTabSettingsTabApprovalTypeAndRoles
              approvalType={showing.approval_type}
              onApprovalTypeChange={handleApprovalTypeChange}
              showingId={showing.id}
              roles={showing.roles}
              onRolesChange={handleRolesChange}
              hasNotificationTypeFields={showing.approval_type !== 'None'}
            >
              <ShowingDetailTabSettingsSaveButton {...saveButtonProps} />
            </ShowingDetailTabSettingsTabApprovalTypeAndRoles>
          </TabContentSwitch.Item>
          <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="Instructions">
            <ShowingDetailTabSettingsTabInstructions
              defaultValue={showing.instructions || ''}
              onChange={handleInstructionsChange}
            >
              <ShowingDetailTabSettingsSaveButton
                {...saveButtonProps}
                alignRight
              />
            </ShowingDetailTabSettingsTabInstructions>
          </TabContentSwitch.Item>
          <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="AppraisalsAndInspections">
            <ShowingDetailTabSettingsTabAppraisalsAndInspections
              allowAppraisalDefaultValue={
                showing.allow_appraisal ? 'Yes' : 'No'
              }
              onAllowAppraisalChange={handleAllowAppraisalChange}
              allowInspectionDefaultValue={
                showing.allow_inspection ? 'Yes' : 'No'
              }
              onAllowInspectionChange={handleAllowInspectionChange}
            >
              <ShowingDetailTabSettingsSaveButton
                {...saveButtonProps}
                alignRight
              />
            </ShowingDetailTabSettingsTabAppraisalsAndInspections>
          </TabContentSwitch.Item>
          <TabContentSwitch.Item<ShowingDetailSettingsTabType> value="Feedback">
            <ShowingDetailTabSettingsTabFeedback>
              <ShowingDetailTabSettingsSaveButton
                {...saveButtonProps}
                alignRight
              />
            </ShowingDetailTabSettingsTabFeedback>
          </TabContentSwitch.Item>
        </TabContentSwitch.Container>
      </Box>
    </Box>
  )
}

export default withRouter(ShowingDetailTabSettings)
