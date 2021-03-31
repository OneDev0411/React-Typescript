import React, { useState } from 'react'

import PageLayout from 'components/GlobalPageLayout'
import { QuestionSection, QuestionWizard } from 'components/QuestionWizard'

import ShowingStepIntro from '../../components/ShowingStepIntro'
import ShowingStepProperty from '../../components/ShowingStepProperty'
import ShowingStepApprovalType from '../../components/ShowingStepApprovalType'
import { ShowingPropertyType } from '../../types'

function CreateShowing() {
  const [property, setProperty] = useState<Nullable<ShowingPropertyType>>(null)
  const [approvalType, setApprovalType] = useState<
    Nullable<IShowingApprovalType>
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
          <QuestionSection>Sample Next Section</QuestionSection>
        </QuestionWizard>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default CreateShowing
