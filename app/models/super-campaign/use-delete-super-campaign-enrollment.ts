import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'
import { updateCacheActions, UpdateCacheActions } from '@app/utils/react-query'

import { deleteSuperCampaignEnrollment } from './delete-super-campaign-enrollment'
import { allList } from './query-keys/enrollment'

interface DataInput {
  superCampaignId: UUID
  userId: UUID
  brandId: UUID
}

type UseDeleteSuperCampaignEnrollment = UseMutationResult<
  void,
  ResponseError,
  DataInput,
  { cache: UpdateCacheActions }
>

type UseDeleteSuperCampaignEnrollmentOptions = Omit<
  UseMutationOptions<
    void,
    ResponseError,
    DataInput,
    { cache: UpdateCacheActions }
  >,
  'notify'
>

export function useDeleteSuperCampaignEnrollment(
  options?: UseDeleteSuperCampaignEnrollmentOptions
): UseDeleteSuperCampaignEnrollment {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ superCampaignId, userId, brandId }) =>
      deleteSuperCampaignEnrollment(superCampaignId, {
        user: userId,
        brand: brandId
      }),
    {
      ...options,
      notify: {
        onSuccess: 'The enrollment was deleted',
        onError: 'Something went wrong while deleting the enrollment'
      },
      onMutate: async ({ superCampaignId, userId, brandId }) => ({
        cache: await updateCacheActions<
          ISuperCampaignEnrollment<'user' | 'brand'>[]
        >(queryClient, allList(superCampaignId), prevEnrollments => {
          const enrollment = prevEnrollments.find(
            prevEnrollment =>
              prevEnrollment.user.id === userId &&
              prevEnrollment.brand.id === brandId
          )

          if (enrollment) {
            enrollment.deleted_at = new Date().getTime() / 1000
          }
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
