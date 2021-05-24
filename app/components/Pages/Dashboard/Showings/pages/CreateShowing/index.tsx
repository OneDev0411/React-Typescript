import { memo, useState, useMemo } from 'react'

import { Box } from '@material-ui/core'

import { useSelector } from 'react-redux'

import { InjectedRouter, Route } from 'react-router'

import PageLayout from 'components/GlobalPageLayout'
import { QuestionWizard } from 'components/QuestionWizard'

import useAsync from 'hooks/use-async'

import createShowing from 'models/showing/create-showing'

import { selectActiveTeamId } from 'selectors/team'

import { CreateShowingErrors, ShowingPropertyType } from '../../types'
import ShowingStepIntro from '../../components/ShowingStepIntro'
import ShowingStepProperty from '../../components/ShowingStepProperty'
import ShowingStepApprovalType from '../../components/ShowingStepApprovalType'
import ShowingStepRolePerson from '../../components/ShowingStepRolePerson'
import ShowingStepRoleConfirmNotificationTypes from '../../components/ShowingStepRoleConfirmNotificationTypes'
import ShowingStepRoleCancelNotificationTypes from '../../components/ShowingStepRoleCancelNotificationTypes'
import ShowingStepYesNoQuestion, {
  YesNoAnswer
} from '../../components/ShowingStepYesNoQuestion'
import ShowingStepInstructions from '../../components/ShowingStepInstructions'
import ShowingStepAdvanceNotice from '../../components/ShowingStepAdvanceNotice'
import ShowingStepDurationAndAvailabilities from '../../components/ShowingStepDurationAndAvailabilities'
import useShowingAvailabilitiesState from './use-showing-availabilities-state'
// import ShowingStepFeedbackTemplate from '../../components/ShowingStepFeedbackTemplate'
import ShowingStepFinalResult from '../../components/ShowingStepFinalResult'
import ShowingCloseButton from '../../components/ShowingCloseButton'

import useShowingRole from './use-showing-role'
import useFillPersonRolesWithProperty from './use-fill-person-roles-with-property'
import useShowingPropertyId from './use-showing-property-id'
import { showingDurationOptions } from '../../constants'
import useLoseYourWorkAlert from '../../hooks/use-lose-your-work-alert'
import { findTimeConflicts } from '../../helpers'

export const goAndShowNotificationTypes: IShowingRoleInputNotification = {
  can_approve: true,
  confirm_notification_type: [],
  cancel_notification_type: []
}

const defaultNotificationTypesValue: [boolean, INotificationDeliveryType[]] = [
  true,
  []
]

interface CreateShowingProps {
  router: InjectedRouter
  route: Route
}

function CreateShowing({ router, route }: CreateShowingProps) {
  const teamId = useSelector(selectActiveTeamId)

  const [property, setProperty] = useState<Nullable<ShowingPropertyType>>(null)
  const propertyId = useShowingPropertyId(property)

  const [approvalType, setApprovalType] = useState<
    Nullable<IShowingApprovalType>
  >(null)

  const {
    rolePerson: agentPerson,
    setRolePerson: setAgentPerson,
    roleConfirmNotificationTypes: agentConfirmNotificationTypes,
    setRoleConfirmNotificationTypesChange: setAgentConfirmNotificationTypesChange,
    roleCancelNotificationTypes: agentCancelNotificationTypes,
    setRoleCancelNotificationTypesChange: setAgentCancelNotificationTypesChange,
    resetRoleNotification: resetAgentNotificationTypes,
    editable: agentEditable,
    setEditable: setAgentEditable
  } = useShowingRole()

  const {
    rolePerson: coAgentPerson,
    setRolePerson: setCoAgentPerson,
    roleConfirmNotificationTypes: coAgentConfirmNotificationTypes,
    setRoleConfirmNotificationTypesChange: setCoAgentConfirmNotificationTypesChange,
    roleCancelNotificationTypes: coAgentCancelNotificationTypes,
    setRoleCancelNotificationTypesChange: setCoAgentCancelNotificationTypesChange,
    hasRole: hasCoAgent,
    setHasRoleChange: setHasCoAgent,
    resetRoleNotification: resetCoAgentNotificationTypes,
    editable: coAgentEditable,
    setEditable: setCoAgentEditable
  } = useShowingRole()

  const {
    rolePerson: occupantPerson,
    setRolePerson: setOccupantPerson,
    roleConfirmNotificationTypes: occupantConfirmNotificationTypes,
    setRoleConfirmNotificationTypesChange: setOccupantConfirmNotificationTypesChange,
    roleCancelNotificationTypes: occupantCancelNotificationTypes,
    setRoleCancelNotificationTypesChange: setOccupantCancelNotificationTypesChange,
    hasRole: hasOccupant,
    setHasRoleChange: setHasOccupant,
    resetRoleNotification: resetOccupantNotificationTypes,
    editable: occupantEditable,
    setEditable: setOccupantEditable
  } = useShowingRole()

  const handleSetApproval = (value: IShowingApprovalType) => {
    setApprovalType(value)

    if (value === 'None') {
      resetAgentNotificationTypes()
      resetCoAgentNotificationTypes()
      resetOccupantNotificationTypes()
    }
  }

  const [instructions, setInstructions] = useState<Nullable<string>>(null)

  const [allowInspection, setAllowInspection] = useState<Nullable<YesNoAnswer>>(
    null
  )

  const [allowAppraisal, setAllowAppraisal] = useState<Nullable<YesNoAnswer>>(
    null
  )

  const [noticePeriod, setNoticePeriod] = useState<Nullable<number>>(null)

  const [sameDayAllowed, setSameDayAllowed] = useState<boolean>(true)

  const [availabilities, setAvailabilities] = useShowingAvailabilitiesState()

  const [duration, setDuration] = useState<number>(
    showingDurationOptions[0].value
  )

  // const [feedbackTemplate, setFeedbackTemplate] = useState<
  //   Nullable<IMarketingTemplateInstance>
  // >(null)

  const handlePropertyChange = useFillPersonRolesWithProperty(
    setProperty,
    setAgentEditable,
    setAgentPerson,
    setCoAgentEditable,
    setCoAgentPerson,
    setOccupantEditable,
    setOccupantPerson
  )

  const { isLoading, data: showing, run, error, reset } = useAsync<IShowing>()

  useLoseYourWorkAlert(router, route, !showing)

  const showingValidationErrors = useMemo<Nullable<CreateShowingErrors>>(() => {
    const errors: CreateShowingErrors = {}

    if (!property) {
      errors.property = 'You need to select a property'
    }

    if (findTimeConflicts(availabilities)) {
      errors.availabilities = 'The time slots has conflicts'
    }

    if (!agentPerson) {
      errors.agent = 'Please select an agent for the agent role'
    }

    if (!agentConfirmNotificationTypes) {
      errors.agentConfirmNotification = 'This step is required'
    }

    if (!agentCancelNotificationTypes) {
      errors.agentCancelNotification = 'This step is required'
    }

    if (hasCoAgent === 'Yes') {
      if (!coAgentPerson) {
        errors.coAgent = 'Please select an agent for the co-agent role'
      }

      if (!coAgentConfirmNotificationTypes) {
        errors.coAgentConfirmNotification = 'This step is required'
      }

      if (!coAgentCancelNotificationTypes) {
        errors.coAgentCancelNotification = 'This step is required'
      }
    }

    if (hasOccupant === 'Yes') {
      if (!occupantPerson) {
        errors.coAgent = 'Please select a contact for the occupant role'
      }

      if (!occupantConfirmNotificationTypes) {
        errors.occupantConfirmNotification = 'This step is required'
      }

      if (!occupantCancelNotificationTypes) {
        errors.occupantCancelNotification = 'This step is required'
      }
    }

    return Object.keys(errors).length ? errors : null
  }, [
    agentCancelNotificationTypes,
    agentConfirmNotificationTypes,
    agentPerson,
    availabilities,
    coAgentCancelNotificationTypes,
    coAgentConfirmNotificationTypes,
    coAgentPerson,
    hasCoAgent,
    hasOccupant,
    occupantCancelNotificationTypes,
    occupantConfirmNotificationTypes,
    occupantPerson,
    property
  ])

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
      const roles: IShowingRoleInput[] = []

      if (
        agentPerson &&
        agentConfirmNotificationTypes &&
        agentCancelNotificationTypes
      ) {
        roles.push({
          role: 'SellerAgent',
          can_approve: agentConfirmNotificationTypes[0],
          cancel_notification_type: agentCancelNotificationTypes[1],
          confirm_notification_type: agentConfirmNotificationTypes[1],
          ...(approvalType === 'None' ? goAndShowNotificationTypes : {}),
          ...agentPerson!,
          user: agentPerson?.user || undefined,
          brand: agentPerson?.brand || teamId
        })
      }

      if (
        coAgentPerson &&
        coAgentConfirmNotificationTypes &&
        coAgentCancelNotificationTypes
      ) {
        roles.push({
          role: 'CoSellerAgent',
          can_approve: coAgentConfirmNotificationTypes[0],
          cancel_notification_type: coAgentCancelNotificationTypes[1],
          confirm_notification_type: coAgentConfirmNotificationTypes[1],
          ...(approvalType === 'None' ? goAndShowNotificationTypes : {}),
          ...coAgentPerson,
          user: coAgentPerson?.user || undefined,
          brand: coAgentPerson?.brand || teamId
        })
      }

      if (
        occupantPerson &&
        occupantConfirmNotificationTypes &&
        occupantCancelNotificationTypes
      ) {
        roles.push({
          role: 'Tenant',
          can_approve: occupantConfirmNotificationTypes[0],
          cancel_notification_type: occupantCancelNotificationTypes[1],
          confirm_notification_type: occupantConfirmNotificationTypes[1],
          ...(approvalType === 'None' ? goAndShowNotificationTypes : {}),
          ...occupantPerson,
          user: occupantPerson?.user || undefined,
          brand: occupantPerson?.brand || teamId
        })
      }

      return createShowing({
        approval_type: approvalType,
        aired_at: new Date().toISOString(), // TODO: use the real value later
        roles,
        availabilities,
        notice_period: noticePeriod ?? undefined,
        same_day_allowed: sameDayAllowed,
        allow_appraisal: allowAppraisal === 'Yes',
        allow_inspection: allowInspection === 'Yes',
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
    ? 'You need to fix the validation errors to continue the process'
    : null

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Create Showing">
        <ShowingCloseButton />
      </PageLayout.Header>
      <PageLayout.Main>
        <Box maxWidth={848} margin="0 auto">
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
              onApprovalTypeChange={handleSetApproval}
            />

            {/* Listing Agent Steps - Start */}
            <ShowingStepRolePerson
              key={propertyId}
              personTitle="Agent"
              person={agentPerson}
              onPersonChange={setAgentPerson}
              skippable={false}
              editable={agentEditable}
              isPrimaryAgent
              required
              error={showingValidationErrors?.agent}
            />
            {approvalType !== 'None' && agentPerson && (
              <ShowingStepRoleConfirmNotificationTypes
                firstName={agentPerson.first_name}
                value={
                  agentConfirmNotificationTypes || defaultNotificationTypesValue
                }
                onChange={setAgentConfirmNotificationTypesChange}
                error={showingValidationErrors?.agentConfirmNotification}
              />
            )}
            {approvalType !== 'None' && agentPerson && (
              <ShowingStepRoleCancelNotificationTypes
                firstName={agentPerson.first_name}
                value={
                  agentCancelNotificationTypes || defaultNotificationTypesValue
                }
                onChange={setAgentCancelNotificationTypesChange}
                error={showingValidationErrors?.agentCancelNotification}
              />
            )}
            {/* Listing Agent Steps - End */}

            {/* Listing Co-agent Steps - Start */}
            <ShowingStepYesNoQuestion
              question="Is there a co-agent you’d like to add?"
              value={hasCoAgent}
              onChange={setHasCoAgent}
            />
            {hasCoAgent === 'Yes' && (
              <ShowingStepRolePerson
                key={propertyId}
                personTitle="CoAgent"
                person={coAgentPerson}
                onPersonChange={setCoAgentPerson}
                isPrimaryAgent={false}
                editable={coAgentEditable}
                error={showingValidationErrors?.coAgent}
              />
            )}
            {approvalType !== 'None' &&
              hasCoAgent === 'Yes' &&
              coAgentPerson && (
                <ShowingStepRoleConfirmNotificationTypes
                  firstName={coAgentPerson.first_name}
                  value={
                    coAgentConfirmNotificationTypes ||
                    defaultNotificationTypesValue
                  }
                  onChange={setCoAgentConfirmNotificationTypesChange}
                  error={showingValidationErrors?.coAgentConfirmNotification}
                />
              )}
            {approvalType !== 'None' &&
              hasCoAgent === 'Yes' &&
              coAgentPerson && (
                <ShowingStepRoleCancelNotificationTypes
                  firstName={coAgentPerson.first_name}
                  value={
                    coAgentCancelNotificationTypes ||
                    defaultNotificationTypesValue
                  }
                  onChange={setCoAgentCancelNotificationTypesChange}
                  error={showingValidationErrors?.coAgentCancelNotification}
                />
              )}
            {/* Listing Co-agent Steps - End */}

            {/* Listing Occupant Steps - Start */}
            <ShowingStepYesNoQuestion
              question="Is this property occupied?"
              value={hasOccupant}
              onChange={setHasOccupant}
            />
            {hasOccupant === 'Yes' && (
              <ShowingStepRolePerson
                key={propertyId}
                personTitle="Occupant"
                person={occupantPerson}
                onPersonChange={setOccupantPerson}
                selectType="Contact"
                editable={occupantEditable}
                error={showingValidationErrors?.occupant}
              />
            )}
            {approvalType !== 'None' &&
              hasOccupant === 'Yes' &&
              occupantPerson && (
                <ShowingStepRoleConfirmNotificationTypes
                  firstName={occupantPerson.first_name}
                  value={
                    occupantConfirmNotificationTypes ||
                    defaultNotificationTypesValue
                  }
                  onChange={setOccupantConfirmNotificationTypesChange}
                  error={showingValidationErrors?.occupantConfirmNotification}
                />
              )}
            {approvalType !== 'None' &&
              hasOccupant === 'Yes' &&
              occupantPerson && (
                <ShowingStepRoleCancelNotificationTypes
                  firstName={occupantPerson.first_name}
                  value={
                    occupantCancelNotificationTypes ||
                    defaultNotificationTypesValue
                  }
                  onChange={setOccupantCancelNotificationTypesChange}
                  error={showingValidationErrors?.occupantCancelNotification}
                />
              )}
            {/* Listing Occupant Steps - End */}

            <ShowingStepInstructions
              value={instructions}
              onChange={setInstructions}
            />
            <ShowingStepYesNoQuestion
              question="Do you want to allow inspections and walk-through?"
              value={allowInspection}
              onChange={setAllowInspection}
            />
            <ShowingStepYesNoQuestion
              question="Would you like to allow appraisals?"
              value={allowAppraisal}
              onChange={setAllowAppraisal}
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
            {/* <ShowingStepFeedbackTemplate
              value={feedbackTemplate}
              onChange={setFeedbackTemplate}
            /> */}
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
