import { Dispatch, SetStateAction } from 'react'

import { Grid } from '@material-ui/core'

import SuperCampaignWithEnrollmentCard from './SuperCampaignWithEnrollmentCard'
import { SuperCampaignWithEnrollment } from './types'

export interface SuperCampaignCardsProps {
  superCampaignsWithEnrollment: SuperCampaignWithEnrollment[]
  setSuperCampaignsWithEnrollment: Dispatch<
    SetStateAction<SuperCampaignWithEnrollment[]>
  >
}

function SuperCampaignCards({
  superCampaignsWithEnrollment,
  setSuperCampaignsWithEnrollment
}: SuperCampaignCardsProps) {
  const handleEnroll = (
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

  const handleUnenroll = (superCampaignId: UUID) =>
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

  return (
    <>
      {superCampaignsWithEnrollment.map(superCampaignWithEnrollment => (
        <Grid key={superCampaignWithEnrollment.id} item xs={6} sm={3}>
          <SuperCampaignWithEnrollmentCard
            superCampaignWithEnrollment={superCampaignWithEnrollment}
            onEnroll={enrollment =>
              handleEnroll(superCampaignWithEnrollment.id, enrollment)
            }
            onUnenroll={() => handleUnenroll(superCampaignWithEnrollment.id)}
          />
        </Grid>
      ))}
    </>
  )
}

export default SuperCampaignCards
