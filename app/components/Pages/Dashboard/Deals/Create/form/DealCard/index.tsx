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
  isCreatingDeal: boolean
  onCreateDeal: () => void
}

export function DealCard({ dealSide, isCreatingDeal, onCreateDeal }: Props) {
  const { deal } = useCreationContext()
  const { step } = useSectionContext()
  const wizard = useWizardContext()

  const openDeal = () => goTo(`/dashboard/deals/${deal!.id}`)
  const createOffer = () => goTo(`/dashboard/deals/${deal!.id}/offer`)

  if (wizard.currentStep !== step) {
    return null
  }

  return (
    <QuestionSection>
      <QuestionTitle>
        {deal ? (
          <div>
            <div>Congratulation! 🎉</div>I am done creating the deal for you
          </div>
        ) : (
          <div>Everything is in place 🚀</div>
        )}
      </QuestionTitle>

      <QuestionForm>
        <Box display="flex" justifyContent="flex-end">
          {deal ? (
            <>
              {dealSide == 'Both' && (
                <Box mr={2}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={createOffer}
                  >
                    Create Offer
                  </Button>
                </Box>
              )}

              <Button variant="contained" color="secondary" onClick={openDeal}>
                View Deal
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              disabled={isCreatingDeal}
              onClick={onCreateDeal}
            >
              {isCreatingDeal ? 'Creating Deal...' : 'Create Deal'}
            </Button>
          )}
        </Box>
      </QuestionForm>
    </QuestionSection>
  )
}
