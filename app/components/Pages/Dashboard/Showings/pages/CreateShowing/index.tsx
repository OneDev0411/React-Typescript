import { memo, useState, useMemo } from 'react'

import { Box } from '@material-ui/core'

import { useSelector } from 'react-redux'

import { InjectedRouter, Route } from 'react-router'

import { useTitle } from 'react-use'

import PageLayout from 'components/GlobalPageLayout'
import { QuestionWizard } from 'components/QuestionWizard'

import useAsync from 'hooks/use-async'

import createShowing from 'models/showing/create-showing'

import { selectActiveTeamId } from 'selectors/team'

import { CreateShowingErrors, ShowingPropertyType } from '../../types'
import ShowingStepIntro from '../../components/ShowingStepIntro'
import ShowingStepProperty from '../../components/ShowingStepProperty'
import ShowingStepApprovalType from '../../components/ShowingStepApprovalType'
import ShowingStepInstructions from '../../components/ShowingStepInstructions'
import ShowingStepAdvanceNotice from '../../components/ShowingStepAdvanceNotice'
import ShowingStepDurationAndAvailabilities from '../../components/ShowingStepDurationAndAvailabilities'
import useShowingAvailabilitiesState from './use-showing-availabilities-state'
import ShowingStepFinalResult from '../../components/ShowingStepFinalResult'
import ShowingCloseButton from '../../components/ShowingCloseButton'

import useShowingRoles from './use-showing-roles'
import {
  goAndShowNotificationTypes,
  showingDurationOptions
} from '../../constants'
import useLoseYourWorkAlert from '../../hooks/use-lose-your-work-alert'
import { hasTimeConflicts, hasInvalidTimeRange } from '../../helpers'
import ShowingStepRolePerson from '../../components/ShowingStepRolePerson'

interface CreateShowingProps {
  router: InjectedRouter
  route: Route
}

function CreateShowing({ router, route }: CreateShowingProps) {
  useTitle('Create New Showing | Rechat')

  const teamId = useSelector(selectActiveTeamId)

  const [property, setProperty] = useState<Nullable<ShowingPropertyType>>(null)

  const [approvalType, setApprovalType] =
    useState<Nullable<IShowingApprovalType>>(null)

  const { roles, editRole, addRole, deleteRole, fillRolesWithPropertyRoles } =
    useShowingRoles()

  const [instructions, setInstructions] = useState<Nullable<string>>(null)

  const [noticePeriod, setNoticePeriod] = useState<Nullable<number>>(null)

  const [sameDayAllowed, setSameDayAllowed] = useState<boolean>(true)

  const [availabilities, setAvailabilities] = useShowingAvailabilitiesState()

  const [duration, setDuration] = useState<number>(
    showingDurationOptions[0].value
  )

  const handlePropertyChange = (property: Nullable<ShowingPropertyType>) => {
    fillRolesWithPropertyRoles(property)
    setProperty(property)
  }

  const { isLoading, data: showing, run, error, reset } = useAsync<IShowing>()

  useLoseYourWorkAlert(router, route, !showing)

  const showingValidationErrors = useMemo<Nullable<CreateShowingErrors>>(() => {
    const errors: CreateShowingErrors = {}

    if (!property) {
      errors.property = 'Please choose a property.'
    }

    if (hasTimeConflicts(availabilities)) {
      errors.availabilities = 'Selected time ranges have conflicts.'
    } else if (hasInvalidTimeRange(availabilities, duration)) {
      errors.availabilities = 'Invalid time ranges.'
    }

    const roleCache: Record<string, boolean> = {}

    roles.forEach(role => {
      if (role.role === 'SellerAgent' && !role.user) {
        errors[`role-${role.id}`] = 'Please choose a person from the menu.'

        return
      }

      if (
        !role.first_name ||
        !role.last_name ||
        !role.phone_number ||
        !role.email ||
        role.mode === 'form'
      ) {
        errors[`role-${role.id}`] =
          'Please complete the form and click on Save button.'

        return
      }

      const roleCacheKey = [
        role.role,
        role.first_name,
        role.last_name,
        role.phone_number,
        role.email
      ]
        .join('_')
        .trim()

      if (roleCache[roleCacheKey]) {
        errors[`role-${role.id}`] = 'Role information is duplicated.'
      }

      roleCache[roleCacheKey] = true
    })

    return Object.keys(errors).length ? errors : null
  }, [availabilities, property, roles, duration])

  const handleFinish = () => {
    if (
      showing ||
      isLoading ||
      error ||
      showingValidationErrors ||
      !approvalType
    ) {
      return
    }

    run(async () => {
      return createShowing({
        approval_type: approvalType,
        aired_at: new Date().toISOString(), // TODO: use the real value later
        roles: roles.map<IShowingRoleInput>(role => ({
          role: role.role,
          user: role.user ?? undefined,
          brand: role.brand || teamId,
          first_name: role.first_name,
          last_name: role.last_name,
          email: role.email,
          phone_number: role.phone_number,
          can_approve: role.can_approve,
          confirm_notification_type: role.confirm_notification_type,
          cancel_notification_type: role.cancel_notification_type,
          ...(approvalType === 'None' ? goAndShowNotificationTypes : {})
        })),
        availabilities: availabilities.map(availability => ({
          weekday: availability.weekday,
          availability: availability.availability
        })),
        notice_period: noticePeriod ?? undefined,
        same_day_allowed: sameDayAllowed,
        allow_appraisal: false,
        allow_inspection: false,
        listing: property?.type === 'listing' ? property.listing.id : undefined,
        deal: property?.type === 'deal' ? property.deal.id : undefined,
        address: property?.type === 'place' ? property.address : undefined,
        instructions: instructions ?? undefined,
        // TODO: Shayan thinks we don't need the start_date and end_date fields
        // so please remove these fields after API
        start_date: new Date().toISOString(),
        duration,
        brand: teamId
        // gallery?: IMediaGallery // TODO: use this field to pass gallery id
      })
    })
  }

  const validationError: Nullable<string> = showingValidationErrors
    ? 'Please fix the errors above to continue.'
    : null

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Create Showing">
        <ShowingCloseButton />
      </PageLayout.Header>
      <PageLayout.Main>
        <Box maxWidth={848} margin="0 auto" width="100%">
          <QuestionWizard
            useWindowScrollbar
            questionPositionOffset={80}
            onFinish={handleFinish}
            styles={{ paddingBottom: '50%' }}
          >
            <ShowingStepIntro />
            <ShowingStepProperty
              property={property}
              onPropertyChange={handlePropertyChange}
              error={showingValidationErrors?.property}
            />
            <ShowingStepApprovalType
              approvalType={approvalType}
              onApprovalTypeChange={setApprovalType}
            />
            {roles.map(role => (
              <ShowingStepRolePerson
                key={role.id}
                role={role}
                onRoleEdit={editRole}
                onRoleAdd={addRole}
                onRoleDelete={deleteRole}
                hasNotificationTypeFields={
                  approvalType === 'All' || approvalType === 'Any'
                }
                error={
                  showingValidationErrors
                    ? showingValidationErrors[`role-${role.id}`]
                    : undefined
                }
              />
            ))}
            <ShowingStepInstructions
              value={instructions}
              onChange={setInstructions}
            />
            <ShowingStepAdvanceNotice
              noticePeriod={noticePeriod}
              onNoticePeriodChange={setNoticePeriod}
              sameDayAllowed={sameDayAllowed}
              onSameDayAllowedChange={setSameDayAllowed}
            />
            <ShowingStepDurationAndAvailabilities
              duration={duration}
              onDurationChange={setDuration}
              availabilities={availabilities}
              onAvailabilitiesChange={setAvailabilities}
              error={showingValidationErrors?.availabilities}
            />
            <ShowingStepFinalResult
              isLoading={isLoading}
              showingId={showing?.id}
              error={error || validationError}
              onRetry={reset}
            />
          </QuestionWizard>
        </Box>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(CreateShowing)
