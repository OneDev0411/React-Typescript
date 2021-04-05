import React, { useState } from 'react'

import { Box } from '@material-ui/core'

import PageLayout from 'components/GlobalPageLayout'
import { QuestionSection, QuestionWizard } from 'components/QuestionWizard'

import ShowingStepIntro from '../../components/ShowingStepIntro'
import ShowingStepProperty from '../../components/ShowingStepProperty'
import ShowingStepApprovalType from '../../components/ShowingStepApprovalType'
import { ShowingPropertyType } from '../../types'
import ShowingStepYesNoQuestion, {
  YesNoAnswer
} from '../../components/ShowingStepYesNoQuestion'
import ShowingStepRolePerson from '../../components/ShowingStepRolePerson'
import ShowingStepRoleNotificationTypes from '../../components/ShowingStepRoleNotificationTypes'
import useListingPersonOnChange from './use-listing-person-on-change'
import useListingConfirmNotificationTypes from './use-listing-confirm-notification-types'

const DEFAULT_NOTIFICATION_VALUE: IShowingRoleNotification = {
  can_approve: false,
  confirm_notification_type: [],
  cancel_notification_type: []
}

function CreateShowing() {
  const [property, setProperty] = useState<Nullable<ShowingPropertyType>>(null)

  const [approvalType, setApprovalType] = useState<
    Nullable<IShowingApprovalType>
  >(null)

  const [hasListingAgent, setHasListingAgent] = useState<Nullable<YesNoAnswer>>(
    null
  )
  const [listingAgentPerson, setListingAgentPerson] = useState<
    Nullable<IShowingRolePerson>
  >(null)
  const [
    listingAgentNotification,
    setListingAgentNotification
  ] = useState<IShowingRoleNotification>(DEFAULT_NOTIFICATION_VALUE)

  const [hasListingCoAgent, setHasListingCoAgent] = useState<
    Nullable<YesNoAnswer>
  >(null)
  const [listingCoAgentPerson, setListingCoAgentPerson] = useState<
    Nullable<IShowingRolePerson>
  >(null)
  // const [
  //   listingCoAgentNotification,
  //   setListingCoAgentNotification
  // ] = useState<IShowingRoleNotification>(DEFAULT_NOTIFICATION_VALUE)

  const [hasListingOccupant, setHasListingOccupant] = useState<
    Nullable<YesNoAnswer>
  >(null)
  const [listingOccupantPerson, setListingOccupantPerson] = useState<
    Nullable<IShowingRolePerson>
  >(null)
  // const [
  //   listingOccupantNotification,
  //   setListingOccupantNotification
  // ] = useState<IShowingRoleNotification>(DEFAULT_NOTIFICATION_VALUE)

  const handleHasListingAgentChange = useListingPersonOnChange(
    setHasListingAgent,
    setListingAgentPerson
  )

  const handleHasListingCoAgentChange = useListingPersonOnChange(
    setHasListingCoAgent,
    setListingCoAgentPerson
  )

  const handleHasListingOccupantChange = useListingPersonOnChange(
    setHasListingOccupant,
    setListingOccupantPerson
  )

  const [
    listingAgentNotificationValue,
    handleListingAgentNotificationChange
  ] = useListingConfirmNotificationTypes(
    listingAgentNotification,
    setListingAgentNotification
  )

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
            <ShowingStepYesNoQuestion
              question="Is this a listing agent accompanied showing?"
              value={hasListingAgent}
              onChange={handleHasListingAgentChange}
            />
            {hasListingAgent === 'Yes' && (
              <ShowingStepRolePerson
                roleType="Agent"
                person={listingAgentPerson}
                onPersonChange={setListingAgentPerson}
              />
            )}
            {hasListingAgent === 'Yes' && (
              <ShowingStepRoleNotificationTypes
                question="Does Ali need to confirm appointments?"
                hasNoAnywaysOption
                yesOptionLabel="Yes, Confirm by:"
                value={listingAgentNotificationValue}
                onChange={handleListingAgentNotificationChange}
              />
            )}
            {/* Agent notification step */}
            <ShowingStepYesNoQuestion
              question="Is there a co-agent you’d like to add?"
              value={hasListingCoAgent}
              onChange={handleHasListingCoAgentChange}
            />
            {hasListingCoAgent === 'Yes' && (
              <ShowingStepRolePerson
                roleType="CoAgent"
                person={listingCoAgentPerson}
                onPersonChange={setListingCoAgentPerson}
              />
            )}
            {/* CoAgent confirmation step */}
            {/* CoAgent notification step */}
            <ShowingStepYesNoQuestion
              question="Is this property Occupied?"
              value={hasListingOccupant}
              onChange={handleHasListingOccupantChange}
            />
            {hasListingOccupant === 'Yes' && (
              <ShowingStepRolePerson
                roleType="Occupant"
                person={listingOccupantPerson}
                onPersonChange={setListingOccupantPerson}
                selectType="Contact"
              />
            )}
            {/* Occupant confirmation step */}
            {/* Occupant notification step */}
            <QuestionSection>Sample Next Section</QuestionSection>
          </QuestionWizard>
        </Box>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default CreateShowing
