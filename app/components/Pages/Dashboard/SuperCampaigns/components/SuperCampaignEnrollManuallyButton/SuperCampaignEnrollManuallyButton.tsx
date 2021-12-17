import { useCallback } from 'react'

import { Button, makeStyles, Typography, Link } from '@material-ui/core'
import { mdiPlus } from '@mdi/js'
import classNames from 'classnames'

import useSafeState from '@app/hooks/use-safe-state'
import getSuperCampaignEligibleAgents from '@app/models/super-campaign/get-super-campaign-eligible-agents'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { Agent } from '@app/views/components/TeamAgents/types'
import { TeamAgentsDrawer } from '@app/views/components/TeamAgentsDrawer'

const useStyles = makeStyles(
  theme => ({
    root: {
      backgroundColor: theme.palette.warning.ultralight,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: theme.spacing(7),
      padding: theme.spacing(0, 2),
      borderRadius: theme.shape.borderRadius
    },
    link: { marginLeft: theme.spacing(0.5) }
  }),
  { name: 'SuperCampaignEnrollManuallyButton' }
)

interface SuperCampaignEnrollManuallyButtonProps {
  className: string
  superCampaignId: UUID
  superCampaignTags: ISuperCampaign<'template_instance'>['tags']
  onEnroll: (data: ISuperCampaignEnrollmentInput[]) => Promise<void>
}

function SuperCampaignEnrollManuallyButton({
  className,
  superCampaignId,
  superCampaignTags,
  onEnroll
}: SuperCampaignEnrollManuallyButtonProps) {
  const classes = useStyles()
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
      <div className={classNames(classes.root, className)}>
        <Typography variant="body2">
          {/* TODO: Use the real user`s count instead of the Some word below. */}
          Some users did not meet the criteria to enroll in this campaign.
          {/* TODO: Fix the link below */}
          <Link
            className={classes.link}
            color="primary"
            href="#"
            target="_blank"
            rel="noopener"
          >
            Learn More
          </Link>
        </Typography>
        <Button
          color="primary"
          startIcon={<SvgIcon path={mdiPlus} size={muiIconSizes.small} />}
          size="small"
          onClick={handleOpenTeamAgentsDrawer}
          disabled={isSaving}
        >
          Add
        </Button>
      </div>
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
