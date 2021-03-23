import React from 'react'

import { useEffectOnce } from 'react-use'

import {
  QuestionSection,
  QuestionTitle,
  useWizardContext
} from 'components/QuestionWizard'

function ShowingStepIntro() {
  const wizard = useWizardContext()

  useEffectOnce(() => {
    const timeoutHandle = setTimeout(() => wizard.next(), 1000)

    return () => clearTimeout(timeoutHandle)
  })

  return (
    <QuestionSection>
      <QuestionTitle>Let’s get started 💪</QuestionTitle>
    </QuestionSection>
  )
}

export default ShowingStepIntro
