import { OAuthProvider } from 'constants/contacts'

import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Button, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

import { IAppState } from 'reducers'

import IconCsv from 'components/SvgIcons/Csv/IconCsv'
import IconOutlook from 'components/SvgIcons/Outlook/IconOutlook'
import GoogleSigninButton from 'components/GoogleSigninButton'

import { useConnectOAuthAccount } from 'hooks/use-connect-oauth-account'

import Header from '../Header'
import SkipButton from '../SkipButton'
import NextButton from '../NextButton'
import Container from '../Container'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      container: {
        maxWidth: '784px'
      },
      marginBottom: {
        marginBottom: theme.spacing(2)
      },
      buttonText: {
        marginLeft: theme.spacing(2)
      }
    }),
  { name: 'OAuthAccounts' }
)

export function OAuthAccounts() {
  const classes = useStyles()
  const brand = useSelector((store: IAppState) => store.brand)
  const google = useConnectOAuthAccount(OAuthProvider.Google)
  const outlook = useConnectOAuthAccount(OAuthProvider.Outlook)

  return (
    <Container classes={{ box: classes.container }}>
      <SkipButton to="/onboarding/profile" />
      <Header
        brand={brand}
        title="Be Connected"
        subtitle="To get the best experience select the accounts you would like to connect"
      />
      <Box marginBottom={6}>
        <Box
          mb={1.5}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <GoogleSigninButton
            disabled={google.connecting}
            onClick={google.connect}
            size="large"
          >
            Sign in with google
          </GoogleSigninButton>

          <Button
            disabled={outlook.connecting}
            onClick={outlook.connect}
            variant="outlined"
            size="large"
          >
            <IconOutlook />
            <Typography variant="button" className={classes.buttonText}>
              Sync with Outlook
            </Typography>
          </Button>
        </Box>

        <Button
          fullWidth
          size="large"
          variant="outlined"
          href="/dashboard/contacts/import/csv"
        >
          <IconCsv />
          <Typography variant="button" className={classes.buttonText}>
            Import CSV spreadsheet
          </Typography>
        </Button>
      </Box>
      <NextButton to="/onboarding/profile" />
    </Container>
  )
}
