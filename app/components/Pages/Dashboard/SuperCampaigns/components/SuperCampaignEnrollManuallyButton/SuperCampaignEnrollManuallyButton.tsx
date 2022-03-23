import { useCallback } from 'react'

import {
  Button,
  makeStyles,
  Typography,
  CircularProgress
} from '@material-ui/core'
import { mdiPlus } from '@mdi/js'
import classNames from 'classnames'
import pluralize from 'pluralize'

import useSafeState from '@app/hooks/use-safe-state'
import {
  getSuperCampaignEligibleAgents,
  useEnrollUserInSuperCampaign
} from '@app/models/super-campaign'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import type {
  Agent,
  NormalizedBrand
} from '@app/views/components/TeamAgents/types'
import { TeamAgentsDrawer } from '@app/views/components/TeamAgentsDrawer'

import { useSuperCampaignAvailableAgentCount } from './use-super-campaign-available-agent-count'

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
  enrolledAgentCount: number
  eligibleBrands: Nullable<string[]>
  superCampaignEnrollments: Pick<
    ISuperCampaignEnrollment<'user' | 'brand'>,
    'user' | 'brand' | 'deleted_at'
  >[]
}

function SuperCampaignEnrollManuallyButton({
  className,
  superCampaignId,
  superCampaignTags,
  enrolledAgentCount,
  eligibleBrands,
  superCampaignEnrollments
}: SuperCampaignEnrollManuallyButtonProps) {
  const classes = useStyles()

  const [isTeamAgentsDrawerOpen, setIsTeamAgentsDrawerOpen] =
    useSafeState(false)

  const handleOpenTeamAgentsDrawer = () => setIsTeamAgentsDrawerOpen(true)
  const handleCloseTeamAgentsDrawer = () => setIsTeamAgentsDrawerOpen(false)

  const { isLoading, mutateAsync } = useEnrollUserInSuperCampaign()

  const handleEnroll = async (agents: Agent[]) => {
    const enrollments: ISuperCampaignEnrollmentInput[] = agents.map(
      ({ agent }: Agent) => ({
        user: agent.id,
        brand: agent.brand_id!,
        tags: superCampaignTags ?? []
      })
    )

    await mutateAsync({ superCampaignId, enrollments })
    handleCloseTeamAgentsDrawer()
  }

  const teamAgentsModelFn = useCallback(
    async () => getSuperCampaignEligibleAgents(superCampaignId),
    [superCampaignId]
  )

  const availableAgentCount = useSuperCampaignAvailableAgentCount(
    teamAgentsModelFn,
    enrolledAgentCount,
    eligibleBrands,
    superCampaignTags
  )

  // Remove the enrolled people from the teams
  const filterTeamsFn = useCallback(
    (teams: NormalizedBrand[]) => {
      const availableEnrollments = superCampaignEnrollments.filter(
        enrollment => !enrollment.deleted_at
      )

      return teams.map(team => ({
        ...team,
        users: team.users.filter(
          user =>
            !availableEnrollments.find(
              enrollment =>
                enrollment.user.id === user.id &&
                enrollment.brand.id === team.id
            )
        )
      }))
    },
    [superCampaignEnrollments]
  )

  if (availableAgentCount < 1) {
    return null
  }

  return (
    <>
      <div className={classNames(classes.root, className)}>
        {
          <Typography variant="body2">
            {pluralize('user', availableAgentCount, true)} did not meet the
            criteria to enroll in this campaign.
            {/* TODO: Uncomment this when the doc link provided by Sahar */}
            {/* <Link
              className={classes.link}
              color="primary"
              href="#"
              target="_blank"
              rel="noopener"
            >
              Learn More
            </Link> */}
          </Typography>
        }
        <Button
          color="primary"
          startIcon={
            isLoading ? (
              <CircularProgress color="inherit" size={muiIconSizes.small} />
            ) : (
              <SvgIcon path={mdiPlus} size={muiIconSizes.small} />
            )
          }
          size="small"
          onClick={handleOpenTeamAgentsDrawer}
          disabled={isLoading}
        >
          Add
        </Button>
      </div>
      {isTeamAgentsDrawerOpen && !isLoading && (
        <TeamAgentsDrawer
          open
          isPrimaryAgent
          multiSelection
          title="Enroll Participants"
          withRelatedContacts={false}
          onSelectAgents={handleEnroll}
          onClose={handleCloseTeamAgentsDrawer}
          teamAgentsModelFn={teamAgentsModelFn}
          filterTeamsFn={filterTeamsFn}
        />
      )}
    </>
  )
}

export default SuperCampaignEnrollManuallyButton
