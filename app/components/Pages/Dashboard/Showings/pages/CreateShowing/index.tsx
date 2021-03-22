import React from 'react'

import PageLayout from 'components/GlobalPageLayout'
import { QuestionWizard } from 'components/QuestionWizard'

import ShowingStepStart from '../../components/ShowingStepStart'
import ShowingStepProperty from '../../components/ShowingStepProperty'

function CreateShowing() {
  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Create Showing" />
      <PageLayout.Main>
        <QuestionWizard>
          <ShowingStepStart />
          <ShowingStepProperty />
        </QuestionWizard>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default CreateShowing
