import React, { useState } from 'react'

import { Box } from '@material-ui/core'

import PageLayout from 'components/GlobalPageLayout'
import { QuestionSection, QuestionWizard } from 'components/QuestionWizard'

import ShowingStepIntro from '../../components/ShowingStepIntro'
import ShowingStepProperty from '../../components/ShowingStepProperty'
import ShowingStepApprovalType from '../../components/ShowingStepApprovalType'
import { ShowingPropertyType, ShowingRolePerson } from '../../types'
import ShowingStepYesNoQuestion, {
  YesNoAnswer
} from '../../components/ShowingStepYesNoQuestion'
import ShowingStepRolePerson from '../../components/ShowingStepRolePerson'

function CreateShowing() {
  const [property, setProperty] = useState<Nullable<ShowingPropertyType>>(null)

  const [approvalType, setApprovalType] = useState<
    Nullable<IShowingApprovalType>
  >(null)

  const [hasListingAgent, setHasListingAgent] = useState<Nullable<YesNoAnswer>>(
    null
  )
  const [listingAgentPerson, setListingAgentPerson] = useState<
    Nullable<ShowingRolePerson>
  >(null)

  const [hasListingCoAgent, setHasListingCoAgent] = useState<
    Nullable<YesNoAnswer>
  >(null)
  const [listingCoAgentPerson, setListingCoAgentPerson] = useState<
    Nullable<ShowingRolePerson>
  >(null)

  const [hasListingOccupant, setHasListingOccupant] = useState<
    Nullable<YesNoAnswer>
  >(null)
  const [listingOccupantPerson, setListingOccupantPerson] = useState<
    Nullable<ShowingRolePerson>
  >(null)

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
              onChange={setHasListingAgent}
            />
            {hasListingAgent === 'Yes' && (
              <ShowingStepRolePerson
                roleType="Agent"
                person={listingAgentPerson}
                onPersonChange={setListingAgentPerson}
              />
            )}
            {/* Agent confirmation step */}
            {/* Agent notification step */}
            <ShowingStepYesNoQuestion
              question="Is there a co-agent you’d like to add?"
              value={hasListingCoAgent}
              onChange={setHasListingCoAgent}
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
              onChange={setHasListingOccupant}
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
