import { useEffect, useCallback, useMemo, Fragment } from 'react'

import {
  Link,
  MenuItem,
  Typography,
  Grid,
  useTheme,
  Theme
} from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { Link as RouterLink } from 'react-router'
import { useEffectOnce } from 'react-use'

import { IMPORT_TOOLTIP_VISITED_SETTINGS_KEY } from '@app/components/Pages/Dashboard/Contacts/List/constants'
import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'
import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'
import { Divider } from 'components/Divider'
import { addNotification as notify } from 'components/notification'
import { DropdownTab } from 'components/PageTabs'
import PopOver from 'components/Popover'
import CsvIcon from 'components/SvgIcons/Csv/IconCsv'
import GoogleIcon from 'components/SvgIcons/Google/IconGoogle'
import { iconSizes } from 'components/SvgIcons/icon-sizes'
import OutlookIcon from 'components/SvgIcons/Outlook/IconOutlook'
import { OAuthProvider } from 'constants/contacts'
import { useConnectOAuthAccount } from 'hooks/use-connect-oauth-account'
import { putUserSetting } from 'models/user/put-user-setting'
import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'
import { getSettingFromTeam } from 'utils/user-teams'

import { ConnectedAccount } from './ConnectedAccount'
import { useStyles } from './styles'

const TOOLTIP_WIDTH = 150

interface Props {
  onFetchedOAuthAccounts?: () => void
  hasCSVButton?: boolean
  tooltip?: string
}

export function ImportContactsButton({
  onFetchedOAuthAccounts,
  hasCSVButton = false,
  tooltip = 'Connect to Google or Outlook'
}: Props) {
  const theme = useTheme<Theme>()
  const dispatch = useDispatch()
  const activeTeam = useUnsafeActiveTeam()
  const accounts: IOAuthAccount[] = useSelector((state: IAppState) =>
    selectAllConnectedAccounts(state.contacts.oAuthAccounts)
  )
  const classes = useStyles()

  const isTooltipOpen =
    !getSettingFromTeam(activeTeam, IMPORT_TOOLTIP_VISITED_SETTINGS_KEY) &&
    accounts.length === 0

  useEffect(() => {
    if (isTooltipOpen) {
      putUserSetting(IMPORT_TOOLTIP_VISITED_SETTINGS_KEY, true)
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

  const renderButton = useMemo(
    () => (
      <PopOver
        placement="bottom"
        dark
        width={TOOLTIP_WIDTH}
        show={isTooltipOpen}
        className={classes.popover}
        caption={<p>{tooltip}</p>}
      >
        <Grid container justifyContent="center">
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
      popoverOptions={{
        style: { zIndex: theme.zIndex.modal }
      }}
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
                className={classes.menuCSVItem}
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

export default ImportContactsButton
