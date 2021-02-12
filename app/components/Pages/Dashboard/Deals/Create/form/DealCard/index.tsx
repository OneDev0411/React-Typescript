import React from 'react'
import { Box, Typography, Button } from '@material-ui/core'

import { goTo } from 'utils/go-to'

import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'
import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { useCreationContext } from '../../context/use-creation-context'

import type { IDealSide } from '../../types'

interface Props {
  dealSide: IDealSide
}

export function DealCard({ dealSide }: Props) {
  const { deal } = useCreationContext()
  const { step } = useSectionContext()
  const wizard = useWizardContext()

  const openDeal = () => goTo(`/dashboard/deals/${deal!.id}`)
  const createOffer = () => goTo(`/dashboard/deals/${deal!.id}/create-offer`)

  if (wizard.currentStep !== step) {
    return null
  }

  return (
    <QuestionSection>
      <QuestionTitle>Congratulation! 🎉</QuestionTitle>
      <QuestionForm>
        <Box textAlign="center" p={2}>
          <Typography variant="h5">
            Your deal has been created successfuly
          </Typography>

          <Box mt={4} display="flex" justifyContent="center">
            <Button variant="contained" color="secondary" onClick={openDeal}>
              Open Deal
            </Button>

            {dealSide === 'Both' && (
              <Box ml={2}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={createOffer}
                >
                  Create Offer
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </QuestionForm>
    </QuestionSection>
  )
}
