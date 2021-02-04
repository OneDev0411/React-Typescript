import React from 'react'
import { Box, Typography, Button, Dialog } from '@material-ui/core'

import { goTo } from 'utils/go-to'

import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'
import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'

import { useCreationContext } from '../../context/use-creation-context'

export function DealCard() {
  const { deal } = useCreationContext()
  const { step } = useSectionContext()
  const wizard = useWizardContext()

  const openDeal = () => goTo(`/dashboard/deals/${deal!.id}`)

  if (!deal) {
    return null
  }

  return (
    <Dialog open={wizard.currentStep === step} fullWidth maxWidth="xs">
      <Box textAlign="center" p={2}>
        <Typography variant="h6">
          Congratulation!{' '}
          <span role="img" aria-label="congrats">
            🎉
          </span>
        </Typography>

        <Typography variant="subtitle1">
          your deal has been created successfuly
        </Typography>

        <Box mt={2}>
          <Button variant="contained" color="secondary" onClick={openDeal}>
            Open Deal
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
}
