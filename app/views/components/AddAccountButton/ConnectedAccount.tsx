import { Grid, Tooltip, IconButton } from '@material-ui/core'
import { mdiCogOutline } from '@mdi/js'

import { truncateTextFromMiddle } from '@app/utils/truncate-text-from-middle'
import { Avatar } from 'components/Avatar'
import { ConnectedAccountSyncStatus } from 'components/ConnectedAccountSyncStatus'
import { SvgIcon, muiIconSizes } from 'components/SvgIcons'

import useStyles from './styles'

interface Props {
  account: IOAuthAccount
}

export function ConnectedAccount({ account }: Props) {
  const classes = useStyles()

  return (
    <Grid container wrap="nowrap" className={classes.connectedAccount}>
      <Grid container wrap="nowrap" alignItems="center">
        <Tooltip title={account.display_name}>
          <Avatar
            className={classes.connectedAccountAvatar}
            user={account}
            alt={account.display_name}
            size="medium"
          />
        </Tooltip>
        <Grid
          container
          direction="column"
          className={classes.connectedAccountInfo}
        >
          {truncateTextFromMiddle(account.email, 25)}
          <ConnectedAccountSyncStatus
            className={classes.ConnectedAccountSyncStatus}
            variant="caption"
            account={account}
          />
        </Grid>
      </Grid>
      <Grid className={classes.listAction}>
        <Tooltip title="Settings">
          <IconButton
            edge="end"
            size="small"
            color="secondary"
            target="_blank"
            href="/dashboard/account/connected-accounts"
            onClick={e => {
              e.stopPropagation()
            }}
          >
            <SvgIcon
              className={classes.listActionIcon}
              size={muiIconSizes.small}
              path={mdiCogOutline}
            />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  )
}
