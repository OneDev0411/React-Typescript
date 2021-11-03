import { Button } from '@material-ui/core'
import { mdiPlus } from '@mdi/js'

import useSafeState from '@app/hooks/use-safe-state'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { Agent } from '@app/views/components/TeamAgents/types'
import { TeamAgentsDrawer } from '@app/views/components/TeamAgentsDrawer'

interface SuperCampaignEnrollManuallyButtonProps {
  superCampaign: ISuperCampaign<'template_instance'>
  onEnroll: (data: ISuperCampaignEnrollmentInput[]) => Promise<void>
}

function SuperCampaignEnrollManuallyButton({
  superCampaign,
  onEnroll
}: SuperCampaignEnrollManuallyButtonProps) {
  const [isSaving, setIsSaving] = useSafeState(false)

  const [isTeamAgentsDrawerOpen, setIsTeamAgentsDrawerOpen] =
    useSafeState(false)

  const handleOpenTeamAgentsDrawer = () => setIsTeamAgentsDrawerOpen(true)
  const handleCloseTeamAgentsDrawer = () => setIsTeamAgentsDrawerOpen(false)

  const handleEnroll = async (agents: Agent[]) => {
    try {
      const enrollments: ISuperCampaignEnrollmentInput[] = agents.map(
        ({ agent }: Agent) => ({
          user: agent.id,
          brand: agent.brand_id!,
          tags: superCampaign.tags ?? []
        })
      )

      setIsSaving(true)
      await onEnroll(enrollments)
      setIsSaving(false)
    } catch (error) {
      console.error(error)
    } finally {
      handleCloseTeamAgentsDrawer()
    }
  }

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
        />
      )}
    </>
  )
}

export default SuperCampaignEnrollManuallyButton
