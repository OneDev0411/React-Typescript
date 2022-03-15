import { useMemo } from 'react'

import {
  useGetMySuperCampaigns,
  useGetMySuperCampaignEnrollments
} from '@app/models/super-campaign'

interface UseGetMySuperCampaignsWithEnrollment {
  isLoading: boolean
  superCampaignsWithEnrollment: ISuperCampaignWithEnrollment[]
}

export function useGetMySuperCampaignsWithEnrollment(
  limit?: number
): UseGetMySuperCampaignsWithEnrollment {
  const { data: mySuperCampaigns, isLoading: isSuperCampaignsLoading } =
    useGetMySuperCampaigns(limit)
  const {
    data: mySuperCampaignEnrollments,
    isLoading: isSuperCampaignEnrollmentsLoading
  } = useGetMySuperCampaignEnrollments()

  const superCampaignsWithEnrollment = useMemo<
    ISuperCampaignWithEnrollment[]
  >(() => {
    const superCampaignEnrollmentMap = (
      mySuperCampaignEnrollments ?? []
    ).reduce<Record<UUID, ISuperCampaignEnrollment>>(
      (acc, enrollment) => ({
        ...acc,
        [enrollment.super_campaign]: enrollment
      }),
      {}
    )

    return (mySuperCampaigns ?? []).map<ISuperCampaignWithEnrollment>(
      mySuperCampaign => ({
        ...mySuperCampaign,
        enrollment: superCampaignEnrollmentMap[mySuperCampaign.id]
      })
    )
  }, [mySuperCampaignEnrollments, mySuperCampaigns])

  return {
    isLoading: isSuperCampaignsLoading || isSuperCampaignEnrollmentsLoading,
    superCampaignsWithEnrollment
  }
}
