import React from 'react'

import { useEffectOnce } from 'react-use'

import { QuestionSection, QuestionTitle } from 'components/QuestionWizard'

import useQuestionWizardSmartNext from '../use-question-wizard-smart-next'

function ShowingStepIntro() {
  const nextStep = useQuestionWizardSmartNext()

  useEffectOnce(() => {
    const timeoutHandle = setTimeout(() => nextStep(), 1000)

    return () => clearTimeout(timeoutHandle)
  })

  return (
    <QuestionSection>
      <QuestionTitle>Let’s get started 💪</QuestionTitle>
    </QuestionSection>
  )
}

export default ShowingStepIntro
