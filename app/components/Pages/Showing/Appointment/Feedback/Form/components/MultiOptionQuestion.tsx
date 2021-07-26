import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'
import { RadioGroup, RadioItem } from 'components/RadioGroup'
import useIsMobile from 'hooks/use-is-mobile'

import { useGoNextStep } from '../hooks'

interface Props<T extends string> {
  question: string
  options: RadioItem<T>[]
  value: Nullable<T>
  goNext?: boolean
  onChange: (value: T) => void
}

export default function ShowingAppointmentMultiOptionQuestion<
  T extends string
>({ question, options, value, goNext = false, onChange }: Props<T>) {
  const isMobile = useIsMobile()
  const goNextStep = useGoNextStep()

  return (
    <QuestionSection>
      <QuestionTitle style={isMobile ? { maxWidth: 'none' } : undefined}>
        {question}
      </QuestionTitle>
      <QuestionForm
        width={isMobile ? '100%' : undefined}
        containerProps={isMobile ? { mt: 2 } : { mt: 6 }}
      >
        <RadioGroup
          name={`multi-option-question--${question}`}
          onChange={(value: T) => {
            onChange(value)

            if (goNext) {
              goNextStep()
            }
          }}
          options={options}
          value={value}
        />
      </QuestionForm>
    </QuestionSection>
  )
}
