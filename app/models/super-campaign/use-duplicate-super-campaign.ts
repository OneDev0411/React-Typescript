import { useMutation } from '@app/hooks/query'

import { createSuperCampaign } from './create-super-campaign'
import { getAll } from './query-keys/campaign'

export function useDuplicateSuperCampaign(superCampaign: ISuperCampaign) {
  return useMutation(
    async () =>
      createSuperCampaign({
        subject: superCampaign.subject,
        description: superCampaign.description,
        template_instance: superCampaign.template_instance,
        tags: superCampaign.tags ?? undefined,
        eligible_brands: superCampaign.eligible_brands ?? undefined
      }),
    {
      notify: {
        onSuccess: 'The campaign was duplicated',
        onError:
          'Something went wrong while duplicating the campaign. Please try again.'
      },
      invalidates: [getAll()] // TODO: use optimistic update if possible
    }
  )
}
