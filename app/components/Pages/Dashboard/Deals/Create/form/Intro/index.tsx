import React from 'react'

import { useEffectOnce } from 'react-use'

import { QuestionSection, QuestionTitle } from 'components/QuestionWizard'

import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'

export function CreateDealIntro() {
  const wizard = useWizardContext()

  useEffectOnce(() => {
    setTimeout(() => wizard.next(), 1500)
  })

  return (
    <QuestionSection>
      <QuestionTitle>Congrats! 🎉 Let's get started 💪</QuestionTitle>
    </QuestionSection>
  )
}
