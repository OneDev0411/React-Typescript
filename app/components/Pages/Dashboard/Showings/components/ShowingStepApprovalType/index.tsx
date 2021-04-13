import React, { memo } from 'react'

import { QuestionSection, QuestionTitle } from 'components/QuestionWizard'

import { RadioGroup, RadioItem } from 'components/RadioGroup'

import useQuestionWizardSmartNext from '../use-question-wizard-smart-next'
import SmartQuestionForm from '../SmartQuestionForm'

interface ShowingStepApprovalTypeProps {
  approvalType: Nullable<IShowingApprovalType>
  onApprovalTypeChange: (approvalType: IShowingApprovalType) => void
}

const approvalTypeOptions: RadioItem<IShowingApprovalType>[] = [
  {
    label: 'Appointments required, confirm with any',
    value: 'Any'
  },
  {
    label: 'Appointments required, confirm with all',
    value: 'All'
  },
  {
    label: 'Go and Show',
    value: 'None'
  }
  // {
  //   label: 'View Instructions only',
  //   value: 'None'
  // }
]

function ShowingStepApprovalType({
  approvalType,
  onApprovalTypeChange
}: ShowingStepApprovalTypeProps) {
  const nextStep = useQuestionWizardSmartNext()

  const handleChange = (approvalType: IShowingApprovalType) => {
    onApprovalTypeChange(approvalType)
    nextStep()
  }

  return (
    <QuestionSection>
      <QuestionTitle>
        How would you like to set up your appointments?
      </QuestionTitle>
      <SmartQuestionForm>
        <RadioGroup
          defaultValue={approvalType}
          name="approvalType"
          options={approvalTypeOptions}
          onChange={handleChange}
        />
      </SmartQuestionForm>
    </QuestionSection>
  )
}

export default memo(ShowingStepApprovalType)
