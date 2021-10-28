import { Box } from '@material-ui/core'

import { useIsSuperCampaignResultMode } from '../../hooks/use-is-super-campaign-result-mode'
import SuperCampaignCard from '../SuperCampaignCard'
import SuperCampaignCardHeader from '../SuperCampaignCardHeader'
import { useSuperCampaignDetail } from '../SuperCampaignDetailProvider'

import SuperCampaignEnrolledParticipantsTags from './SuperCampaignEnrolledParticipantsTags'
import SuperCampaignEnrollmentList from './SuperCampaignEnrollmentList'
import { useUpdateSuperCampaignTags } from './use-update-super-campaign-tags'

function SuperCampaignEnrolledParticipants() {
  const { superCampaign, setSuperCampaign } = useSuperCampaignDetail()
  const { isSaving, updateSuperCampaignTags } = useUpdateSuperCampaignTags(
    superCampaign,
    setSuperCampaign
  )
  const isResultMode = useIsSuperCampaignResultMode(superCampaign)

  // TODO: handle Loading and EmptyState for the lists

  return (
    <SuperCampaignCard>
      <SuperCampaignCardHeader title="Enrolled Participants By Their Contacts Tags" />
      <Box pt={1}>
        <SuperCampaignEnrolledParticipantsTags
          value={superCampaign.tags}
          onChange={updateSuperCampaignTags}
          disabled={isSaving}
          readOnly={isResultMode}
          helperText={
            !isResultMode
              ? 'XXX agents added by tags you’ve entered.' // TODO: Use the real agent count here
              : undefined
          }
        />
      </Box>
      {isResultMode ? (
        <>results mode</>
      ) : (
        <Box mt={2}>
          <SuperCampaignEnrollmentList superCampaignId={superCampaign.id} />
        </Box>
      )}
    </SuperCampaignCard>
  )
}

export default SuperCampaignEnrolledParticipants
