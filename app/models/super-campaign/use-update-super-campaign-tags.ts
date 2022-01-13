import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'

import { getAll, getOne } from './query-keys/campaign'
import { updateSuperCampaignTags } from './update-super-campaign-tags'

export type UseUpdateSuperCampaignTags = UseMutationResult<
  ISuperCampaign,
  ResponseError,
  string[],
  { previousSuperCampaign?: ISuperCampaign<'template_instance'> }
>

export type UseUpdateSuperCampaignTagsOptions = Omit<
  UseMutationOptions<
    ISuperCampaign,
    ResponseError,
    string[],
    { previousSuperCampaign?: ISuperCampaign<'template_instance'> }
  >,
  'notify' | 'invalidates' | 'onMutate'
>

export function useUpdateSuperCampaignTags(
  superCampaign: Pick<ISuperCampaign, 'id'>,
  options?: UseUpdateSuperCampaignTagsOptions
): UseUpdateSuperCampaignTags {
  const queryClient = useQueryClient()

  return useMutation(
    async tags => updateSuperCampaignTags(superCampaign.id, tags),
    {
      ...options,
      notify: {
        onSuccess: 'The tags were updated',
        onError: 'Something went wrong while saving the tags. Please try again.'
      },
      invalidates: [getAll()],
      onMutate: async tags => {
        await queryClient.cancelQueries(getOne(superCampaign.id))

        const previousSuperCampaign = queryClient.getQueryData<
          ISuperCampaign<'template_instance'>
        >(getOne(superCampaign.id))

        if (!previousSuperCampaign) {
          return {}
        }

        queryClient.setQueryData<ISuperCampaign<'template_instance'>>(
          getOne(superCampaign.id),
          { ...previousSuperCampaign, tags }
        )

        return { previousSuperCampaign }
      },
      onError: (error, tags, context) => {
        if (!context?.previousSuperCampaign) {
          return
        }

        queryClient.setQueryData(
          getOne(superCampaign.id),
          context.previousSuperCampaign
        )

        options?.onError?.(error, tags, context)
      },
      onSettled: (...args) => {
        queryClient.invalidateQueries(getOne(superCampaign.id))
        options?.onSettled?.(...args)
      }
    }
  )
}
