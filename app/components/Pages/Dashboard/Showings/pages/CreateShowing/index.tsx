import React, { useState } from 'react'

import { Box } from '@material-ui/core'

import PageLayout from 'components/GlobalPageLayout'
import { QuestionSection, QuestionWizard } from 'components/QuestionWizard'

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
import useShowingRole from './use-showing-role'

function CreateShowing() {
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

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Create Showing" />
      <PageLayout.Main>
        <Box maxWidth={848} margin="0 auto">
          <QuestionWizard>
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
              roleType="Agent"
              person={agentPerson}
              onPersonChange={setAgentPerson}
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
                roleType="CoAgent"
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
                roleType="Occupant"
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
            {/* TODO: Need to handle not in the sameday logic */}
            <ShowingStepAdvanceNotice
              leadTime={advanceNotice}
              onLeadTimeChange={setAdvanceNotice}
            />
            <ShowingStepAvailabilities
              value={availabilities}
              onChange={setAvailabilities}
            />
            <QuestionSection>Sample Next Section</QuestionSection>
          </QuestionWizard>
        </Box>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default CreateShowing
