import { Box } from '@material-ui/core'
import pluralize from 'pluralize'

import { useIsSuperCampaignExecuted } from '../../hooks/use-is-super-campaign-executed'
import { useIsSuperCampaignReadOnly } from '../../hooks/use-is-super-campaign-read-only'
import SuperCampaignCard from '../SuperCampaignCard'
import SuperCampaignCardHeader from '../SuperCampaignCardHeader'
import { useSuperCampaignDetail } from '../SuperCampaignDetailProvider'

import SuperCampaignEnrolledParticipantsTags from './SuperCampaignEnrolledParticipantsTags'
import SuperCampaignEnrollmentList from './SuperCampaignEnrollmentList'
import SuperCampaignResultList from './SuperCampaignResultList'
import { useGetSuperCampaignEnrollments } from './use-get-super-campaign-enrollments'
import { useUpdateSuperCampaignTags } from './use-update-super-campaign-tags'

function SuperCampaignEnrolledParticipants() {
  const { superCampaign, setSuperCampaign } = useSuperCampaignDetail()
  const { isSaving, updateSuperCampaignTags } = useUpdateSuperCampaignTags(
    superCampaign,
    setSuperCampaign
  )
  const isSuperCampaignExecuted = useIsSuperCampaignExecuted(superCampaign)
  const isSuperCampaignReadOnly = useIsSuperCampaignReadOnly(superCampaign)

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

  return (
    <SuperCampaignCard>
      <SuperCampaignCardHeader title="Enrolled Participants By Their Contacts Tags" />
      <Box pt={1}>
        <SuperCampaignEnrolledParticipantsTags
          value={superCampaign.tags}
          onChange={updateSuperCampaignTags}
          disabled={isSaving}
          readOnly={isSuperCampaignReadOnly}
          helperText={
            !isSuperCampaignReadOnly && enrolledAgentCount
              ? `${pluralize(
                  'agent',
                  enrolledAgentCount,
                  true
                )} added by tags you’ve entered.`
              : undefined
          }
        />
      </Box>
      <Box mt={3}>
        {isSuperCampaignExecuted ? (
          <SuperCampaignResultList
            isLoading={isLoading}
            superCampaignResults={
              superCampaignEnrollments as ISuperCampaignEnrollment<'user_and_brand_and_campaign'>[]
            }
          />
        ) : (
          <SuperCampaignEnrollmentList
            isLoading={isLoading}
            superCampaignEnrollments={
              superCampaignEnrollments as ISuperCampaignEnrollment<'user_and_brand'>[]
            }
            setSuperCampaignEnrollments={setSuperCampaignEnrollments}
          />
        )}
      </Box>
    </SuperCampaignCard>
  )
}

export default SuperCampaignEnrolledParticipants
