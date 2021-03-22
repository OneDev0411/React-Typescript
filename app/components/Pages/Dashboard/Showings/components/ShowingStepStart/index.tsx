import React from 'react'

import { useEffectOnce } from 'react-use'

import {
  QuestionSection,
  QuestionTitle,
  useWizardContext
} from 'components/QuestionWizard'

function ShowingStepStart() {
  const wizard = useWizardContext()

  useEffectOnce(() => {
    const timeoutHandle = setTimeout(() => wizard.next(), 1000)

    return () => clearTimeout(timeoutHandle)
  })

  return (
    <QuestionSection>
      <QuestionTitle>
        Let’s get started{' '}
        <span role="img" aria-label="Let’s get started">
          💪
        </span>
      </QuestionTitle>
    </QuestionSection>
  )
}

export default ShowingStepStart
