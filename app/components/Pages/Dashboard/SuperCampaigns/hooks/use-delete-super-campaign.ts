import { useContext } from 'react'

import useSafeState from '@app/hooks/use-safe-state'
import deleteSuperCampaignModel from '@app/models/super-campaign/delete-super-campaign'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

export function useDeleteSuperCampaign(
  superCampaign: ISuperCampaign,
  onDelete: () => void
) {
  const confirmation = useContext(ConfirmationModalContext)
  const [isDeleting, setIsDeleting] = useSafeState(false)

  const deleteSuperCampaign = () => {
    confirmation.setConfirmationModal({
      message: `Are you sure about deleting "${
        superCampaign.subject || 'Untitled Campaign'
      }"?`,
      confirmLabel: 'Yes, I am',
      onConfirm: async () => {
        setIsDeleting(true)
        await deleteSuperCampaignModel(superCampaign.id)
        setIsDeleting(false)
        onDelete()
      }
    })
  }

  return {
    isDeleting,
    deleteSuperCampaign
  }
}
