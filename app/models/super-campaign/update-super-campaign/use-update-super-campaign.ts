import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'
import { UpdateCacheActions, updateCacheComposer } from '@app/utils/react-query'

import {
  updateCacheDetail,
  updateCacheAllList,
  updateCacheMyList
} from '../query-update/campaign'

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
  { cache: UpdateCacheActions }
>

export type UseUpdateSuperCampaignOptions = Omit<
  UseMutationOptions<
    ISuperCampaign<'template_instance'>,
    ResponseError,
    DataInput,
    { cache: UpdateCacheActions }
  >,
  'onMutate'
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
      onMutate: async ({ inputData, superCampaign }) => ({
        cache: await updateCacheComposer(
          updateCacheDetail(queryClient, superCampaign.id, inputData),
          updateCacheAllList(queryClient, superCampaign.id, inputData),
          updateCacheMyList(queryClient, superCampaign.id, inputData)
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
