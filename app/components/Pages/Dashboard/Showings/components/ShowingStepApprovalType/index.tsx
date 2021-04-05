import React from 'react'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle,
  useWizardContext
} from 'components/QuestionWizard'

import { RadioGroup, RadioItem } from 'components/RadioGroup'

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
  const wizard = useWizardContext()

  const handleChange = (approvalType: IShowingApprovalType) => {
    onApprovalTypeChange(approvalType)
    wizard.next()
  }

  return (
    <QuestionSection>
      <QuestionTitle>
        How would you like to set up your appointments?
      </QuestionTitle>
      <QuestionForm>
        <RadioGroup
          defaultValue={approvalType}
          name="approvalType"
          options={approvalTypeOptions}
          onChange={handleChange}
        />
      </QuestionForm>
    </QuestionSection>
  )
}

export default ShowingStepApprovalType
