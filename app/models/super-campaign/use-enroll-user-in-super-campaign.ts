import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'
import { enrollUserInSuperCampaign } from '@app/models/super-campaign'
import { UpdateCacheActions, updateCacheActions } from '@app/utils/react-query'

import { list } from './query-keys/enrollment'

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
      onMutate: async ({ superCampaignId, enrollments }) => ({
        cache: await updateCacheActions<
          ISuperCampaignEnrollment<'user' | 'brand'>[]
        >(queryClient, list(superCampaignId), previousEnrollments => {
          previousEnrollments.forEach(previousEnrollment => {
            const found = !!enrollments.find(
              item =>
                item.user === previousEnrollment.user.id &&
                item.brand === previousEnrollment.brand.id
            )

            if (found) {
              previousEnrollment.deleted_at = undefined
            }
          })
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
