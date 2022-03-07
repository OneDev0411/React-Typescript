import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'
import { UpdateCacheActions } from '@app/utils/react-query'

import { allList } from '../query-keys/enrollment'
import { updateCacheMyList } from '../query-update/enrollment'

import {
  updateMySuperCampaignEnrollment,
  DataInput as BaseDataInput
} from './update-my-super-campaign-enrollment'

interface DataInput {
  superCampaignId: UUID
  data: BaseDataInput
}

export type UseUpdateMySuperCampaignEnrollment = UseMutationResult<
  void,
  ResponseError,
  DataInput,
  { cache: UpdateCacheActions }
>

export type UseUpdateMySuperCampaignEnrollmentOptions = UseMutationOptions<
  void,
  ResponseError,
  DataInput,
  { cache: UpdateCacheActions }
>

export function useUpdateMySuperCampaignEnrollment(
  options?: UseUpdateMySuperCampaignEnrollmentOptions
): UseUpdateMySuperCampaignEnrollment {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ superCampaignId, data }) =>
      updateMySuperCampaignEnrollment(superCampaignId, data),
    {
      notify: {
        onSuccess:
          options?.notify?.onSuccess ??
          'Your campaign enrollment has been updated',
        onError:
          options?.notify?.onError ??
          'Something went wrong while updating your campaign enrollment'
      },
      invalidates: (_, { superCampaignId }) => [allList(superCampaignId)],
      onMutate: async ({ superCampaignId, data }) => ({
        cache: await updateCacheMyList(queryClient, superCampaignId, data)
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
