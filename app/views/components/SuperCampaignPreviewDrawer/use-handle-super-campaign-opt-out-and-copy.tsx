import { useContext } from 'react'

import { useUnenrollMeFromSuperCampaign } from '@app/models/super-campaign'
import ConfirmationModalContext from '@app/views/components/ConfirmationModal/context'

interface UseOptOutAndCopySuperCampaign {
  isDeleting: boolean
  handleOptOut: (superCampaignId: UUID) => void
  handleOptOutAndCopy: (superCampaignId: UUID) => void
}

interface UseOptOutAndCopySuperCampaignOptions {
  onOptOut?: () => void
  onOptOutAndCopy?: () => void
}

export function useHandleSuperCampaignOptOutAndCopy({
  onOptOut,
  onOptOutAndCopy
}: UseOptOutAndCopySuperCampaignOptions): UseOptOutAndCopySuperCampaign {
  const confirmation = useContext(ConfirmationModalContext)

  const { mutateAsync, isLoading } = useUnenrollMeFromSuperCampaign()

  const handleOptOut = (superCampaignId: UUID) => {
    confirmation.setConfirmationModal({
      message: 'Are you sure about opting out of the campaign?',
      confirmLabel: 'Yes, I am',
      onConfirm: async () => {
        await mutateAsync(superCampaignId)
        onOptOut?.()
      }
    })
  }

  const handleOptOutAndCopy = (superCampaignId: UUID) => {
    confirmation.setConfirmationModal({
      message: 'Are you sure about opting out of the campaign and copy it?',
      confirmLabel: 'Yes, I am',
      onConfirm: async () => {
        await mutateAsync(superCampaignId)
        onOptOutAndCopy?.()
      }
    })
  }

  return {
    isDeleting: isLoading,
    handleOptOut,
    handleOptOutAndCopy
  }
}
