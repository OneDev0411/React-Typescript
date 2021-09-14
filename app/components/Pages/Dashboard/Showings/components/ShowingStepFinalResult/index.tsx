import { memo, useEffect } from 'react'

import { Box, Button } from '@material-ui/core'

import {
  QuestionSection,
  QuestionTitle,
  useWizardContext
} from 'components/QuestionWizard'

import useQuestionWizardSmartNext from '../../hooks/use-question-wizard-smart-next'
import LinkButton from '../LinkButton'
import SmartQuestionForm from '../SmartQuestionForm'

interface ShowingStepFinalResultProps {
  isLoading: boolean
  showingId?: UUID
  error: Nullable<Error> | string
  onRetry: () => void
}

function ShowingStepFinalResult({
  isLoading,
  showingId,
  error,
  onRetry
}: ShowingStepFinalResultProps) {
  const wizard = useWizardContext()
  const nextStep = useQuestionWizardSmartNext()

  useEffect(() => {
    nextStep()

    wizard.setLoading(isLoading)
  }, [wizard, isLoading, nextStep])

  if (!showingId && !error) {
    return null
  }

  return (
    <QuestionSection>
      <QuestionTitle>
        {showingId
          ? 'Congratulations! 🎉 Your showing is created'
          : 'An Error Occurred'}
      </QuestionTitle>

      <SmartQuestionForm>
        {error && <Box mb={2}>{error.toString()}</Box>}
        <Box display="flex" justifyContent="flex-end">
          {showingId ? (
            <LinkButton
              variant="contained"
              color="secondary"
              to={`/dashboard/showings/${showingId}/detail`}
            >
              View Showing
            </LinkButton>
          ) : (
            <Button variant="contained" color="primary" onClick={onRetry}>
              Retry
            </Button>
          )}
        </Box>
      </SmartQuestionForm>
    </QuestionSection>
  )
}

export default memo(ShowingStepFinalResult)
