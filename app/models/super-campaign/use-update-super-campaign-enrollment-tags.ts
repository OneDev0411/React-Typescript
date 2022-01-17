import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'
import { enrollUserInSuperCampaign } from '@app/models/super-campaign'
import { UpdateCacheActions } from '@app/utils/react-query'

import { updateCacheEnrollments } from './query-update/enrollment'

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
        cache: await updateCacheEnrollments(
          queryClient,
          superCampaignId,
          [enrollment],
          prevEnrollment => {
            prevEnrollment.tags = enrollment.tags
          }
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
