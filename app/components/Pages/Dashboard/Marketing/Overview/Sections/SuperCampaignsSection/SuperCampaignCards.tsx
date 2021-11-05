import { Dispatch, SetStateAction } from 'react'

import { Grid } from '@material-ui/core'

import SuperCampaignWithEnrollmentCard from './SuperCampaignWithEnrollmentCard'
import { SuperCampaignWithEnrollment } from './types'

interface SuperCampaignCardsProps {
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
    setSuperCampaignsWithEnrollment(oldSuperCampaignsWithEnrollment => {
      const superCampaignIndex = superCampaignsWithEnrollment.findIndex(
        superCampaign => superCampaign.id === superCampaignId
      )

      if (superCampaignIndex === -1) {
        return oldSuperCampaignsWithEnrollment
      }

      const newSuperCampaignsWithEnrollment = [
        ...oldSuperCampaignsWithEnrollment
      ]

      newSuperCampaignsWithEnrollment.splice(superCampaignIndex, 1, {
        ...superCampaignsWithEnrollment[superCampaignIndex],
        enrollment
      })

      return newSuperCampaignsWithEnrollment
    })

  const handleUnenroll = (superCampaignId: UUID) =>
    setSuperCampaignsWithEnrollment(oldSuperCampaignsWithEnrollment => {
      const superCampaignIndex = superCampaignsWithEnrollment.findIndex(
        superCampaign => superCampaign.id === superCampaignId
      )

      if (superCampaignIndex === -1) {
        return oldSuperCampaignsWithEnrollment
      }

      const newSuperCampaignsWithEnrollment = [
        ...oldSuperCampaignsWithEnrollment
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
        <Grid key={superCampaignWithEnrollment.id} item sm={6}>
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
