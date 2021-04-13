import { memo, useEffect } from 'react'
import { Box, Button } from '@material-ui/core'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle,
  useWizardContext
} from 'components/QuestionWizard'

import useQuestionWizardSmartNext from '../use-question-wizard-smart-next'

interface ShowingStepFinalResultProps {
  isLoading: boolean
  showingId?: UUID
}

function ShowingStepFinalResult({
  isLoading,
  showingId
}: ShowingStepFinalResultProps) {
  const wizard = useWizardContext()
  const nextStep = useQuestionWizardSmartNext()

  useEffect(() => {
    nextStep()

    wizard.setLoading(isLoading)
  }, [wizard, isLoading, nextStep])

  if (!showingId) {
    return null
  }

  return (
    <QuestionSection>
      <QuestionTitle>Congratulations! 🎉 Your showing is created</QuestionTitle>

      <QuestionForm>
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" color="secondary">
            View Showing
          </Button>
        </Box>
      </QuestionForm>
    </QuestionSection>
  )
}

export default memo(ShowingStepFinalResult)
