import {
  Typography,
  FormControlLabel,
  RadioGroup,
  makeStyles,
  Radio
} from '@material-ui/core'
import { useDispatch } from 'react-redux'

import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'
import { useRunActionThenNotify } from '@app/hooks/use-run-action-then-notify'
import { setActiveTeamSetting } from '@app/store_actions/active-team'
import { getSettingFromTeam } from '@app/utils/user-teams'

const SUPER_CAMPAIGN_ADMIN_PERMISSION = 'super_campaign_admin_permission'

const useStyles = makeStyles(
  theme => ({
    title: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2)
    },
    text: { padding: theme.spacing(0.5, 0, 0, 3.5) },
    link: { marginLeft: theme.spacing(0.5) }
  }),
  { name: 'Campaigns' }
)

function Campaigns() {
  const classes = useStyles()
  const activeTeam = useUnsafeActiveTeam()
  const dispatch = useDispatch()
  const { isRunning, runActionThenNotify } = useRunActionThenNotify()

  const superCampaignAdminPermission = getSettingFromTeam(
    activeTeam,
    SUPER_CAMPAIGN_ADMIN_PERMISSION
  )

  const handleChange = async (_: unknown, value: string) => {
    runActionThenNotify(
      async () => {
        await dispatch(
          setActiveTeamSetting(SUPER_CAMPAIGN_ADMIN_PERMISSION, value === 'yes')
        )
      },
      'Campaigns enrollment has been saved',
      'Could not save campaigns enrollment'
    )
  }

  return (
    <>
      <Typography className={classes.title} variant="subtitle1">
        Admin Access
      </Typography>
      <RadioGroup
        aria-label="Admin Access"
        name="admin-access"
        value={superCampaignAdminPermission ? 'yes' : 'no'}
        onChange={handleChange}
      >
        <FormControlLabel
          value="yes"
          control={<Radio color="primary" />}
          label={
            <>
              Allow admin to send campaigns on my behalf using my tags.
              {/* TODO: Uncomment this when the doc link provided by Sahar */}
              {/* <Link
                className={classes.link}
                color="primary"
                href="#"
                target="_blank"
              >
                Learn More...
              </Link> */}
            </>
          }
          disabled={isRunning}
        />
        <FormControlLabel
          value="no"
          control={<Radio color="primary" />}
          label="Let me choose which campaigns I'd like to join."
          disabled={isRunning}
        />
      </RadioGroup>
    </>
  )
}

export default Campaigns
