import { OAuthProvider } from 'constants/contacts'

import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Button, Typography, Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'

import { iconSizes } from 'components/SvgIcons/icon-sizes'
import GoogleIcon from 'components/SvgIcons/Google/IconGoogle'
import CsvIcon from 'components/SvgIcons/Csv/IconCsv'
import OutlookIcon from 'components/SvgIcons/Outlook/IconOutlook'

import { useConnectOAuthAccount } from './use-connect-oauth-account'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      marginRight: {
        marginRight: theme.spacing(1)
      },
      buttonText: {
        marginLeft: theme.spacing(2),
        fontWeight: 500,
        fontFamily: 'Roboto, sans-serif',
        whiteSpace: 'nowrap'
      }
    }),
  { name: 'zeroState' }
)

export default function ImportContactsButton() {
  const classes = useStyles()
  const accounts = useSelector((state: IAppState) =>
    selectAllConnectedAccounts(state.contacts.oAuthAccounts)
  )
  const syncing = accounts.some(account => account.sync_status === 'pending')
  const google = useConnectOAuthAccount(OAuthProvider.Google)
  const outlook = useConnectOAuthAccount(OAuthProvider.Outlook)

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Button
        disabled={google.connecting || syncing}
        onClick={google.connect}
        variant="outlined"
        className={classes.marginRight}
      >
        <GoogleIcon size={iconSizes.small} />
        <Typography variant="button" className={classes.buttonText}>
          Sync with Google
        </Typography>
      </Button>
      <Button
        variant="outlined"
        onClick={outlook.connect}
        disabled={outlook.connecting}
        className={classes.marginRight}
      >
        <OutlookIcon size={iconSizes.small} />
        <Typography variant="button" className={classes.buttonText}>
          Sync with Outlook
        </Typography>
      </Button>
      <Button
        className={classes.marginRight}
        variant="outlined"
        href="/dashboard/contacts/import/csv"
      >
        <CsvIcon />
      </Button>
    </Box>
  )
}
