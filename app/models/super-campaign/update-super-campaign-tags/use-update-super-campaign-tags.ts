import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'
import { UpdateCacheActions, updateCacheComposer } from '@app/utils/react-query'

import { allList as enrollmentAllList } from '../query-keys/enrollment'
import {
  updateCacheAllList,
  updateCacheDetail,
  updateCacheMyList
} from '../query-update/campaign'

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
  'notify' | 'onMutate' | 'invalidates'
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
      invalidates: (_, { superCampaignId }) => [
        enrollmentAllList(superCampaignId)
      ],
      onMutate: async ({ superCampaignId, tags }) => ({
        cache: await updateCacheComposer(
          updateCacheDetail(queryClient, superCampaignId, {
            tags
          }),
          updateCacheAllList(queryClient, superCampaignId, {
            tags
          }),
          updateCacheMyList(queryClient, superCampaignId, { tags })
          //
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
}
