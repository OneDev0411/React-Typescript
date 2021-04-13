import React, { memo, useState, useEffect } from 'react'

import { Box } from '@material-ui/core'

import { useSelector } from 'react-redux'

import { InjectedRouter, Route } from 'react-router'

import PageLayout from 'components/GlobalPageLayout'
import { QuestionWizard } from 'components/QuestionWizard'

import useAsync from 'hooks/use-async'

import createShowing from 'models/showing/create-showing'

import { selectActiveTeamId } from 'selectors/team'

import { ShowingPropertyType } from '../../types'
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
import ShowingStepAvailabilities from '../../components/ShowingStepAvailabilities'
import useShowingAvailabilitiesState from './use-showing-availabilities-state'
// import ShowingStepFeedbackTemplate from '../../components/ShowingStepFeedbackTemplate'
import ShowingStepFinalResult from '../../components/ShowingStepFinalResult'
import useShowingRole from './use-showing-role'
import useFillPersonStatesWithDealRoles from './use-fill-person-states-with-deal-roles'

interface CreateShowingProps {
  router: InjectedRouter
  route: Route
}

function CreateShowing({ router, route }: CreateShowingProps) {
  const teamId = useSelector(selectActiveTeamId)
  const [property, setProperty] = useState<Nullable<ShowingPropertyType>>(null)

  const [approvalType, setApprovalType] = useState<
    Nullable<IShowingApprovalType>
  >(null)

  const [
    agentPerson,
    setAgentPerson,

    agentConfirmNotificationTypes,
    setAgentConfirmNotificationTypesChange,

    agentCancelNotificationTypes,
    setAgentCancelNotificationTypesChange
  ] = useShowingRole()

  const [
    coAgentPerson,
    setCoAgentPerson,

    coAgentConfirmNotificationTypes,
    setCoAgentConfirmNotificationTypesChange,

    coAgentCancelNotificationTypes,
    setCoAgentCancelNotificationTypesChange,

    hasCoAgent,
    setHasCoAgent
  ] = useShowingRole()

  const [
    occupantPerson,
    setOccupantPerson,

    occupantConfirmNotificationTypes,
    setOccupantConfirmNotificationTypesChange,

    occupantCancelNotificationTypes,
    setOccupantCancelNotificationTypesChange,

    hasOccupant,
    setHasOccupant
  ] = useShowingRole()

  const [instructions, setInstructions] = useState<Nullable<string>>(null)

  const [allowInspection, setAllowInspection] = useState<Nullable<YesNoAnswer>>(
    null
  )

  const [allowAppraisal, setAllowAppraisal] = useState<Nullable<YesNoAnswer>>(
    null
  )

  const [advanceNotice, setAdvanceNotice] = useState<Nullable<number>>(null)

  const [availabilities, setAvailabilities] = useShowingAvailabilitiesState()

  // const [feedbackTemplate, setFeedbackTemplate] = useState<
  //   Nullable<IMarketingTemplateInstance>
  // >(null)

  useFillPersonStatesWithDealRoles(
    property,
    setAgentPerson,
    setCoAgentPerson,
    setOccupantPerson
  )

  const { isLoading, data: showing, run } = useAsync<IShowing>()

  useEffect(() => {
    router.setRouteLeaveHook(route, () => {
      if (!showing) {
        return 'By canceling you will lose your work. Continue?'
      }
    })
  }, [showing, router, route])

  const handleFinish = () => {
    if (showing || isLoading) {
      return
    }

    run(async () => {
      const roles: IShowingRoleInput[] = [
        {
          can_approve: agentConfirmNotificationTypes[0],
          role: 'SellerAgent',
          cancel_notification_type: agentCancelNotificationTypes[1],
          confirm_notification_type: agentConfirmNotificationTypes[1],
          ...agentPerson!
        }
      ]

      if (coAgentPerson) {
        roles.push({
          can_approve: coAgentConfirmNotificationTypes[0],
          role: 'CoSellerAgent',
          cancel_notification_type: coAgentCancelNotificationTypes[1],
          confirm_notification_type: coAgentConfirmNotificationTypes[1],
          ...coAgentPerson!
        })
      }

      if (occupantPerson) {
        roles.push({
          can_approve: occupantConfirmNotificationTypes[0],
          role: 'Tenant',
          cancel_notification_type: occupantCancelNotificationTypes[1],
          confirm_notification_type: occupantConfirmNotificationTypes[1],
          ...occupantPerson!
        })
      }

      return createShowing({
        approval_type: approvalType!,
        aired_at: new Date().toISOString(), // TODO: use the real value later
        duration: 900, // TODO: This field is missed in the design
        roles,
        availabilities,
        notice_period: advanceNotice!,
        allow_appraisal: allowAppraisal === 'Yes',
        allow_inspection: allowInspection === 'Yes',
        start_date: '2021-03-29T13:55:17.134Z', // TODO:: use real start date
        listing: property?.type === 'listing' ? property.listing.id : undefined,
        deal: property?.type === 'deal' ? property.deal.id : undefined,
        address: property?.type === 'place' ? property.address : undefined,
        instructions: instructions!,
        // gallery?: IMediaGallery // TODO: use this field to pass gallery id
        brand: teamId
      })
    })
  }

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Create Showing" />
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
              onPropertyChange={setProperty}
            />
            <ShowingStepApprovalType
              approvalType={approvalType}
              onApprovalTypeChange={setApprovalType}
            />

            {/* Listing Agent Steps - Start */}
            <ShowingStepRolePerson
              roleType="SellerAgent"
              personTitle="Agent"
              person={agentPerson}
              onPersonChange={setAgentPerson}
              skippable={false}
            />
            {approvalType !== 'None' && agentPerson && (
              <ShowingStepRoleConfirmNotificationTypes
                firstName={agentPerson.first_name}
                value={agentConfirmNotificationTypes}
                onChange={setAgentConfirmNotificationTypesChange}
              />
            )}
            {approvalType !== 'None' && agentPerson && (
              <ShowingStepRoleCancelNotificationTypes
                firstName={agentPerson.first_name}
                value={agentCancelNotificationTypes}
                onChange={setAgentCancelNotificationTypesChange}
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
                roleType="CoSellerAgent"
                personTitle="CoAgent"
                person={coAgentPerson}
                onPersonChange={setCoAgentPerson}
              />
            )}
            {approvalType !== 'None' &&
              hasCoAgent === 'Yes' &&
              coAgentPerson && (
                <ShowingStepRoleConfirmNotificationTypes
                  firstName={coAgentPerson.first_name}
                  value={coAgentConfirmNotificationTypes}
                  onChange={setCoAgentConfirmNotificationTypesChange}
                />
              )}
            {approvalType !== 'None' &&
              hasCoAgent === 'Yes' &&
              coAgentPerson && (
                <ShowingStepRoleCancelNotificationTypes
                  firstName={coAgentPerson.first_name}
                  value={coAgentCancelNotificationTypes}
                  onChange={setCoAgentCancelNotificationTypesChange}
                />
              )}
            {/* Listing Co-agent Steps - End */}

            {/* Listing Occupant Steps - Start */}
            <ShowingStepYesNoQuestion
              question="Is this property Occupied?"
              value={hasOccupant}
              onChange={setHasOccupant}
            />
            {hasOccupant === 'Yes' && (
              <ShowingStepRolePerson
                roleType="Tenant"
                personTitle="Occupant"
                person={occupantPerson}
                onPersonChange={setOccupantPerson}
                selectType="Contact"
              />
            )}
            {approvalType !== 'None' &&
              hasOccupant === 'Yes' &&
              occupantPerson && (
                <ShowingStepRoleConfirmNotificationTypes
                  firstName={occupantPerson.first_name}
                  value={occupantConfirmNotificationTypes}
                  onChange={setOccupantConfirmNotificationTypesChange}
                />
              )}
            {approvalType !== 'None' &&
              hasOccupant === 'Yes' &&
              occupantPerson && (
                <ShowingStepRoleCancelNotificationTypes
                  firstName={occupantPerson.first_name}
                  value={occupantCancelNotificationTypes}
                  onChange={setOccupantCancelNotificationTypesChange}
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
            {/* TODO: Need to handle not in the SameDay logic */}
            <ShowingStepAdvanceNotice
              leadTime={advanceNotice}
              onLeadTimeChange={setAdvanceNotice}
            />
            <ShowingStepAvailabilities
              value={availabilities}
              onChange={setAvailabilities}
            />
            {/* <ShowingStepFeedbackTemplate
              value={feedbackTemplate}
              onChange={setFeedbackTemplate}
            /> */}
            <ShowingStepFinalResult
              isLoading={isLoading}
              showingId={showing?.id}
            />
          </QuestionWizard>
        </Box>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(CreateShowing)
