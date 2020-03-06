import { OAuthProvider } from 'constants/contacts'

import React from 'react'
import cn from 'classnames'
import { Box, Button, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

import { Divider } from 'components/Divider'
import { CreateContact } from 'components/CreateContact'
import IconCsv from 'components/SvgIcons/Csv/IconCsv'
import IconGoogle from 'components/SvgIcons/Google/IconGoogle'
import IconOutlook from 'components/SvgIcons/Outlook/IconOutlook'

import { useConnectOAuthAccount } from '../ImportContactsButton/use-connect-oauth-account'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      container: {
        height: 'calc(100% - 120px)',
        maxWidth: '560px',
        margin: 'auto'
      },
      button: {
        width: '14.6rem'
      },
      marginBottom: {
        marginBottom: theme.spacing(2)
      },
      description: {
        marginBottom: theme.spacing(4)
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

export function ZeroState() {
  const classes = useStyles()
  const google = useConnectOAuthAccount(OAuthProvider.Google)
  const outlook = useConnectOAuthAccount(OAuthProvider.Outlook)

  return (
    <Box
      className={classes.container}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <img src="/static/images/contacts/zero-state.svg" alt="zero-state" />
      <h2>No contact! Import now with one click :)</h2>
      <Typography variant="body1" className={classes.description}>
        People and relationships are central to your business. Start building
        your referral network in Rechat by importing or creating a contact now.
      </Typography>

      <Button
        disabled={google.connecting}
        onClick={google.connect}
        variant="outlined"
        size="large"
        className={cn(classes.button, classes.marginBottom)}
      >
        <IconGoogle />
        <Typography variant="button" className={classes.buttonText}>
          Sync with: Google
        </Typography>
      </Button>

      <Button
        disabled={outlook.connecting}
        onClick={outlook.connect}
        variant="outlined"
        className={classes.button}
        size="large"
      >
        <IconOutlook />
        <Typography variant="button" className={classes.buttonText}>
          Sync with: Outlook
        </Typography>
      </Button>

      <Divider text="OR" margin="2rem 0" />

      <Button
        size="large"
        variant="outlined"
        href="/dashboard/contacts/import/csv"
        className={cn(classes.button, classes.marginBottom)}
      >
        <IconCsv />
        <Typography variant="button" className={classes.buttonText}>
          Import CSV spreadsheet
        </Typography>
      </Button>

      <CreateContact
        buttonProps={{ className: classes.button, size: 'large' }}
      />
    </Box>
  )
}
