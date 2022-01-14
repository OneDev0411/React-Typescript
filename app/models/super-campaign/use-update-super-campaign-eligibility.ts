import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'

import { getAll } from './query-keys/campaign'
import { UpdateCacheActions, updateCacheOne } from './query-update/campaign'
import { updateSuperCampaignEligibility } from './update-super-campaign-eligibility'

interface DataInput {
  superCampaignId: UUID
  eligibleBrands: string[]
}

export type UseUpdateSuperCampaignEligibility = UseMutationResult<
  ISuperCampaign,
  ResponseError,
  DataInput,
  { cache: UpdateCacheActions }
>

export type UseUpdateSuperCampaignEligibilityOptions = Omit<
  UseMutationOptions<
    ISuperCampaign,
    ResponseError,
    DataInput,
    { cache: UpdateCacheActions }
  >,
  'notify' | 'invalidates' | 'onMutate'
>

export function useUpdateSuperCampaignEligibility(
  options?: UseUpdateSuperCampaignEligibilityOptions
): UseUpdateSuperCampaignEligibility {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ superCampaignId, eligibleBrands }) =>
      updateSuperCampaignEligibility(superCampaignId, eligibleBrands),
    {
      ...options,
      notify: {
        onSuccess: 'The eligible brands were updated',
        onError:
          'Something went wrong while saving the eligible brands. Please try again.'
      },
      invalidates: [getAll()],
      onMutate: async ({ superCampaignId, eligibleBrands }) => ({
        cache: await updateCacheOne(queryClient, superCampaignId, {
          eligible_brands: eligibleBrands
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
