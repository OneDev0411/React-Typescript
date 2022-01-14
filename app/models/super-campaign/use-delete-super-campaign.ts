import { useContext } from 'react'

import { UseMutationResult } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'
import ConfirmationModalContext from '@app/views/components/ConfirmationModal/context'

import { deleteSuperCampaign } from './delete-super-campaign'
import { getAll, getOne } from './query-keys/campaign'

export type UseDeleteSuperCampaign = Omit<
  UseMutationResult<
    void,
    ResponseError,
    Pick<ISuperCampaign, 'id' | 'subject'>
  >,
  'mutateAsync'
>

export type UseDeleteSuperCampaignOptions = Omit<
  UseMutationOptions<
    void,
    ResponseError,
    Pick<ISuperCampaign, 'id' | 'subject'>
  >,
  'notify' | 'invalidates'
>

export function useDeleteSuperCampaign(
  options?: UseDeleteSuperCampaignOptions
): UseDeleteSuperCampaign {
  const confirmation = useContext(ConfirmationModalContext)
  const mutation = useMutation(
    async superCampaign => deleteSuperCampaign(superCampaign.id),
    {
      ...options,
      notify: {
        onSuccess: 'The campaign was deleted',
        onError:
          'Something went wrong while deleting the campaign. Please try again.'
      },
      invalidates: (_, superCampaign) => [getAll(), getOne(superCampaign.id)] // TODO: use optimistic update if possible
    }
  )

  return {
    ...mutation,
    mutate: superCampaign => {
      confirmation.setConfirmationModal({
        message: `Are you sure about deleting "${
          superCampaign.subject || 'Untitled Campaign'
        }"?`,
        description:
          'Please note: This campaign will also be deleted for all other participant agents.',
        confirmLabel: 'Yes, I am',
        onConfirm: () => mutation.mutate(superCampaign)
      })
    }
  }
}
