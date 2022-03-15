import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'
import { UpdateCacheActions } from '@app/utils/react-query'

import { myList } from '../query-keys/enrollment'
import { updateCacheAllList } from '../query-update/enrollment'

import { enrollUserInSuperCampaign } from './enroll-user-in-super-campaign'

interface DataInput {
  superCampaignId: UUID
  enrollments: ISuperCampaignEnrollmentInput[]
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

export function useEnrollUserInSuperCampaign(
  options?: UseEnrollUserInSuperCampaignOptions
): UseEnrollUserInSuperCampaign {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ superCampaignId, enrollments }) =>
      enrollUserInSuperCampaign(superCampaignId, enrollments),
    {
      ...options,
      notify: {
        onSuccess: 'The user was enrolled successfully',
        onError: 'Something went wrong while adding the enrollment'
      },
      invalidates: [myList()],
      onMutate: async ({ superCampaignId, enrollments }) => ({
        cache: await updateCacheAllList(
          queryClient,
          superCampaignId,
          enrollments,
          { deleted_at: undefined }
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
