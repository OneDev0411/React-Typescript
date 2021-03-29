import React, { useState } from 'react'

import PageLayout from 'components/GlobalPageLayout'
import { QuestionSection, QuestionWizard } from 'components/QuestionWizard'

import ShowingStepIntro from '../../components/ShowingStepIntro'
import ShowingStepProperty, {
  ShowingStepPropertyProps
} from '../../components/ShowingStepProperty'

function CreateShowing() {
  const [property, setProperty] = useState<
    ShowingStepPropertyProps['property']
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
          <QuestionSection>Sample Next Section</QuestionSection>
        </QuestionWizard>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default CreateShowing
