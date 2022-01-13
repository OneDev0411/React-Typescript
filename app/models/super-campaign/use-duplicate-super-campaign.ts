import { UseMutationResult } from 'react-query'
import { ResponseError } from 'superagent'

import { UseMutationOptions } from '@app/hooks/query'

import { useCreateSuperCampaign } from './use-create-super-campaign'

export type UseDuplicateSuperCampaign = UseMutationResult<
  ISuperCampaign<'template_instance'>
>

export type UseDuplicateSuperCampaignOptions = Omit<
  UseMutationOptions<
    ISuperCampaign<'template_instance'>,
    ResponseError,
    unknown
  >,
  'notify' | 'invalidates'
>

export function useDuplicateSuperCampaign(
  superCampaign: ISuperCampaign<'template_instance'>,
  options?: UseDuplicateSuperCampaignOptions
): UseDuplicateSuperCampaign {
  const mutation = useCreateSuperCampaign({
    ...options,
    notify: {
      onSuccess: 'The campaign was duplicated',
      onError:
        'Something went wrong while duplicating the campaign. Please try again.'
    }
  })

  return {
    ...mutation,
    mutate: () =>
      mutation.mutate({
        subject: superCampaign.subject,
        description: superCampaign.description,
        template_instance: superCampaign.template_instance?.id,
        tags: superCampaign.tags ?? undefined,
        eligible_brands: superCampaign.eligible_brands ?? undefined,
        due_at: null
      })
  }
}
