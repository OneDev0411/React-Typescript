import { memo } from 'react'

import { QuestionSection, QuestionTitle } from 'components/QuestionWizard'

import useQuestionWizardSmartNext from '../../hooks/use-question-wizard-smart-next'
import ShowingApprovalTypeRadioGroup from '../ShowingApprovalTypeRadioGroup'
import SmartQuestionForm from '../SmartQuestionForm'

interface ShowingStepApprovalTypeProps {
  approvalType: Nullable<IShowingApprovalType>
  onApprovalTypeChange: (approvalType: IShowingApprovalType) => void
}

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
        <ShowingApprovalTypeRadioGroup
          defaultValue={approvalType}
          name="approvalType"
          onChange={handleChange}
        />
      </SmartQuestionForm>
    </QuestionSection>
  )
}

export default memo(ShowingStepApprovalType)
