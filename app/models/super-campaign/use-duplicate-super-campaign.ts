import { UseMutationResult } from 'react-query'

import { useMutation, UseMutationOptions } from '@app/hooks/query'

import { createSuperCampaign } from './create-super-campaign'
import { getAll } from './query-keys/campaign'

export type UseDuplicateSuperCampaign = UseMutationResult<
  ISuperCampaign<'template_instance'>
>

export type UseDuplicateSuperCampaignOptions = Omit<
  UseMutationOptions<ISuperCampaign<'template_instance'>>,
  'notify' | 'invalidates'
>

export function useDuplicateSuperCampaign(
  superCampaign: ISuperCampaign<'template_instance'>,
  options?: UseDuplicateSuperCampaignOptions
): UseDuplicateSuperCampaign {
  return useMutation(
    async () =>
      createSuperCampaign({
        subject: superCampaign.subject,
        description: superCampaign.description,
        template_instance: superCampaign.template_instance?.id,
        tags: superCampaign.tags ?? undefined,
        eligible_brands: superCampaign.eligible_brands ?? undefined,
        due_at: null
      }),
    {
      notify: {
        onSuccess: 'The campaign was duplicated',
        onError:
          'Something went wrong while duplicating the campaign. Please try again.'
      },
      invalidates: [getAll()], // TODO: use optimistic update if possible
      ...options
    }
  )
}
