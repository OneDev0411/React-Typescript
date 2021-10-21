import { useRef, useState, ChangeEvent, useEffect } from 'react'

import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { Location } from 'history'
import { InjectedRouter, PlainRoute } from 'react-router'
import { useDebouncedCallback } from 'use-debounce'

import TabContentSwitch from 'components/TabContentSwitch'
import useAsync from 'hooks/use-async'
import useNotify from 'hooks/use-notify'
import updateShowing from 'models/showing/update-showing'

import {
  hasTimeConflicts,
  hasInvalidTimeRange,
  sortShowingAvailabilities
} from '../../helpers'
import useLoseYourWorkAlert from '../../hooks/use-lose-your-work-alert'
import { YesNoAnswer } from '../ShowingYesNoRadioGroup'

import { getValidShowingDetailSettingsTab } from './helpers'
import ShowingDetailTabSettingsSaveButton, {
  ShowingDetailTabSettingsSaveButtonProps
} from './ShowingDetailTabSettingsSaveButton'
import ShowingDetailTabSettingsSubjectList from './ShowingDetailTabSettingsSubjectList'
import ShowingDetailTabSettingsTabAdvanceNotice from './ShowingDetailTabSettingsTabAdvanceNotice'
import ShowingDetailTabSettingsTabAppraisalsAndInspections from './ShowingDetailTabSettingsTabAppraisalsAndInspections'
import ShowingDetailTabSettingsTabApprovalTypeAndRoles from './ShowingDetailTabSettingsTabApprovalTypeAndRoles'
import ShowingDetailTabSettingsTabAvailability from './ShowingDetailTabSettingsTabAvailability'
import ShowingDetailTabSettingsTabFeedback from './ShowingDetailTabSettingsTabFeedback'
import ShowingDetailTabSettingsTabInstructions from './ShowingDetailTabSettingsTabInstructions'
import {
  ShowingDetailSettingsTabType,
  ShowingDetailTabSettingsErrors
} from './types'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      minHeight: 'calc(100vh - 161px)' // 161px because tabs height is 51px and header height is 104px
    },
    padding: { padding: theme.spacing(3, 0) },
    content: {
      overflowX: 'hidden',
      flexGrow: 1,
      flexShrink: 1
    },
    sidebar: {
      marginRight: theme.spacing(4),
      flexBasis: theme.spacing(41),
      flexGrow: 0,
      flexShrink: 0,
      backgroundColor: theme.palette.grey[50],
      paddingLeft: theme.spacing(4)
    }
  }),
  { name: 'ShowingDetailTabSettings' }
)

interface ShowingDetailTabSettingsProps {
  showing: IShowing<'showing'>
  setShowing: (showing: IShowing<'showing'>) => void
  router: InjectedRouter
  route: PlainRoute
  location: Location
}

function ShowingDetailTabSettings({
  showing,
  setShowing,
  router,
  route,
  location
}: ShowingDetailTabSettingsProps) {
  const classes = useStyles()

  const tab = getValidShowingDetailSettingsTab(location.query.tab as string)

  const notify = useNotify()
  const showingRef = useRef(showing)
  const [errors, setErrors] = useState<ShowingDetailTabSettingsErrors>(null)

  const { run, isLoading: isSaving } = useAsync()

  const handleSave = () => {
    if (errors) {
      notify({
        status: 'error',
        message: 'Please fix the errors.'
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
        instructions: showing.instructions?.trim(),
        brand: showing.brand
      })

      showingRef.current = showing

      notify({
        status: 'success',
        message: 'The Showing was saved successfully.'
      })
    })
  }

  const handleShowingUpdate = (
    showing: IShowing<'showing'>,
    updateShowingRef: boolean = false
  ) => {
    if (updateShowingRef) {
      showingRef.current = showing
    }

    setShowing(showing)

    const errors: ShowingDetailTabSettingsErrors = {}

    if (showing.availabilities !== showingRef.current.availabilities) {
      if (hasTimeConflicts(showing.availabilities)) {
        errors.Availability = 'Selected time ranges have conflicts.'
      } else if (
        hasInvalidTimeRange(showing.availabilities, showing.duration)
      ) {
        errors.Availability = 'Invalid time ranges.'
      }
    }

    if (showing.instructions && showing.instructions.trim() === '') {
      errors.Instructions = "The access information can't be blank."
    }

    setErrors(Object.keys(errors).length ? errors : null)
  }

  const handleAvailabilitiesChange = (availabilities: IShowingAvailability[]) =>
    handleShowingUpdate({
      ...showing,
      availabilities: sortShowingAvailabilities(availabilities)
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

  useLoseYourWorkAlert(
    router,
    route,
    !saveDisabled,
    'You have not saved your changes. Continue?'
  )

  const isShowingDirty = showing !== showingRef.current

  // Restore the showing state if it is dirty and the user leaves the settings
  useEffect(() => {
    return () => {
      if (isShowingDirty) {
        setShowing(showingRef.current)
      }
    }
  }, [setShowing, isShowingDirty])

  return (
    <div className={classes.root}>
      <div className={classNames(classes.padding, classes.sidebar)}>
        <ShowingDetailTabSettingsSubjectList
          tab={tab}
          errors={errors}
          hasListingInfo={!!showing.address}
        />
      </div>
      <div className={classNames(classes.padding, classes.content)}>
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

          {/* eslint-disable-next-line max-len */}
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
              error={!!errors?.Instructions}
              helperText={errors?.Instructions}
            >
              <ShowingDetailTabSettingsSaveButton
                {...saveButtonProps}
                alignRight
              />
            </ShowingDetailTabSettingsTabInstructions>
          </TabContentSwitch.Item>
          {/* eslint-disable-next-line max-len */}
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
      </div>
    </div>
  )
}

export default ShowingDetailTabSettings
