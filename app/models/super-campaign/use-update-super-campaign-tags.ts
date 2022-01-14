import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'

import { getAll } from './query-keys/campaign'
import { updateCacheOne, UpdateCacheActions } from './query-update/campaign'
import { updateSuperCampaignTags } from './update-super-campaign-tags'

interface DataInput {
  superCampaignId: UUID
  tags: string[]
}

export type UseUpdateSuperCampaignTags = UseMutationResult<
  ISuperCampaign,
  ResponseError,
  DataInput,
  { cache: UpdateCacheActions }
>

export type UseUpdateSuperCampaignTagsOptions = Omit<
  UseMutationOptions<
    ISuperCampaign,
    ResponseError,
    DataInput,
    { cache: UpdateCacheActions }
  >,
  'notify' | 'invalidates' | 'onMutate'
>

export function useUpdateSuperCampaignTags(
  options?: UseUpdateSuperCampaignTagsOptions
): UseUpdateSuperCampaignTags {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ superCampaignId, tags }) =>
      updateSuperCampaignTags(superCampaignId, tags),
    {
      ...options,
      notify: {
        onSuccess: 'The tags were updated',
        onError: 'Something went wrong while saving the tags. Please try again.'
      },
      invalidates: [getAll()],
      onMutate: async ({ superCampaignId, tags }) => ({
        cache: await updateCacheOne(queryClient, superCampaignId, {
          tags
        })
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
}
