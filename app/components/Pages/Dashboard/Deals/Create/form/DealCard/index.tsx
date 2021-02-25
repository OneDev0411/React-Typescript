import React from 'react'
import { Box, Button } from '@material-ui/core'

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
  const createOffer = () => goTo(`/dashboard/deals/${deal!.id}/offer`)

  if (wizard.currentStep !== step || !deal) {
    return null
  }

  return (
    <QuestionSection>
      <QuestionTitle>
        <div>Congratulation! 🎉</div>I am done create the deal for you
      </QuestionTitle>

      <QuestionForm>
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" color="secondary" onClick={openDeal}>
            View Deal
          </Button>

          {dealSide == 'Both' && (
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
      </QuestionForm>
    </QuestionSection>
  )
}
