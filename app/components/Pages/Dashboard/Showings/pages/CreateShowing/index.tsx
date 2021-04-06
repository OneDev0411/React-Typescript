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
import ShowingStepYesNoQuestion from '../../components/ShowingStepYesNoQuestion'
import useShowingRole from './use-showing-role'

function CreateShowing() {
  const [property, setProperty] = useState<Nullable<ShowingPropertyType>>(null)

  const [approvalType, setApprovalType] = useState<
    Nullable<IShowingApprovalType>
  >(null)

  const [
    hasAgent,
    setHasAgent,

    agentPerson,
    setAgentPerson,

    agentConfirmNotificationTypes,
    setAgentConfirmNotificationTypesChange,

    agentCancelNotificationTypes,
    setAgentCancelNotificationTypesChange
  ] = useShowingRole()

  const [
    hasCoAgent,
    setHasCoAgent,

    coAgentPerson,
    setCoAgentPerson,

    coAgentConfirmNotificationTypes,
    setCoAgentConfirmNotificationTypesChange,

    coAgentCancelNotificationTypes,
    setCoAgentCancelNotificationTypesChange
  ] = useShowingRole()

  const [
    hasOccupant,
    setHasOccupant,

    occupantPerson,
    setOccupantPerson,

    occupantConfirmNotificationTypes,
    setOccupantConfirmNotificationTypesChange,

    occupantCancelNotificationTypes,
    setOccupantCancelNotificationTypesChange
  ] = useShowingRole()

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
            <ShowingStepYesNoQuestion
              question="Is this a listing agent accompanied showing?"
              value={hasAgent}
              onChange={setHasAgent}
            />
            {hasAgent === 'Yes' && (
              <ShowingStepRolePerson
                roleType="Agent"
                person={agentPerson}
                onPersonChange={setAgentPerson}
              />
            )}
            {approvalType !== 'None' && hasAgent === 'Yes' && agentPerson && (
              <ShowingStepRoleConfirmNotificationTypes
                firstName={agentPerson.first_name}
                value={agentConfirmNotificationTypes}
                onChange={setAgentConfirmNotificationTypesChange}
              />
            )}
            {approvalType !== 'None' && hasAgent === 'Yes' && agentPerson && (
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

            <QuestionSection>Sample Next Section</QuestionSection>
          </QuestionWizard>
        </Box>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default CreateShowing
