import { Dispatch, SetStateAction, useEffect } from 'react'

import useAsync from '@app/hooks/use-async'
import getMySuperCampaignEnrollments from '@app/models/super-campaign/get-my-super-campaign-enrollments'
import getMySuperCampaigns from '@app/models/super-campaign/get-my-super-campaigns'

import { SuperCampaignWithEnrollment } from './types'

interface UseGetSuperCampaignsWithEnrollment {
  isLoading: boolean
  superCampaignsWithEnrollment: SuperCampaignWithEnrollment[]
  setSuperCampaignsWithEnrollment: Dispatch<
    SetStateAction<SuperCampaignWithEnrollment[]>
  >
}

// eslint-disable-next-line max-len
export function useGetSuperCampaignsWithEnrollment(): UseGetSuperCampaignsWithEnrollment {
  const {
    isLoading,
    data: superCampaignsWithEnrollment,
    setData: setSuperCampaignsWithEnrollment,
    run
  } = useAsync<SuperCampaignWithEnrollment[]>({
    data: [],
    status: 'pending'
  })

  useEffect(() => {
    run(async () => {
      const [mySuperCampaigns, mySuperCampaignEnrollments] = await Promise.all([
        getMySuperCampaigns(),
        getMySuperCampaignEnrollments()
      ])

      const superCampaignEnrollmentMap = mySuperCampaignEnrollments.reduce<
        Record<UUID, ISuperCampaignEnrollment>
      >(
        (acc, enrollment) => ({
          ...acc,
          [enrollment.super_campaign]: enrollment
        }),
        {}
      )

      return mySuperCampaigns.map<SuperCampaignWithEnrollment>(
        mySuperCampaign => ({
          ...mySuperCampaign,
          enrollment: superCampaignEnrollmentMap[mySuperCampaign.id]
        })
      )
    })
  }, [run])

  return {
    isLoading,
    superCampaignsWithEnrollment,
    setSuperCampaignsWithEnrollment
  }
}
