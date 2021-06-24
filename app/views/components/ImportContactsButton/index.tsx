import React, { useEffect, useCallback, Fragment } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Link as RouterLink } from 'react-router'
import { Link, MenuItem, Typography, Grid } from '@material-ui/core'
import { useEffectOnce } from 'react-use'

import { addNotification as notify } from 'components/notification'
import { OAuthProvider } from 'constants/contacts'
import { IAppState } from 'reducers'
import { Divider } from 'components/Divider'
import PopOver from 'components/Popover'
import { getUserSettingsInActiveTeam } from 'utils/user-teams'
import { putUserSetting } from 'models/user/put-user-setting'
import { DropdownTab } from 'components/PageTabs'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'
import { iconSizes } from 'components/SvgIcons/icon-sizes'
import { useConnectOAuthAccount } from 'hooks/use-connect-oauth-account'
import GoogleIcon from 'components/SvgIcons/Google/IconGoogle'
import CsvIcon from 'components/SvgIcons/Csv/IconCsv'
import OutlookIcon from 'components/SvgIcons/Outlook/IconOutlook'
import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'

import { ConnectedAccount } from './ConnectedAccount'
import { useStyles } from './styles'

export const IMPORT_TOOLTIP_VISITED_SETTINGS_KEY = 'import_tooltip_visited'

const TOOLTIP_WIDTH = 150

interface Props {
  accounts: IOAuthAccount[]
  user: IUser
  onFetchedOAuthAccounts?: () => void
  hasCSVButton?: boolean
  tooltip?: string
}

export function ImportContactsButton({
  accounts,
  user,
  onFetchedOAuthAccounts,
  hasCSVButton = false,
  tooltip = 'Connect to Google or Outlook'
}: Props) {
  const dispatch = useDispatch()
  const classes = useStyles()

  const isTooltipOpen =
    !getUserSettingsInActiveTeam(user, IMPORT_TOOLTIP_VISITED_SETTINGS_KEY) &&
    accounts.length === 0

  useEffect(() => {
    if (isTooltipOpen) {
      putUserSetting(IMPORT_TOOLTIP_VISITED_SETTINGS_KEY, '1')
    }
  }, [isTooltipOpen])

  const google = useConnectOAuthAccount(OAuthProvider.Google)
  const outlook = useConnectOAuthAccount(OAuthProvider.Outlook)

  const handleGoogleConnect = () => {
    if (google.connecting) {
      return dispatch(
        notify({
          message: `a sync process has already been requested,
 please wait till getting finishes.`,
          status: 'info'
        })
      )
    }

    google.connect()
  }

  useEffectOnce(() => {
    async function fetch() {
      await dispatch(fetchOAuthAccounts())

      if (typeof onFetchedOAuthAccounts === 'function') {
        onFetchedOAuthAccounts()
      }
    }

    fetch()
  })

  const renderButton = React.useMemo(
    () => (
      <PopOver
        placement="bottom"
        dark
        width={TOOLTIP_WIDTH}
        show={isTooltipOpen}
        className={classes.popover}
        caption={<p>{tooltip}</p>}
      >
        <Grid container justify="center">
          <GoogleIcon size={iconSizes.medium} className={classes.buttonIcon} />
          <OutlookIcon size={iconSizes.medium} className={classes.buttonIcon} />
          {hasCSVButton && (
            <CsvIcon className={classes.buttonIcon} size={iconSizes.medium} />
          )}
        </Grid>
      </PopOver>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isTooltipOpen, classes]
  )

  const renderConnectedAccounts = useCallback(
    (toggleMenu: () => void) => (
      <>
        {accounts.length > 0 && (
          <Typography
            className={classes.accountsSectionTitle}
            variant="body2"
            color="textSecondary"
          >
            Connected Accounts
          </Typography>
        )}
        {accounts.map((account, index) => (
          <Fragment key={account.id}>
            <MenuItem>
              <Link
                component={RouterLink}
                onClick={() => {
                  toggleMenu()
                }}
                to="/dashboard/account/connected-accounts"
                color="inherit"
                underline="none"
                className={classes.fullWidth}
              >
                <ConnectedAccount account={account} />
              </Link>
            </MenuItem>
            {index !== accounts.length - 1 && <Divider />}
          </Fragment>
        ))}
        {accounts.length > 0 && <Divider />}
      </>
    ),
    [accounts, classes]
  )

  return (
    <DropdownTab
      buttonClassName={classes.button}
      buttonVariant="outlined"
      title={renderButton}
    >
      {({ toggleMenu }) => (
        <>
          {renderConnectedAccounts(toggleMenu)}
          <MenuItem
            onClick={() => {
              handleGoogleConnect()
              toggleMenu()
            }}
            disabled={google.connecting}
          >
            <Grid container className={classes.listItem}>
              <GoogleIcon
                size={iconSizes.medium}
                className={classes.listIcon}
              />
              Connect to Google
            </Grid>
          </MenuItem>
          <MenuItem
            onClick={() => {
              outlook.connect()
              toggleMenu()
            }}
            disabled={outlook.connecting}
          >
            <Grid container className={classes.listItem}>
              <OutlookIcon
                size={iconSizes.medium}
                className={classes.listIcon}
              />
              Connect to Outlook
            </Grid>
          </MenuItem>

          {hasCSVButton && (
            <>
              <Divider />
              <MenuItem
                component={RouterLink}
                onClick={() => {
                  toggleMenu()
                }}
                to="/dashboard/contacts/import/csv"
              >
                <Grid container className={classes.listItem}>
                  <CsvIcon
                    size={iconSizes.medium}
                    className={classes.listIcon}
                  />
                  Import from CSV
                </Grid>
              </MenuItem>
            </>
          )}
        </>
      )}
    </DropdownTab>
  )
}

function mapStateToProps(state: IAppState) {
  return {
    accounts: selectAllConnectedAccounts(state.contacts.oAuthAccounts),
    user: state.user
  }
}

export default connect(mapStateToProps)(ImportContactsButton)
