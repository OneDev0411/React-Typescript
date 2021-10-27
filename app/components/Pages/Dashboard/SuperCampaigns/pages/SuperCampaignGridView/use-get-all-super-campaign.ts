import { Dispatch, SetStateAction, useEffect } from 'react'

import useAsync from '@app/hooks/use-async'
import getAllSuperCampaign from '@app/models/super-campaign/get-all-super-campaign'

interface UseGetSuperCampaign {
  isLoading: boolean
  superCampaignList: any
  setSuperCampaignList: Dispatch<
    SetStateAction<Nullable<ISuperCampaign<'template_instance'>>>
  >
}

export function useGetAllSuperCampaign(): UseGetSuperCampaign {
  const {
    run,
    data: superCampaignList,
    setData: setSuperCampaignList,
    isLoading
  } = useAsync<Nullable<ISuperCampaign<'template_instance'>>>({
    data: null,
    status: 'pending'
  })

  useEffect(() => {
    run(async () => getAllSuperCampaign())
  }, [run])

  return { isLoading, superCampaignList, setSuperCampaignList }
}
