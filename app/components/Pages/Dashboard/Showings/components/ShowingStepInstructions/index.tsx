import React, { memo, useState } from 'react'

import { Box, Button } from '@material-ui/core'
import { useDebouncedCallback } from 'use-debounce/lib'

import { QuestionSection, QuestionTitle } from 'components/QuestionWizard'

import useIsQuestionWizardCurrentOrLastVisitedStep from '../../hooks/use-is-question-wizard-current-or-last-visited-step'
import useQuestionWizardSmartNext from '../../hooks/use-question-wizard-smart-next'
import ShowingInstructionsTextField from '../ShowingInstructionsTextField'
import SmartQuestionForm from '../SmartQuestionForm'

interface ShowingStepInstructionsProps {
  value: Nullable<string>
  onChange: (value: Nullable<string>) => void
}

function ShowingStepInstructions({
  value,
  onChange
}: ShowingStepInstructionsProps) {
  const nextStep = useQuestionWizardSmartNext()
  const [fieldValue, setFieldValue] = useState(value || '')
  const isCurrentStep = useIsQuestionWizardCurrentOrLastVisitedStep()

  const [handleDebouncedChange] = useDebouncedCallback((newValue: string) => {
    onChange(newValue.trim())
  }, 400)

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFieldValue(event.target.value)
    handleDebouncedChange(event.target.value)
  }

  const handleContinue = () => {
    onChange(fieldValue.trim())
    nextStep()
  }

  const handleSkip = () => {
    setFieldValue('')
    onChange(null)
    nextStep()
  }

  return (
    <QuestionSection>
      <QuestionTitle>
        Are there any access information you’d like to provide?
      </QuestionTitle>
      <SmartQuestionForm>
        <ShowingInstructionsTextField
          value={fieldValue || ''}
          onChange={handleChange}
        />
        {isCurrentStep && (
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Box mr={1}>
              <Button variant="outlined" size="small" onClick={handleSkip}>
                Skip
              </Button>
            </Box>
            <Button
              type="button"
              size="small"
              variant="contained"
              color="primary"
              disabled={!fieldValue}
              onClick={handleContinue}
            >
              Continue
            </Button>
          </Box>
        )}
      </SmartQuestionForm>
    </QuestionSection>
  )
}

export default memo(ShowingStepInstructions)
