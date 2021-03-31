import React, { useState } from 'react'

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

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Create Showing" />
      <PageLayout.Main>
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
          <ShowingStepRolePerson
            hidden={!hasListingAgent || hasListingAgent === 'No'}
            roleType="Agent"
            person={listingAgentPerson}
            onPersonChange={setListingAgentPerson}
          />
          <QuestionSection>Sample Next Section</QuestionSection>
        </QuestionWizard>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default CreateShowing
