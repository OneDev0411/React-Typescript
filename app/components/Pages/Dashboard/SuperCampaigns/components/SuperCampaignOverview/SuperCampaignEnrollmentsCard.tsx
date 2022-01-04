import { makeStyles } from '@material-ui/core'
import pluralize from 'pluralize'

import { isSuperCampaignExecuted } from '../../helpers'
import SuperCampaignCard from '../SuperCampaignCard'
import SuperCampaignCardHeader from '../SuperCampaignCardHeader'
import { useSuperCampaignDetail } from '../SuperCampaignDetailProvider'
import SuperCampaignEnrollManuallyButton from '../SuperCampaignEnrollManuallyButton'

import SuperCampaignEnrollmentList from './SuperCampaignEnrollmentList'
import SuperCampaignResultList from './SuperCampaignResultList'
import { useAddSuperCampaignEnrollment } from './use-add-super-campaign-enrollment'
import { useGetSuperCampaignEnrollments } from './use-get-super-campaign-enrollments'

const useStyles = makeStyles(
  theme => ({
    manualAdd: { marginBottom: theme.spacing(3) },
    title: { marginBottom: theme.spacing(2) }
  }),
  { name: 'SuperCampaignEnrollmentsCard' }
)

function SuperCampaignEnrollmentsCard() {
  const classes = useStyles()
  const { superCampaign } = useSuperCampaignDetail()

  const isExecuted = isSuperCampaignExecuted(superCampaign)

  const {
    superCampaignEnrollments,
    setSuperCampaignEnrollments,
    isLoading,
    enrolledAgentCount
  } = useGetSuperCampaignEnrollments(
    superCampaign.id,
    superCampaign.tags,
    isExecuted
  )

  const addSuperCampaignEnrollment = useAddSuperCampaignEnrollment(
    superCampaign.id,
    setSuperCampaignEnrollments
  )

  return (
    <SuperCampaignCard>
      {isExecuted ? (
        <SuperCampaignResultList
          isLoading={isLoading}
          superCampaignResults={
            superCampaignEnrollments as ISuperCampaignEnrollment<
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
            onEnroll={addSuperCampaignEnrollment}
            // I used Number.POSITIVE_INFINITY to make sure the manual button does not calculate the available
            // agent count if the enrolledAgentCount is not ready
            enrolledAgentCount={
              isLoading ? Number.POSITIVE_INFINITY : enrolledAgentCount
            }
            eligibleBrands={superCampaign.eligible_brands}
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
              superCampaignEnrollments as ISuperCampaignEnrollment<
                'user' | 'brand'
              >[]
            }
            setSuperCampaignEnrollments={setSuperCampaignEnrollments}
          />
        </>
      )}
    </SuperCampaignCard>
  )
}

export default SuperCampaignEnrollmentsCard
