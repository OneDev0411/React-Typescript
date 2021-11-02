import { Button } from '@material-ui/core'
import { mdiPlus } from '@mdi/js'

import useSafeState from '@app/hooks/use-safe-state'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { Agent } from '@app/views/components/TeamAgents/types'
import { TeamAgentsDrawer } from '@app/views/components/TeamAgentsDrawer'

import { SuperCampaignEnrollmentInput } from '../../types'

import { SelectTagForSelectedAgentDrawer } from './components/SelectTagForSelectedAgentDrawer'

interface SuperCampaignEnrollManuallyButtonProps {
  superCampaignId: UUID
  onEnroll: (data: SuperCampaignEnrollmentInput) => Promise<void>
}

function SuperCampaignEnrollManuallyButton({
  superCampaignId,
  onEnroll
}: SuperCampaignEnrollManuallyButtonProps) {
  const [selectedAgents, setSelectedAgents] = useSafeState<Agent[]>([])
  const [isSaving, setIsSaving] = useSafeState(false)

  const [isTeamAgentsDrawerOpen, setIsTeamAgentsDrawerOpen] =
    useSafeState(false)
  const [isTagSelectorOpen, setIsTagSelectorOpen] = useSafeState(false)

  const handleOpenTeamAgentsDrawer = () => setIsTeamAgentsDrawerOpen(true)
  const handleCloseTeamAgentsDrawer = () => setIsTeamAgentsDrawerOpen(false)

  const handleOpenTagSelectorDrawer = () => setIsTagSelectorOpen(true)
  const handleCloseTagSelectorDrawer = () => setIsTagSelectorOpen(false)

  const handleSelectAgennt = (agent: Agent[]) => {
    setSelectedAgents(agent)
    handleOpenTagSelectorDrawer()
  }

  // TODO: Implement the required logic and use this function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEnroll = async (/* data: SuperCampaignEnrollmentInput */) => {
    console.log({ selectedAgents })
    handleCloseTagSelectorDrawer()
    handleCloseTeamAgentsDrawer()
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
          multiSelection
          title="Enroll Participants"
          withRelatedContacts={false}
          onSelectAgents={handleSelectAgennt}
          onClose={handleCloseTeamAgentsDrawer}
        />
      )}
      <SelectTagForSelectedAgentDrawer
        open={isTagSelectorOpen && selectedAgents.length > 0}
        onClose={handleCloseTagSelectorDrawer}
        isAdding={isSaving}
        onBack={handleCloseTagSelectorDrawer}
        onAdd={handleEnroll}
      />
    </>
  )
}

export default SuperCampaignEnrollManuallyButton
