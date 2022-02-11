import { useMemo } from 'react'

import { makeStyles } from '@material-ui/core'
import pluralize from 'pluralize'

import { useGetAllSuperCampaignEnrollments } from '@app/models/super-campaign'

import { isSuperCampaignExecuted } from '../../helpers'
import SuperCampaignCard from '../SuperCampaignCard'
import SuperCampaignCardHeader from '../SuperCampaignCardHeader'
import SuperCampaignEnrollManuallyButton from '../SuperCampaignEnrollManuallyButton'
import { useSuperCampaign } from '../SuperCampaignProvider'

import SuperCampaignEnrollmentList from './SuperCampaignEnrollmentList'
import SuperCampaignResultList from './SuperCampaignResultList'

const useStyles = makeStyles(
  theme => ({
    manualAdd: { marginBottom: theme.spacing(3) },
    title: { marginBottom: theme.spacing(2) }
  }),
  { name: 'SuperCampaignEnrollmentsCard' }
)

function SuperCampaignEnrollmentsCard() {
  const classes = useStyles()
  const superCampaign = useSuperCampaign()

  const isExecuted = isSuperCampaignExecuted(superCampaign)

  const { data: superCampaignEnrollments, isLoading } =
    useGetAllSuperCampaignEnrollments(superCampaign.id, isExecuted)

  const enrolledAgentCount = useMemo(
    () =>
      superCampaignEnrollments?.filter(
        superCampaignEnrollment => !superCampaignEnrollment.deleted_at
      ).length || 0,
    [superCampaignEnrollments]
  )

  return (
    <SuperCampaignCard>
      {isExecuted ? (
        <SuperCampaignResultList
          isLoading={isLoading}
          superCampaignResults={
            (superCampaignEnrollments ?? []) as ISuperCampaignEnrollment<
              'user' | 'brand' | 'campaign'
            >[]
          }
        />
      ) : (
        <>
          <SuperCampaignEnrollManuallyButton
            className={classes.manualAdd}
            superCampaignId={superCampaign.id}
            superCampaignTags={superCampaign.tags}
            // I used Number.POSITIVE_INFINITY to make sure the manual button does not calculate the available
            // agent count if the enrolledAgentCount is not ready
            enrolledAgentCount={
              isLoading ? Number.POSITIVE_INFINITY : enrolledAgentCount
            }
            eligibleBrands={superCampaign.eligible_brands}
            superCampaignEnrollments={superCampaignEnrollments ?? []}
          />
          <SuperCampaignCardHeader
            className={classes.title}
            title={`${pluralize(
              'User',
              enrolledAgentCount,
              true
            )} Enrolled to This Campaign`}
            titleVariant="body1"
          />
          <SuperCampaignEnrollmentList
            isLoading={isLoading}
            superCampaignEnrollments={
              (superCampaignEnrollments ?? []) as ISuperCampaignEnrollment<
                'user' | 'brand'
              >[]
            }
          />
        </>
      )}
    </SuperCampaignCard>
  )
}

export default SuperCampaignEnrollmentsCard
