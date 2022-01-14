import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'

import { getAll, getOne } from './query-keys/campaign'
import { updateSuperCampaignTags } from './update-super-campaign-tags'

interface DataInput {
  superCampaignId: UUID
  tags: string[]
}

export type UseUpdateSuperCampaignTags = UseMutationResult<
  ISuperCampaign,
  ResponseError,
  DataInput,
  { previousSuperCampaign?: ISuperCampaign<'template_instance'> }
>

export type UseUpdateSuperCampaignTagsOptions = Omit<
  UseMutationOptions<
    ISuperCampaign,
    ResponseError,
    DataInput,
    { previousSuperCampaign?: ISuperCampaign<'template_instance'> }
  >,
  'notify' | 'invalidates' | 'onMutate'
>

export function useUpdateSuperCampaignTags(
  options?: UseUpdateSuperCampaignTagsOptions
): UseUpdateSuperCampaignTags {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ superCampaignId, tags }) =>
      updateSuperCampaignTags(superCampaignId, tags),
    {
      ...options,
      notify: {
        onSuccess: 'The tags were updated',
        onError: 'Something went wrong while saving the tags. Please try again.'
      },
      invalidates: [getAll()],
      onMutate: async ({ superCampaignId, tags }) => {
        await queryClient.cancelQueries(getOne(superCampaignId))

        const previousSuperCampaign = queryClient.getQueryData<
          ISuperCampaign<'template_instance'>
        >(getOne(superCampaignId))

        if (!previousSuperCampaign) {
          return {}
        }

        queryClient.setQueryData<ISuperCampaign<'template_instance'>>(
          getOne(superCampaignId),
          { ...previousSuperCampaign, tags }
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
