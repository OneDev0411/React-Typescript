import { useContext } from 'react'

import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'
import { UpdateCacheActions, updateCacheComposer } from '@app/utils/react-query'
import ConfirmationModalContext from '@app/views/components/ConfirmationModal/context'

import { detail } from '../query-keys/campaign'
import {
  deleteFromCacheAllList,
  deleteFromCacheMyList
} from '../query-update/campaign'

import { deleteSuperCampaign } from './delete-super-campaign'

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
      invalidates: (_, superCampaign) => [detail(superCampaign.id)], // TODO: use optimistic update if possible
      onMutate: async superCampaign => ({
        cache: await updateCacheComposer(
          deleteFromCacheAllList(queryClient, superCampaign.id),
          deleteFromCacheMyList(queryClient, superCampaign.id)
        )
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
