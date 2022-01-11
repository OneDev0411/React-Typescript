import { Dispatch, SetStateAction, useCallback, useEffect } from 'react'

import { Response } from 'superagent'

import useAsync from '@app/hooks/use-async'
import useNotify from '@app/hooks/use-notify'
import { getSuperCampaign } from '@app/models/super-campaign'
import { goTo } from '@app/utils/go-to'

import { useGetSuperCampaignBackUrl } from './use-get-super-campaign-back-url'
import { useRefreshSuperCampaignBasedOnDueAt } from './use-refresh-super-campaign-based-on-due-at'

interface UseGetSuperCampaign {
  isLoading: boolean
  superCampaign: Nullable<ISuperCampaign<'template_instance'>>
  setSuperCampaign: Dispatch<
    SetStateAction<Nullable<ISuperCampaign<'template_instance'>>>
  >
}

export function useGetSuperCampaign(
  superCampaignId: UUID
): UseGetSuperCampaign {
  const {
    run,
    data: superCampaign,
    setData: setSuperCampaign,
    isLoading,
    error
  } = useAsync<Nullable<ISuperCampaign<'template_instance'>>, Response>({
    data: null,
    status: 'pending'
  })

  const loadSuperCampaign = useCallback(
    () => run(async () => getSuperCampaign(superCampaignId)),
    [run, superCampaignId]
  )

  useEffect(() => {
    loadSuperCampaign()
  }, [loadSuperCampaign])

  const notify = useNotify()
  const backUrl = useGetSuperCampaignBackUrl()
  const errorStatusCode = error?.status

  // Redirect user to the campaigns list if the campaign is not available
  useEffect(() => {
    if (errorStatusCode) {
      notify({
        status: 'error',
        message:
          errorStatusCode === 403
            ? 'You can not access the campaign'
            : 'Something went wrong. Please try again.'
      })
      goTo(backUrl)
    }
  }, [errorStatusCode, backUrl, notify])

  useRefreshSuperCampaignBasedOnDueAt(superCampaign, loadSuperCampaign)

  return { isLoading, superCampaign, setSuperCampaign }
}
