import { useContext } from 'react'

import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'
import { UpdateCacheActions } from '@app/utils/react-query'
import ConfirmationModalContext from '@app/views/components/ConfirmationModal/context'

import { deleteSuperCampaign } from './delete-super-campaign'
import { getOne } from './query-keys/campaign'
import { deleteFromCacheAll } from './query-update/campaign'

export type UseDeleteSuperCampaign = Omit<
  UseMutationResult<
    void,
    ResponseError,
    Pick<ISuperCampaign, 'id' | 'subject'>,
    { cache: UpdateCacheActions }
  >,
  'mutateAsync'
>

export type UseDeleteSuperCampaignOptions = Omit<
  UseMutationOptions<
    void,
    ResponseError,
    Pick<ISuperCampaign, 'id' | 'subject'>,
    { cache: UpdateCacheActions }
  >,
  'notify' | 'invalidates'
>

export function useDeleteSuperCampaign(
  options?: UseDeleteSuperCampaignOptions
): UseDeleteSuperCampaign {
  const queryClient = useQueryClient()
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
      invalidates: (_, superCampaign) => [getOne(superCampaign.id)], // TODO: use optimistic update if possible
      onMutate: async superCampaign => ({
        cache: await deleteFromCacheAll(queryClient, superCampaign.id)
      }),
      onError: (error, variables, context) => {
        context?.cache.revert()
        options?.onError?.(error, variables, context)
      },
      onSettled: (data, error, variables, context) => {
        context?.cache.invalidate()
        options?.onSettled?.(data, error, variables, context)
      }
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
