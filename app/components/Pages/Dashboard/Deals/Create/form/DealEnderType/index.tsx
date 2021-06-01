import { Box, Button } from '@material-ui/core'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'

import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'

import { RadioGroup } from 'components/RadioGroup'

interface Props {
  onChange: (value: IDealEnderType) => void
}

export function DealEnderType({ onChange }: Props) {
  const wizard = useWizardContext()
  const { step } = useSectionContext()

  const handleSkip = () => {
    if (wizard.currentStep === step) {
      wizard.next()
    }
  }

  const handleChange = (value: IDealEnderType) => {
    onChange(value)

    if (wizard.currentStep === step) {
      wizard.next()
    }
  }

  return (
    <QuestionSection>
      <QuestionTitle>
        Is another agent from your office on the other side of this deal?
      </QuestionTitle>
      <QuestionForm>
        <RadioGroup
          name="DealType"
          options={[
            {
              label: 'No',
              value: null
            },
            {
              label: 'Yes',
              value: 'OfficeDoubleEnder'
            }
          ]}
          onChange={handleChange}
        />

        <Box mt={2} textAlign="right" onClick={handleSkip}>
          <Button color="secondary" variant="outlined">
            Skip
          </Button>
        </Box>
      </QuestionForm>
    </QuestionSection>
  )
}
