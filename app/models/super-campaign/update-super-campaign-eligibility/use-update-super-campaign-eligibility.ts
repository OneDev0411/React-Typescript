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
  'notify' | 'onMutate' | 'invalidates'
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
      invalidates: (_, { superCampaignId }) => [
        enrollmentAllList(superCampaignId)
      ],
      onMutate: async ({ superCampaignId, eligibleBrands }) => ({
        cache: await updateCacheComposer(
          updateCacheDetail(queryClient, superCampaignId, {
            eligible_brands: eligibleBrands
          }),
          updateCacheAllList(queryClient, superCampaignId, {
            eligible_brands: eligibleBrands
          }),
          updateCacheMyList(queryClient, superCampaignId, {
            eligible_brands: eligibleBrands
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
