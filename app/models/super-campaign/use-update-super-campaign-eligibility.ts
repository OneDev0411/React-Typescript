import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'

import { getAll, getOne } from './query-keys/campaign'
import { updateSuperCampaignEligibility } from './update-super-campaign-eligibility'

export type UseUpdateSuperCampaignEligibility = UseMutationResult<
  ISuperCampaign,
  ResponseError,
  UUID[],
  { previousSuperCampaign?: ISuperCampaign<'template_instance'> }
>

export type UseUpdateSuperCampaignEligibilityOptions = Omit<
  UseMutationOptions<
    ISuperCampaign,
    ResponseError,
    UUID[],
    { previousSuperCampaign?: ISuperCampaign<'template_instance'> }
  >,
  'notify' | 'invalidates' | 'onMutate'
>

export function useUpdateSuperCampaignEligibility(
  superCampaign: Pick<ISuperCampaign, 'id'>,
  options?: UseUpdateSuperCampaignEligibilityOptions
): UseUpdateSuperCampaignEligibility {
  const queryClient = useQueryClient()

  return useMutation(
    async eligibleBrands =>
      updateSuperCampaignEligibility(superCampaign.id, eligibleBrands),
    {
      ...options,
      notify: {
        onSuccess: 'The eligible brands were updated',
        onError:
          'Something went wrong while saving the eligible brands. Please try again.'
      },
      invalidates: [getAll()],
      onMutate: async eligibleBrands => {
        await queryClient.cancelQueries(getOne(superCampaign.id))

        const previousSuperCampaign = queryClient.getQueryData<
          ISuperCampaign<'template_instance'>
        >(getOne(superCampaign.id))

        if (!previousSuperCampaign) {
          return {}
        }

        queryClient.setQueryData<ISuperCampaign<'template_instance'>>(
          getOne(superCampaign.id),
          { ...previousSuperCampaign, eligible_brands: eligibleBrands }
        )

        return { previousSuperCampaign }
      },
      onError: (error, eligibleBrands, context) => {
        if (!context?.previousSuperCampaign) {
          return
        }

        queryClient.setQueryData(
          getOne(superCampaign.id),
          context.previousSuperCampaign
        )

        options?.onError?.(error, eligibleBrands, context)
      },
      onSettled: (...args) => {
        queryClient.invalidateQueries(getOne(superCampaign.id))
        options?.onSettled?.(...args)
      }
    }
  )
}
