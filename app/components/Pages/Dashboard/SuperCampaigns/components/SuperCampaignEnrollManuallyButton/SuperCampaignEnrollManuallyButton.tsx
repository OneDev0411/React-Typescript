import { useCallback } from 'react'

import { Button } from '@material-ui/core'
import { mdiPlus } from '@mdi/js'

import useSafeState from '@app/hooks/use-safe-state'
import getSuperCampaignEligibleAgents from '@app/models/super-campaign/get-super-campaign-eligible-agents'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { Agent } from '@app/views/components/TeamAgents/types'
import { TeamAgentsDrawer } from '@app/views/components/TeamAgentsDrawer'

interface SuperCampaignEnrollManuallyButtonProps {
  superCampaignId: UUID
  superCampaignTags: ISuperCampaign<'template_instance'>['tags']
  onEnroll: (data: ISuperCampaignEnrollmentInput[]) => Promise<void>
}

function SuperCampaignEnrollManuallyButton({
  superCampaignId,
  superCampaignTags,
  onEnroll
}: SuperCampaignEnrollManuallyButtonProps) {
  const [isSaving, setIsSaving] = useSafeState(false)

  const [isTeamAgentsDrawerOpen, setIsTeamAgentsDrawerOpen] =
    useSafeState(false)

  const handleOpenTeamAgentsDrawer = () => setIsTeamAgentsDrawerOpen(true)
  const handleCloseTeamAgentsDrawer = () => setIsTeamAgentsDrawerOpen(false)

  const handleEnroll = async (agents: Agent[]) => {
    const enrollments: ISuperCampaignEnrollmentInput[] = agents.map(
      ({ agent }: Agent) => ({
        user: agent.id,
        brand: agent.brand_id!,
        tags: superCampaignTags ?? []
      })
    )

    setIsSaving(true)
    await onEnroll(enrollments)
    setIsSaving(false)
    handleCloseTeamAgentsDrawer()
  }

  const teamAgentsModelFn = useCallback(
    async () => getSuperCampaignEligibleAgents(superCampaignId),
    [superCampaignId]
  )

  return (
    <>
      <Button
        color="primary"
        startIcon={<SvgIcon path={mdiPlus} size={muiIconSizes.small} />}
        size="small"
        onClick={handleOpenTeamAgentsDrawer}
        disabled={isSaving}
      >
        Enroll Participants Manually
      </Button>
      {isTeamAgentsDrawerOpen && (
        <TeamAgentsDrawer
          isPrimaryAgent
          multiSelection
          title="Enroll Participants"
          withRelatedContacts={false}
          onSelectAgents={handleEnroll}
          onClose={handleCloseTeamAgentsDrawer}
          teamAgentsModelFn={teamAgentsModelFn}
        />
      )}
    </>
  )
}

export default SuperCampaignEnrollManuallyButton
