import { useContext } from 'react'

import ConfirmationModalContext from '@app/views/components/ConfirmationModal/context'

import { useUnenrollMeFromSuperCampaign } from './use-unenroll-me-from-super-campaign'

interface UseOptOutAndCopySuperCampaign {
  isDeleting: boolean
  handleOptOut: () => void
  handleOptOutAndCopy: () => void
}

export function useHandleSuperCampaignOptOutAndCopy(
  superCampaignId: UUID,
  onUnenroll: () => void,
  onOptOut?: () => void,
  onOptOutAndCopy?: () => void
): UseOptOutAndCopySuperCampaign {
  const confirmation = useContext(ConfirmationModalContext)

  const { unenrollMeFromSuperCampaign, isDeleting } =
    useUnenrollMeFromSuperCampaign(superCampaignId, onUnenroll)

  const handleOptOut = () => {
    confirmation.setConfirmationModal({
      message: 'Are you sure about opting out of the campaign?',
      confirmLabel: 'Yes, I am',
      onConfirm: async () => {
        await unenrollMeFromSuperCampaign()
        onOptOut?.()
      }
    })
  }

  const handleOptOutAndCopy = () => {
    confirmation.setConfirmationModal({
      message: 'Are you sure about opting out of the campaign and copy it?',
      confirmLabel: 'Yes, I am',
      onConfirm: async () => {
        await unenrollMeFromSuperCampaign()
        onOptOutAndCopy?.()
      }
    })
  }

  return {
    isDeleting,
    handleOptOut,
    handleOptOutAndCopy
  }
}
