import { makeStyles } from '@material-ui/core'
import pluralize from 'pluralize'

import { useIsSuperCampaignExecuted } from '../../hooks/use-is-super-campaign-executed'
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

  const isSuperCampaignExecuted = useIsSuperCampaignExecuted(superCampaign)

  const {
    superCampaignEnrollments,
    setSuperCampaignEnrollments,
    isLoading,
    enrolledAgentCount
  } = useGetSuperCampaignEnrollments(
    superCampaign.id,
    superCampaign.tags,
    isSuperCampaignExecuted
  )

  const addSuperCampaignEnrollment = useAddSuperCampaignEnrollment(
    superCampaign.id,
    setSuperCampaignEnrollments
  )

  return (
    <SuperCampaignCard>
      {isSuperCampaignExecuted ? (
        <SuperCampaignResultList
          isLoading={isLoading}
          superCampaignResults={
            superCampaignEnrollments as ISuperCampaignEnrollment<'user_and_brand_and_campaign'>[]
          }
        />
      ) : (
        <>
          <SuperCampaignEnrollManuallyButton
            className={classes.manualAdd}
            superCampaignId={superCampaign.id}
            superCampaignTags={superCampaign.tags}
            onEnroll={addSuperCampaignEnrollment}
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
              superCampaignEnrollments as ISuperCampaignEnrollment<'user_and_brand'>[]
            }
            setSuperCampaignEnrollments={setSuperCampaignEnrollments}
          />
        </>
      )}
    </SuperCampaignCard>
  )
}

export default SuperCampaignEnrollmentsCard
