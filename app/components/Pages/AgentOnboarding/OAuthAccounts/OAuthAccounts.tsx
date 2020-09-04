import React from 'react'
import cn from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import useEffectOnce from 'react-use/lib/useEffectOnce'
import { Box, ButtonBase, Theme, useTheme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { mdiCheckCircle } from '@mdi/js'

import { OAuthProvider } from 'constants/contacts'
import {
  GOOGLE_CREDENTIAL,
  MICROSOFT_CREDENTIAL
} from 'constants/oauth-accounts'

import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'

import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'

import { useConnectOAuthAccount } from 'hooks/use-connect-oauth-account'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { outlookIcon } from 'components/SvgIcons/icons'
import GoogleIcon from 'components/SvgIcons/Google/IconGoogle'
import CircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

import Header from '../Header'
import SkipButton from '../SkipButton'
import NextButton from '../NextButton'
import Container from '../Container'
import { useDocumentTitle } from '../use-document-title'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      maxWidth: '784px'
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

      '&:hover': {
        boxShadow: theme.shadows[3]
      }
    },
    accountIcon: {
      marginBottom: theme.spacing(2)
    },
    googleButton: {
      marginRight: theme.spacing(2)
    },
    checkIcon: {
      position: 'absolute',
      top: theme.spacing(1),
      right: theme.spacing(1),
      color: theme.palette.primary.main
    }
  }),
  { name: 'OAuthAccounts' }
)

export function OAuthAccounts() {
  useDocumentTitle('OAuth Accounts')

  const theme = useTheme()
  const classes = useStyles({})
  const dispatch = useDispatch()
  const brand = useSelector((store: IAppState) => store.brand)
  const google = useConnectOAuthAccount(OAuthProvider.Google)
  const outlook = useConnectOAuthAccount(OAuthProvider.Outlook)
  const connectedAccounts = useSelector((store: IAppState) =>
    selectAllConnectedAccounts(store.contacts.oAuthAccounts)
  )
  const isLoadingConnectedAccounts = useSelector((store: IAppState) =>
    Object.values(store.contacts.oAuthAccounts.loading).some(i => i)
  )

  useEffectOnce(() => {
    dispatch(fetchOAuthAccounts())
  })

  const isConnected = (type: IOAuthAccountTypes) => {
    return connectedAccounts.some(a => a.type === type)
  }

  const isGoogleConnected = isConnected(GOOGLE_CREDENTIAL)
  const isOutlookConnected = isConnected(MICROSOFT_CREDENTIAL)

  const accountIconSize = {
    width: theme.spacing(9),
    height: theme.spacing(9)
  }

  return (
    <Container classes={{ box: classes.container }}>
      <SkipButton to="/onboarding/profile" />
      <Header
        brand={brand}
        title="Be Connected"
        subtitle="To get the best experience select the accounts you would like to connect"
      />
      <Box marginBottom={6} width="100%" display="flex">
        <ButtonBase
          disabled={
            google.connecting || isGoogleConnected || isLoadingConnectedAccounts
          }
          onClick={google.connect}
          className={cn(classes.baseButton, classes.googleButton)}
        >
          {isGoogleConnected && (
            <SvgIcon
              path={mdiCheckCircle}
              className={classes.checkIcon}
              size={muiIconSizes.large}
            />
          )}
          <GoogleIcon className={classes.accountIcon} size={accountIconSize} />
          Connect Google
        </ButtonBase>
        <ButtonBase
          disabled={
            outlook.connecting ||
            isOutlookConnected ||
            isLoadingConnectedAccounts
          }
          onClick={outlook.connect}
          className={classes.baseButton}
        >
          {isOutlookConnected && (
            <SvgIcon
              path={mdiCheckCircle}
              className={classes.checkIcon}
              size={muiIconSizes.large}
            />
          )}
          <SvgIcon
            path={outlookIcon}
            className={classes.accountIcon}
            size="5rem"
            color={theme.palette.info.main}
          />
          Connect Outlook
        </ButtonBase>
      </Box>
      {isLoadingConnectedAccounts && <CircleSpinner />}
      {connectedAccounts.length > 0 && !isLoadingConnectedAccounts && (
        <NextButton to="/onboarding/profile" />
      )}
    </Container>
  )
}
