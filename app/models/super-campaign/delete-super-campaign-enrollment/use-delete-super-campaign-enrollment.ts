import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'
import { UpdateCacheActions } from '@app/utils/react-query'

import { myList } from '../query-keys/enrollment'
import { updateCacheAllList } from '../query-update/enrollment'

import { deleteSuperCampaignEnrollment } from './delete-super-campaign-enrollment'

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
      invalidates: [myList()],
      onMutate: async ({ superCampaignId, userId, brandId }) => ({
        cache: await updateCacheAllList(
          queryClient,
          superCampaignId,
          [{ brand: brandId, user: userId }],
          { deleted_at: new Date().getTime() / 1000 }
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
