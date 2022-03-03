import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'
import { UpdateCacheActions, updateCacheComposer } from '@app/utils/react-query'

import {
  updateCacheAllList,
  updateCacheMyList
} from '../query-update/enrollment'

import { enrollUserInSuperCampaign } from './enroll-user-in-super-campaign'

interface DataInput {
  superCampaignId: UUID
  enrollment: ISuperCampaignEnrollmentInput
}

type UseEnrollUserInSuperCampaign = UseMutationResult<
  ISuperCampaignEnrollment<'user' | 'brand'>[],
  ResponseError,
  DataInput,
  { cache: UpdateCacheActions }
>

type UseEnrollUserInSuperCampaignOptions = Omit<
  UseMutationOptions<
    ISuperCampaignEnrollment<'user' | 'brand'>[],
    ResponseError,
    DataInput,
    { cache: UpdateCacheActions }
  >,
  'notify'
>

export function useUpdateSuperCampaignEnrollmentTags(
  options?: UseEnrollUserInSuperCampaignOptions
): UseEnrollUserInSuperCampaign {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ superCampaignId, enrollment }) =>
      enrollUserInSuperCampaign(superCampaignId, [enrollment]),
    {
      ...options,
      notify: {
        onSuccess: 'The tags were updated',
        onError: 'Something went wrong while updating the tags'
      },
      onMutate: async ({ superCampaignId, enrollment }) => ({
        cache: await updateCacheComposer(
          updateCacheAllList(queryClient, superCampaignId, [enrollment], {
            tags: enrollment.tags
          }),
          updateCacheMyList(queryClient, superCampaignId, {
            tags: enrollment.tags
          })
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
