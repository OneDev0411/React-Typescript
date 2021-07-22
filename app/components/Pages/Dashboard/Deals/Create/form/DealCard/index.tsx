import React, { useEffect } from 'react'

import { Box, Button } from '@material-ui/core'
import { browserHistory } from 'react-router'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'
import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'
import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'

import { useCreationContext } from '../../context/use-creation-context'
import type { IDealSide } from '../../types'

interface Props {
  dealSide: IDealSide
  isCreatingDeal: boolean
}

export function DealCard({ dealSide, isCreatingDeal }: Props) {
  const { deal } = useCreationContext()
  const { step } = useSectionContext()
  const wizard = useWizardContext()

  const openDeal = () => browserHistory.push(`/dashboard/deals/${deal!.id}`)
  const createOffer = () =>
    browserHistory.push(`/dashboard/deals/${deal!.id}/offer`)

  useEffect(() => {
    if (step === wizard.currentStep) {
      wizard.next()
    }

    wizard.setLoading(isCreatingDeal)
  }, [wizard, step, isCreatingDeal])

  if (!deal) {
    return null
  }

  return (
    <QuestionSection>
      <QuestionTitle>Congratulations! 🎉 Your deal is created</QuestionTitle>

      <QuestionForm>
        <Box display="flex" justifyContent="flex-end">
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
        </Box>
      </QuestionForm>
    </QuestionSection>
  )
}
