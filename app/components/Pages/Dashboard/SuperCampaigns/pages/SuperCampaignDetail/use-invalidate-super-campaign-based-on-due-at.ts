import { useEffect } from 'react'

import { useQueryClient } from 'react-query'

import { detail, allList } from '@app/models/super-campaign/query-keys/campaign'

import { getSuperCampaignDueAtRemainingTimeInMilliSeconds } from '../../helpers'

const WAIT_FOR_CAMPAIGN_TIME = 5000
// The max allowed value for a schedule timer is 2**31-1 = 2147483647
// To find more info please check the below documentation:
// https://nodejs.org/api/timers.html#settimeoutcallback-delay-args
const SET_TIMEOUT_MAX_VALUE = 2147483647

export function useInvalidateSuperCampaignBasedOnDueAt(
  superCampaign: Optional<ISuperCampaign<'template_instance'>>
): void {
  const queryClient = useQueryClient()

  useEffect(() => {
    const dueAt = superCampaign?.due_at

    // Return if there is no due at or the campaign was executed
    if (!dueAt || !!superCampaign?.executed_at || !superCampaign?.id) {
      return
    }

    const invalidate = () => {
      queryClient.invalidateQueries(detail(superCampaign.id))
      queryClient.invalidateQueries(allList(), { exact: false })
    }

    let timer: Nullable<NodeJS.Timer> = null
    const remainingTime =
      getSuperCampaignDueAtRemainingTimeInMilliSeconds(dueAt)

    // If the due at is a time in the future, we need to set a timer to reload the campaign
    if (remainingTime > 0) {
      timer = setTimeout(
        invalidate,
        Math.min(remainingTime, SET_TIMEOUT_MAX_VALUE)
      )
    }

    // Otherwise, we need to wait a bit for the campaign to be executed and then refresh the page
    else {
      timer = setTimeout(invalidate, WAIT_FOR_CAMPAIGN_TIME)
    }

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [superCampaign, queryClient])
}
