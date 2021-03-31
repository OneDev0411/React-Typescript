import React, { useState } from 'react'

import PageLayout from 'components/GlobalPageLayout'
import { QuestionSection, QuestionWizard } from 'components/QuestionWizard'

import ShowingStepIntro from '../../components/ShowingStepIntro'
import ShowingStepProperty from '../../components/ShowingStepProperty'
import ShowingStepApprovalType from '../../components/ShowingStepApprovalType'
import { ShowingPropertyType } from '../../types'
import ShowingStepYesNoQuestion, {
  YesNoAnswer
} from '../../components/ShowingStepYesNoQuestion'

function CreateShowing() {
  const [property, setProperty] = useState<Nullable<ShowingPropertyType>>(null)
  const [approvalType, setApprovalType] = useState<
    Nullable<IShowingApprovalType>
  >(null)
  const [isListingAgentAccompanied, setIsListingAgentAccompanied] = useState<
    Nullable<YesNoAnswer>
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
            value={isListingAgentAccompanied}
            onChange={setIsListingAgentAccompanied}
          />
          <QuestionSection>Sample Next Section</QuestionSection>
        </QuestionWizard>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default CreateShowing
