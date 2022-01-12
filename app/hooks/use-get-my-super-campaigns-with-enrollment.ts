import { Dispatch, SetStateAction, useEffect } from 'react'

import useAsync from '@app/hooks/use-async'
import {
  getMySuperCampaignEnrollments,
  getMySuperCampaigns
} from '@app/models/super-campaign'

interface UseGetMySuperCampaignsWithEnrollment {
  isLoading: boolean
  superCampaignsWithEnrollment: ISuperCampaignWithEnrollment[]
  setSuperCampaignsWithEnrollment: Dispatch<
    SetStateAction<ISuperCampaignWithEnrollment[]>
  >
  enrollToSuperCampaign: (
    superCampaignId: UUID,
    enrollment: ISuperCampaignEnrollment
  ) => void
  unenrollFromSuperCampaign: (superCampaignId: UUID) => void
  setEnrollmentNotificationsEnabled: (
    superCampaignId: UUID,
    enabled: boolean
  ) => void
}

export function useGetMySuperCampaignsWithEnrollment(
  limit?: number
): UseGetMySuperCampaignsWithEnrollment {
  const {
    isLoading,
    data: superCampaignsWithEnrollment,
    setData: setSuperCampaignsWithEnrollment,
    run
  } = useAsync<ISuperCampaignWithEnrollment[]>({
    data: [],
    status: 'pending'
  })

  useEffect(() => {
    run(async () => {
      const [mySuperCampaigns, mySuperCampaignEnrollments] = await Promise.all([
        getMySuperCampaigns(limit),
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

      return mySuperCampaigns.map<ISuperCampaignWithEnrollment>(
        mySuperCampaign => ({
          ...mySuperCampaign,
          enrollment: superCampaignEnrollmentMap[mySuperCampaign.id]
        })
      )
    })
  }, [run, limit])

  const updateSuperCampaignEnrollment = (
    superCampaignId: UUID,
    modifier: (
      enrollment: Optional<ISuperCampaignEnrollment>
    ) => Optional<ISuperCampaignEnrollment>
  ) =>
    setSuperCampaignsWithEnrollment(superCampaignsWithEnrollment =>
      superCampaignsWithEnrollment.map(superCampaignWithEnrollment => {
        if (superCampaignWithEnrollment.id !== superCampaignId) {
          return superCampaignWithEnrollment
        }

        return {
          ...superCampaignWithEnrollment,
          enrollment: modifier(superCampaignWithEnrollment.enrollment)
        }
      })
    )

  const enrollToSuperCampaign = (
    superCampaignId: UUID,
    enrollment: ISuperCampaignEnrollment
  ) => updateSuperCampaignEnrollment(superCampaignId, () => enrollment)

  const unenrollFromSuperCampaign = (superCampaignId: UUID) =>
    updateSuperCampaignEnrollment(superCampaignId, () => undefined)

  const setEnrollmentNotificationsEnabled = (
    superCampaignId: UUID,
    enabled: boolean
  ) =>
    updateSuperCampaignEnrollment(superCampaignId, enrollment =>
      enrollment ? { ...enrollment, notifications_enabled: enabled } : undefined
    )

  return {
    isLoading,
    superCampaignsWithEnrollment,
    setSuperCampaignsWithEnrollment,
    enrollToSuperCampaign,
    unenrollFromSuperCampaign,
    setEnrollmentNotificationsEnabled
  }
}
