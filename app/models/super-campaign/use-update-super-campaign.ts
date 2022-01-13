import { UseMutationResult } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'

import { getAll, getOne } from './query-keys/campaign'
import { updateSuperCampaign } from './update-super-campaign'

export type UseUpdateSuperCampaign = UseMutationResult<
  ISuperCampaign<'template_instance'>
>

export type UseUpdateSuperCampaignOptions = Omit<
  UseMutationOptions<
    ISuperCampaign<'template_instance'>,
    ResponseError,
    Partial<ISuperCampaignInput>
  >,
  'invalidates'
>
export function useUpdateSuperCampaign(
  superCampaign: ISuperCampaign<'template_instance'>,
  options?: UseUpdateSuperCampaignOptions
): UseUpdateSuperCampaign {
  return useMutation(
    async (superCampaignData: Partial<ISuperCampaignInput>) =>
      updateSuperCampaign(superCampaign.id, {
        subject: superCampaignData.subject ?? superCampaign.subject,
        description: superCampaignData.description ?? superCampaign.description,
        // The null value is acceptable for due_at field
        due_at:
          superCampaignData.due_at === null
            ? null
            : superCampaignData.due_at ?? superCampaign.due_at,
        template_instance:
          superCampaignData.template_instance ??
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
      invalidates: [getAll(), getOne(superCampaign.id)] // TODO: use optimistic update if possible
    }
  )
}
