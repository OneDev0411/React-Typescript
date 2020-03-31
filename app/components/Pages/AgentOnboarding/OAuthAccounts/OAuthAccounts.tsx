import { OAuthProvider } from 'constants/contacts'

import React from 'react'
import cn from 'classnames'
import { useSelector } from 'react-redux'
import { Box, Typography, ButtonBase } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

import { IAppState } from 'reducers'

import IconCsv from 'components/SvgIcons/Csv/IconCsv'
import IconOutlook from 'components/SvgIcons/Outlook/IconOutlook'
import GoogleIcon from 'components/SvgIcons/Google/IconGoogle'

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
      },
      baseButton: {
        position: 'relative',
        height: theme.spacing(30),
        width: `calc(50% - ${theme.spacing(1)}px)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: `${theme.shape.borderRadius}px`,
        '& > svg': {
          width: theme.spacing(9),
          height: theme.spacing(9),
          marginBottom: theme.spacing(2)
        }
      },
      googleButton: {
        marginRight: theme.spacing(2)
      },
      csvButton: {
        height: theme.spacing(9),
        width: '100%',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: `${theme.shape.borderRadius}px`
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
      <Box marginBottom={6} width="100%">
        <Box mb={1.5} display="flex">
          <ButtonBase
            disabled={google.connecting}
            onClick={google.connect}
            className={cn(classes.baseButton, classes.googleButton)}
          >
            <GoogleIcon />
            Connect Google
          </ButtonBase>
          <ButtonBase
            disabled={outlook.connecting}
            onClick={outlook.connect}
            className={classes.baseButton}
          >
            <IconOutlook />
            Connect Outlook
          </ButtonBase>
        </Box>

        <ButtonBase
          href="/dashboard/contacts/import/csv"
          className={classes.csvButton}
        >
          <IconCsv />
          <Typography variant="button" className={classes.buttonText}>
            Import CSV spreadsheet
          </Typography>
        </ButtonBase>
      </Box>
      <NextButton to="/onboarding/profile" />
    </Container>
  )
}
