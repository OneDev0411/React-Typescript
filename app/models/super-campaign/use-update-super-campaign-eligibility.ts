import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'

import { getAll, getOne } from './query-keys/campaign'
import { updateSuperCampaignEligibility } from './update-super-campaign-eligibility'

interface DataInput {
  superCampaignId: UUID
  eligibleBrands: string[]
}

export type UseUpdateSuperCampaignEligibility = UseMutationResult<
  ISuperCampaign,
  ResponseError,
  DataInput,
  { previousSuperCampaign?: ISuperCampaign<'template_instance'> }
>

export type UseUpdateSuperCampaignEligibilityOptions = Omit<
  UseMutationOptions<
    ISuperCampaign,
    ResponseError,
    DataInput,
    { previousSuperCampaign?: ISuperCampaign<'template_instance'> }
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
      onMutate: async ({ superCampaignId, eligibleBrands }) => {
        await queryClient.cancelQueries(getOne(superCampaignId))

        const previousSuperCampaign = queryClient.getQueryData<
          ISuperCampaign<'template_instance'>
        >(getOne(superCampaignId))

        if (!previousSuperCampaign) {
          return {}
        }

        queryClient.setQueryData<ISuperCampaign<'template_instance'>>(
          getOne(superCampaignId),
          { ...previousSuperCampaign, eligible_brands: eligibleBrands }
        )

        return { previousSuperCampaign }
      },
      onError: (error, variables, context) => {
        if (!context?.previousSuperCampaign) {
          return
        }

        queryClient.setQueryData(
          getOne(variables.superCampaignId),
          context.previousSuperCampaign
        )

        options?.onError?.(error, variables, context)
      },
      onSettled: (data, error, variables, context) => {
        queryClient.invalidateQueries(getOne(variables.superCampaignId))
        options?.onSettled?.(data, error, variables, context)
      }
    }
  )
}
