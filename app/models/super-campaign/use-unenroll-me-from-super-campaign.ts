import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'
import { updateCacheActions, UpdateCacheActions } from '@app/utils/react-query'

import { myList } from './query-keys/enrollment'
import { unenrollMeFromSuperCampaign } from './unenroll-me-from-super-campaign'

export type UseUnenrollMeFromSuperCampaign = UseMutationResult<
  void,
  ResponseError,
  UUID,
  { cache: UpdateCacheActions }
>

export type UseUnenrollMeFromSuperCampaignOptions = Omit<
  UseMutationOptions<void, ResponseError, UUID, { cache: UpdateCacheActions }>,
  'notify' | 'onMutate'
>

export function useUnenrollMeFromSuperCampaign(
  options?: UseUnenrollMeFromSuperCampaignOptions
): UseUnenrollMeFromSuperCampaign {
  const queryClient = useQueryClient()

  return useMutation(
    async superCampaignId => unenrollMeFromSuperCampaign(superCampaignId),
    {
      ...options,
      notify: {
        onSuccess: 'You have been opted-out from the campaign',
        onError: 'Something went wrong while opting-out the campaign'
      },
      onMutate: async superCampaignId => ({
        cache: await updateCacheActions<ISuperCampaignEnrollment[]>(
          queryClient,
          myList(),
          enrollments => {
            const index = enrollments.findIndex(
              element => element.super_campaign === superCampaignId
            )

            if (index === -1) {
              return
            }

            enrollments.splice(index, 1)
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
