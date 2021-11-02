import { Button } from '@material-ui/core'
import { mdiPlus } from '@mdi/js'

import useSafeState from '@app/hooks/use-safe-state'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { Agent } from '@app/views/components/TeamAgents/types'
import { TeamAgentsDrawer } from '@app/views/components/TeamAgentsDrawer'

import { SuperCampaignEnrollmentInput } from '../../types'

interface SuperCampaignEnrollManuallyButtonProps {
  superCampaignId: UUID
  onEnroll: (data: SuperCampaignEnrollmentInput) => Promise<void>
}

function SuperCampaignEnrollManuallyButton({
  superCampaignId,
  onEnroll
}: SuperCampaignEnrollManuallyButtonProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSaving, setIsSaving] = useSafeState(false)

  const [isTeamAgentsDrawerOpen, setIsTeamAgentsDrawerOpen] =
    useSafeState(false)

  const handleOpenTeamAgentsDrawer = () => setIsTeamAgentsDrawerOpen(true)
  const handleCloseTeamAgentsDrawer = () => setIsTeamAgentsDrawerOpen(false)

  // TODO: Implement the required logic and use this function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEnroll = async (agents: Agent[]) => {
    console.log({ agents })
    // setIsSaving(true)
    // await onEnroll(data)
    // setIsSaving(false)
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
          // multiSelection
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
