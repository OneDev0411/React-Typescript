import { useContext } from 'react'

import { useRunActionThenNotify } from '@app/hooks/use-run-action-then-notify'
import { deleteSuperCampaign as deleteSuperCampaignModel } from '@app/models/super-campaign'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

export function useDeleteSuperCampaign(
  superCampaign: ISuperCampaign,
  onDelete: () => void
) {
  const confirmation = useContext(ConfirmationModalContext)
  const { isRunning, runActionThenNotify } = useRunActionThenNotify()

  const deleteSuperCampaign = () => {
    confirmation.setConfirmationModal({
      message: `Are you sure about deleting "${
        superCampaign.subject || 'Untitled Campaign'
      }"?`,
      description:
        'Please note: This campaign will also be deleted for all other participant agents.',
      confirmLabel: 'Yes, I am',
      onConfirm: async () => {
        runActionThenNotify(
          async () => {
            await deleteSuperCampaignModel(superCampaign.id)
            onDelete()
          },
          'The campaign was deleted',
          'Something went wrong while deleting the campaign. Please try again.'
        )
      }
    })
  }

  return {
    isDeleting: isRunning,
    deleteSuperCampaign
  }
}
