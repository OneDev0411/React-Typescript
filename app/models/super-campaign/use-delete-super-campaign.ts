import { useContext } from 'react'

import { UseMutationResult } from 'react-query'

import { useMutation, UseMutationOptions } from '@app/hooks/query'
import ConfirmationModalContext from '@app/views/components/ConfirmationModal/context'

import { deleteSuperCampaign } from './delete-super-campaign'
import { getAll, getOne } from './query-keys/campaign'

export type UseDeleteSuperCampaign = UseMutationResult<void>

export type UseDeleteSuperCampaignOptions = Omit<
  UseMutationOptions<void>,
  'notify' | 'invalidates'
>

export function useDeleteSuperCampaign(
  superCampaign: Pick<ISuperCampaign, 'id' | 'subject'>,
  options?: UseDeleteSuperCampaignOptions
): UseDeleteSuperCampaign {
  const confirmation = useContext(ConfirmationModalContext)
  const { mutate, ...other } = useMutation(
    async () => deleteSuperCampaign(superCampaign.id),
    {
      notify: {
        onSuccess: 'The campaign was deleted',
        onError:
          'Something went wrong while deleting the campaign. Please try again.'
      },
      invalidates: [getAll(), getOne(superCampaign.id)], // TODO: use optimistic update if possible
      ...options
    }
  )

  return {
    mutate: () => {
      confirmation.setConfirmationModal({
        message: `Are you sure about deleting "${
          superCampaign.subject || 'Untitled Campaign'
        }"?`,
        description:
          'Please note: This campaign will also be deleted for all other participant agents.',
        confirmLabel: 'Yes, I am',
        onConfirm: () => mutate()
      })
    },
    ...other
  }
}
