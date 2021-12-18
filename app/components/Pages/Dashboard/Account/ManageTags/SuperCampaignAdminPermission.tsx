import {
  Switch,
  Typography,
  FormControlLabel,
  Link,
  makeStyles,
  alpha
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'

import useNotify from '@app/hooks/use-notify'
import useSafeState from '@app/hooks/use-safe-state'
import { selectUserSettingsInActiveTeam } from '@app/selectors/user'
import { setUserSetting } from 'actions/user/set-setting'

const SUPER_CAMPAIGN_ADMIN_PERMISSION = 'super_campaign_admin_permission'

const useStyles = makeStyles(
  theme => ({
    root: {
      borderBottom: `1px solid ${alpha(theme.palette.common.black, 0.12)}`,
      paddingBottom: theme.spacing(2),
      marginBottom: theme.spacing(3)
    },
    text: { padding: theme.spacing(0.5, 0, 0, 3.5) },
    link: { marginLeft: theme.spacing(0.5) }
  }),
  { name: 'SuperCampaignAdminPermission' }
)

function SuperCampaignAdminPermission() {
  const classes = useStyles()

  const dispatch = useDispatch()
  const notify = useNotify()

  const [isSaving, setIsSaving] = useSafeState(false)

  const superCampaignAdminPermission = useSelector(
    selectUserSettingsInActiveTeam
  )[SUPER_CAMPAIGN_ADMIN_PERMISSION]

  const handleChange = async (_: unknown, checked: boolean) => {
    try {
      setIsSaving(true)
      await dispatch(setUserSetting(SUPER_CAMPAIGN_ADMIN_PERMISSION, checked))
      setIsSaving(false)
      notify({
        message: 'Campaigns enrollment has been saved',
        status: 'success'
      })
    } catch (e) {
      notify({
        message: 'Could not save campaigns enrollment',
        status: 'error'
      })
    }
  }

  return (
    <div className={classes.root}>
      <FormControlLabel
        control={
          <Switch
            color="primary"
            size="small"
            onChange={handleChange}
            checked={superCampaignAdminPermission}
            disabled={isSaving}
          />
        }
        label="Campaigns Enrollment"
      />
      <Typography className={classes.text} variant="body2" component="div">
        Admin can send campaigns on my behalf using my tags.
        <Link className={classes.link} color="primary" href="#" target="_blank">
          Learn More...
        </Link>
      </Typography>
    </div>
  )
}

export default SuperCampaignAdminPermission
