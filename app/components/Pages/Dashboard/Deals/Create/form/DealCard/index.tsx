import React from 'react'
import { Box, Typography, Button, Dialog } from '@material-ui/core'

import { goTo } from 'utils/go-to'

import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'
import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'

import { useCreationContext } from '../../context/use-creation-context'

import type { IDealType } from '../../types'

interface Props {
  dealType: IDealType
}

export function DealCard({ dealType }: Props) {
  const { deal } = useCreationContext()
  const { step } = useSectionContext()
  const wizard = useWizardContext()

  const openDeal = () => goTo(`/dashboard/deals/${deal!.id}`)
  const createOffer = () => goTo(`/dashboard/deals/${deal!.id}/create-offer`)

  if (!deal) {
    return null
  }

  return (
    <Dialog open={wizard.currentStep === step} fullWidth maxWidth="xs">
      <Box textAlign="center" p={2}>
        <Typography variant="h5">
          Congratulation!{' '}
          <span role="img" aria-label="congrats">
            🎉
          </span>
        </Typography>

        <Box my={1}>
          <Typography variant="subtitle1">
            Your deal has been created successfuly
          </Typography>
        </Box>

        <Box mt={4} display="flex" justifyContent="center">
          <Box mr={2}>
            <Button variant="contained" color="secondary" onClick={openDeal}>
              Open Deal
            </Button>
          </Box>

          {dealType === 'Both' && (
            <Button variant="outlined" color="secondary" onClick={createOffer}>
              Create Offer
            </Button>
          )}
        </Box>
      </Box>
    </Dialog>
  )
}
