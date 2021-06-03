import { memo } from 'react'

import {
  QuestionSection,
  QuestionTitle,
  useSectionContext,
  useWizardContext
} from 'components/QuestionWizard'

import useQuestionWizardSmartNext from '../../hooks/use-question-wizard-smart-next'
import SmartQuestionForm from '../SmartQuestionForm'
import AdvanceNoticeRadioGroup, {
  AdvanceNoticeRadioGroupProps
} from '../AdvanceNoticeRadioGroup'

type ShowingStepAdvanceNoticeProps = Omit<
  AdvanceNoticeRadioGroupProps,
  'selectFirstLeadTimeOption' | 'onSelect'
>

function ShowingStepAdvanceNotice(props: ShowingStepAdvanceNoticeProps) {
  const nextStep = useQuestionWizardSmartNext()
  const wizard = useWizardContext()
  const { step } = useSectionContext()

  return (
    <QuestionSection>
      <QuestionTitle>Is there a need for advance notice?</QuestionTitle>
      <SmartQuestionForm>
        <AdvanceNoticeRadioGroup
          {...props}
          selectFirstLeadTimeOption={step !== wizard.currentStep}
          onSelect={nextStep}
        />
      </SmartQuestionForm>
    </QuestionSection>
  )
}

export default memo(ShowingStepAdvanceNotice)
