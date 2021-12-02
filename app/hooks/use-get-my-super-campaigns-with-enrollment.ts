import { Dispatch, SetStateAction, useEffect } from 'react'

import useAsync from '@app/hooks/use-async'
import getMySuperCampaignEnrollments from '@app/models/super-campaign/get-my-super-campaign-enrollments'
import getMySuperCampaigns from '@app/models/super-campaign/get-my-super-campaigns'

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
}

// eslint-disable-next-line max-len
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

  const enrollToSuperCampaign = (
    superCampaignId: UUID,
    enrollment: ISuperCampaignEnrollment
  ) =>
    setSuperCampaignsWithEnrollment(prevSuperCampaignsWithEnrollment => {
      const superCampaignIndex = superCampaignsWithEnrollment.findIndex(
        superCampaign => superCampaign.id === superCampaignId
      )

      if (superCampaignIndex === -1) {
        return prevSuperCampaignsWithEnrollment
      }

      const newSuperCampaignsWithEnrollment = [
        ...prevSuperCampaignsWithEnrollment
      ]

      newSuperCampaignsWithEnrollment.splice(superCampaignIndex, 1, {
        ...superCampaignsWithEnrollment[superCampaignIndex],
        enrollment
      })

      return newSuperCampaignsWithEnrollment
    })

  const unenrollFromSuperCampaign = (superCampaignId: UUID) =>
    setSuperCampaignsWithEnrollment(prevSuperCampaignsWithEnrollment => {
      const superCampaignIndex = superCampaignsWithEnrollment.findIndex(
        superCampaign => superCampaign.id === superCampaignId
      )

      if (superCampaignIndex === -1) {
        return prevSuperCampaignsWithEnrollment
      }

      const newSuperCampaignsWithEnrollment = [
        ...prevSuperCampaignsWithEnrollment
      ]

      newSuperCampaignsWithEnrollment.splice(superCampaignIndex, 1, {
        ...superCampaignsWithEnrollment[superCampaignIndex],
        enrollment: undefined
      })

      return newSuperCampaignsWithEnrollment
    })

  return {
    isLoading,
    superCampaignsWithEnrollment,
    setSuperCampaignsWithEnrollment,
    enrollToSuperCampaign,
    unenrollFromSuperCampaign
  }
}
