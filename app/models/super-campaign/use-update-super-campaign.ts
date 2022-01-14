import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'

import { getAll, getOne } from './query-keys/campaign'
import { updateSuperCampaign } from './update-super-campaign'

interface DataInput {
  superCampaign: ISuperCampaign<'template_instance'>
  inputData: Partial<SuperCampaignInput>
}

interface SuperCampaignInput
  extends Omit<ISuperCampaignInput, 'template_instance'> {
  template_instance: IMarketingTemplateInstance
}

export type UseUpdateSuperCampaign = UseMutationResult<
  ISuperCampaign<'template_instance'>,
  ResponseError,
  DataInput,
  { previousSuperCampaign?: ISuperCampaign<'template_instance'> }
>

export type UseUpdateSuperCampaignOptions = Omit<
  UseMutationOptions<
    ISuperCampaign<'template_instance'>,
    ResponseError,
    DataInput,
    { previousSuperCampaign?: ISuperCampaign<'template_instance'> }
  >,
  'invalidates' | 'onMutate'
>

export function useUpdateSuperCampaign(
  options?: UseUpdateSuperCampaignOptions
): UseUpdateSuperCampaign {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ inputData, superCampaign }) =>
      updateSuperCampaign(superCampaign.id, {
        subject: inputData.subject ?? superCampaign.subject,
        description: inputData.description ?? superCampaign.description,
        // The null value is acceptable for due_at field
        due_at:
          inputData.due_at === null
            ? null
            : inputData.due_at ?? superCampaign.due_at,
        template_instance:
          inputData.template_instance?.id ?? superCampaign.template_instance?.id
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
      onMutate: async ({ inputData, superCampaign }) => {
        await queryClient.cancelQueries(getOne(superCampaign.id))

        const previousSuperCampaign = queryClient.getQueryData<
          ISuperCampaign<'template_instance'>
        >(getOne(superCampaign.id))

        if (!previousSuperCampaign) {
          return {}
        }

        queryClient.setQueryData<ISuperCampaign<'template_instance'>>(
          getOne(superCampaign.id),
          { ...previousSuperCampaign, ...inputData }
        )

        return { previousSuperCampaign }
      },
      onError: (error, variables, context) => {
        if (!context?.previousSuperCampaign) {
          return
        }

        queryClient.setQueryData(
          getOne(variables.superCampaign.id),
          context.previousSuperCampaign
        )

        options?.onError?.(error, variables, context)
      },
      onSettled: (data, error, variables, context) => {
        queryClient.invalidateQueries(getOne(variables.superCampaign.id))
        options?.onSettled?.(data, error, variables, context)
      }
    }
  )
}
