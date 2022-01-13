import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'

import { getAll, getOne } from './query-keys/campaign'
import { updateSuperCampaign } from './update-super-campaign'

interface SuperCampaignInput
  extends Omit<ISuperCampaignInput, 'template_instance'> {
  template_instance: IMarketingTemplateInstance
}

export type UseUpdateSuperCampaign = UseMutationResult<
  ISuperCampaign<'template_instance'>,
  ResponseError,
  Partial<SuperCampaignInput>,
  { previousSuperCampaign?: ISuperCampaign<'template_instance'> }
>

export type UseUpdateSuperCampaignOptions = Omit<
  UseMutationOptions<
    ISuperCampaign<'template_instance'>,
    ResponseError,
    Partial<SuperCampaignInput>,
    { previousSuperCampaign?: ISuperCampaign<'template_instance'> }
  >,
  'invalidates' | 'onMutate'
>
export function useUpdateSuperCampaign(
  superCampaign: ISuperCampaign<'template_instance'>,
  options?: UseUpdateSuperCampaignOptions
): UseUpdateSuperCampaign {
  const queryClient = useQueryClient()

  return useMutation(
    async superCampaignData =>
      updateSuperCampaign(superCampaign.id, {
        subject: superCampaignData.subject ?? superCampaign.subject,
        description: superCampaignData.description ?? superCampaign.description,
        // The null value is acceptable for due_at field
        due_at:
          superCampaignData.due_at === null
            ? null
            : superCampaignData.due_at ?? superCampaign.due_at,
        template_instance:
          superCampaignData.template_instance?.id ??
          superCampaign.template_instance?.id
      }),
    {
      ...options,
      notify: {
        onSuccess: options?.notify?.onSuccess ?? 'The campaign was updated',
        onError:
          options?.notify?.onError ??
          'Something went wrong while saving the campaign. Please try again.'
      },
      invalidates: [getAll()], // TODO: use optimistic update if possible
      onMutate: async superCampaignData => {
        await queryClient.cancelQueries(getOne(superCampaign.id))

        const previousSuperCampaign = queryClient.getQueryData<
          ISuperCampaign<'template_instance'>
        >(getOne(superCampaign.id))

        if (!previousSuperCampaign) {
          return {}
        }

        queryClient.setQueryData<ISuperCampaign<'template_instance'>>(
          getOne(superCampaign.id),
          { ...previousSuperCampaign, ...superCampaignData }
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
