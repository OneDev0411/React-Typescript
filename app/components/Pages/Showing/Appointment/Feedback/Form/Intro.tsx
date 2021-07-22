import { ReactChild } from 'react'

import { useEffectOnce } from 'react-use'

import { QuestionSection, QuestionTitle } from 'components/QuestionWizard'
import useIsMobile from 'hooks/use-is-mobile'

import { useGoNextStep } from './hooks'

interface Props {
  children: ReactChild
}

export default function ShowingAppointmentFeedbackIntroStep({
  children
}: Props) {
  const isMobile = useIsMobile()
  const goNext = useGoNextStep()

  useEffectOnce(() => {
    goNext(true)
  })

  return (
    <QuestionSection>
      <QuestionTitle style={isMobile ? { maxWidth: 'none' } : undefined}>
        {children}
      </QuestionTitle>
    </QuestionSection>
  )
}
