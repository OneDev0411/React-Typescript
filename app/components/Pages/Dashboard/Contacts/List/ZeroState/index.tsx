import React from 'react'
import cn from 'classnames'
import { Box, Button, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

import { OAuthProvider } from 'constants/contacts'

import GoogleSigninButton from 'components/GoogleSigninButton'

import { Divider } from 'components/Divider'
import { CreateContact } from 'components/CreateContact'
import IconCsv from 'components/SvgIcons/Csv/IconCsv'
import IconOutlook from 'components/SvgIcons/Outlook/IconOutlook'

import { useConnectOAuthAccount } from 'hooks/use-connect-oauth-account'

interface Props {
  onCreateContact: (contact: IContact) => void
}

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
      title: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      },
      description: {
        marginBottom: theme.spacing(4)
      },
      buttonText: {
        marginLeft: theme.spacing(2)
      }
    }),
  { name: 'zeroState' }
)

export function ZeroState({ onCreateContact }: Props) {
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
      <h2 className={classes.title}>
        No contact! Import now with one click :)
      </h2>
      <Typography variant="body1" className={classes.description}>
        People and relationships are central to your business. Start building
        your referral network in Rechat by importing or creating a contact now.
      </Typography>

      <GoogleSigninButton
        disabled={google.connecting}
        onClick={google.connect}
        style={{ marginBottom: '1rem' }}
        size="large"
      >
        Sign in with Google
      </GoogleSigninButton>

      <Button
        disabled={outlook.connecting}
        onClick={outlook.connect}
        variant="outlined"
        className={classes.button}
        size="large"
      >
        <IconOutlook />
        <Typography variant="button" className={classes.buttonText}>
          Sign in with Outlook
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
        submitCallback={onCreateContact}
        buttonProps={{ className: classes.button, size: 'large' }}
      />
    </Box>
  )
}
