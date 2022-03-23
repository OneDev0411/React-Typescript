import useNotify from '@app/hooks/use-notify'
import {
  useGetSuperCampaign,
  UseGetSuperCampaign
} from '@app/models/super-campaign'
import { goTo } from '@app/utils/go-to'

import { useGetSuperCampaignBackUrl } from './use-get-super-campaign-back-url'
import { useInvalidateSuperCampaignBasedOnDueAt } from './use-invalidate-super-campaign-based-on-due-at'

export function useGetSuperCampaignForDetail(
  superCampaignId: UUID
): UseGetSuperCampaign {
  const notify = useNotify()
  const backUrl = useGetSuperCampaignBackUrl()

  const result = useGetSuperCampaign(superCampaignId, {
    onError: error => {
      notify({
        status: 'error',
        message:
          error.status === 403
            ? 'You can not access the campaign'
            : 'Something went wrong. Please try again.'
      })
      goTo(backUrl)
    }
  })

  useInvalidateSuperCampaignBasedOnDueAt(result.data)

  return result
}
