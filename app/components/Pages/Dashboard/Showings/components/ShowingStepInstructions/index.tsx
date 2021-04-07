import React, { useState } from 'react'
import { Box, Button, TextField, makeStyles } from '@material-ui/core'

import { useDebouncedCallback } from 'use-debounce/lib'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'

import useQuestionWizardSmartNext from '../use-question-wizard-smart-next'

const useStyles = makeStyles(
  theme => ({
    root: {
      '& textarea': {
        minHeight: theme.spacing(13)
      }
    }
  }),
  { name: 'ShowingStepInstructions' }
)

interface ShowingStepInstructionsProps {
  value: Nullable<string>
  onChange: (value: Nullable<string>) => void
}

function ShowingStepInstructions({
  value,
  onChange
}: ShowingStepInstructionsProps) {
  const classes = useStyles()
  const nextStep = useQuestionWizardSmartNext()
  const [fieldValue, setFieldValue] = useState(value || '')

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
      <QuestionForm>
        <TextField
          className={classes.root}
          placeholder="Enter information you’d like to provide"
          multiline
          value={fieldValue}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
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
      </QuestionForm>
    </QuestionSection>
  )
}

export default ShowingStepInstructions
