import { useTheme, Theme } from '@material-ui/core'
import { mdiPlus } from '@mdi/js'
import cn from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import { useEffectOnce } from 'react-use'

import { ADD_LEAD_CHANNEL_QUERY_PARAM_KEY } from '@app/components/Pages/Dashboard/Account/ConnectedAccounts/ConnectedLeadChannels/constants'
import { IMPORT_TOOLTIP_VISITED_SETTINGS_KEY } from '@app/components/Pages/Dashboard/Contacts/List/constants'
import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'
import { goTo } from '@app/utils/go-to'
import { SvgIcon } from '@app/views/components/SvgIcons'
import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'
import { Divider } from 'components/Divider'
import { addNotification as notify } from 'components/notification'
import { DropdownTab } from 'components/PageTabs'
import PopOver from 'components/Popover'
import CsvIcon from 'components/SvgIcons/Csv/IconCsv'
import GoogleIcon from 'components/SvgIcons/Google/IconGoogle'
import { iconSizes } from 'components/SvgIcons/icon-sizes'
import OutlookIcon from 'components/SvgIcons/Outlook/IconOutlook'
import RealtorIcon from 'components/SvgIcons/Realtor/IconRealtor'
import ZillowIcon from 'components/SvgIcons/Zillow/IconZillow'
import { OAuthProvider } from 'constants/contacts'
import { useConnectOAuthAccount } from 'hooks/use-connect-oauth-account'
import { putUserSetting } from 'models/user/put-user-setting'
import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'
import { getSettingFromTeam } from 'utils/user-teams'

import { AccountMenuItem } from './AccountMenuItem'
import { ConnectedAccounts } from './ConnectedAccounts'
import { CreateMenuItem, Props as CreateMenuItemProps } from './CreateMenuItem'
import { useStyles } from './styles'

const TOOLTIP_WIDTH = 150

interface Props {
  createMenuItemProps?: CreateMenuItemProps[]
  onFetchedOAuthAccounts?: () => void
  hasCSVButton?: boolean
  hasZillow?: boolean
  hasRealtor?: boolean
  tooltip?: string
  className?: string
}

export function AddAccountButton({
  createMenuItemProps,
  onFetchedOAuthAccounts,
  hasCSVButton = false,
  hasZillow = true,
  hasRealtor = true,
  tooltip = 'Connect to Google, Outlook, Zillow or Realtor',
  className = ''
}: Props) {
  const classes = useStyles()
  const theme = useTheme<Theme>()
  const dispatch = useDispatch()
  const activeTeam = useUnsafeActiveTeam()

  const accounts: IOAuthAccount[] = useSelector((state: IAppState) =>
    selectAllConnectedAccounts(state.contacts.oAuthAccounts)
  )
  const google = useConnectOAuthAccount(OAuthProvider.Google)
  const outlook = useConnectOAuthAccount(OAuthProvider.Outlook)

  const isTooltipOpen =
    !getSettingFromTeam(activeTeam, IMPORT_TOOLTIP_VISITED_SETTINGS_KEY) &&
    accounts.length === 0

  const handleCloseTooltip = () => {
    putUserSetting(IMPORT_TOOLTIP_VISITED_SETTINGS_KEY, true)
  }

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

  return (
    <DropdownTab
      isIconHidden
      buttonClassName={cn(classes.button, className)}
      buttonVariant="outlined"
      title={
        <PopOver
          placement="bottom"
          dark
          width={TOOLTIP_WIDTH}
          show={isTooltipOpen}
          caption={tooltip}
          onClose={handleCloseTooltip}
        >
          <SvgIcon className={classes.buttonIcon} path={mdiPlus} />
        </PopOver>
      }
      popoverOptions={{
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        style: { zIndex: theme.zIndex.modal }
      }}
    >
      {({ toggleMenu }) => (
        <div className={classes.dropdown}>
          {createMenuItemProps &&
            createMenuItemProps.map(menuItemProps => (
              <CreateMenuItem
                key={menuItemProps.title}
                title={menuItemProps.title}
                iconPath={menuItemProps.iconPath}
                onClick={() => {
                  menuItemProps.onClick()
                  toggleMenu()
                }}
              />
            ))}
          {hasCSVButton && (
            <AccountMenuItem
              onClick={() => {
                goTo('/dashboard/contacts/import/csv')
                toggleMenu()
              }}
              disabled={outlook.connecting}
              title="Import from CSV"
              tooltipTitle="Learn how to import"
              icon={
                <CsvIcon size={iconSizes.medium} className={classes.listIcon} />
              }
              helperLink="https://help.rechat.com/guides/crm/adding-contacts/importing-your-contacts"
            />
          )}
          {(hasCSVButton || createMenuItemProps) && <Divider />}
          <AccountMenuItem
            onClick={() => {
              handleGoogleConnect()
              toggleMenu()
            }}
            disabled={google.connecting}
            title="Connect to Google"
            icon={
              <GoogleIcon
                size={iconSizes.medium}
                className={classes.listIcon}
              />
            }
            helperLink="https://help.rechat.com/guides/crm/connect-to-outlook-google"
          />
          <AccountMenuItem
            onClick={() => {
              outlook.connect()
              toggleMenu()
            }}
            disabled={outlook.connecting}
            title="Connect to Outlook"
            icon={
              <OutlookIcon
                size={iconSizes.medium}
                className={classes.listIcon}
              />
            }
            helperLink="https://help.rechat.com/guides/crm/connect-to-outlook-google"
          />
          {hasZillow && (
            <AccountMenuItem
              onClick={() => {
                goTo('/dashboard/account/connected-accounts', null, {
                  [ADD_LEAD_CHANNEL_QUERY_PARAM_KEY]: 'Zillow'
                })
                toggleMenu()
              }}
              title="Connect to Zillow"
              icon={
                <ZillowIcon
                  size={iconSizes.medium}
                  className={classes.listIcon}
                />
              }
              helperLink="https://help.rechat.com/guides/crm/connect-to-zillow"
            />
          )}
          {hasRealtor && (
            <AccountMenuItem
              onClick={() => {
                goTo('/dashboard/account/connected-accounts', null, {
                  [ADD_LEAD_CHANNEL_QUERY_PARAM_KEY]: 'Realtor'
                })
                toggleMenu()
              }}
              title="Connect to Realtor"
              icon={
                <RealtorIcon
                  size={iconSizes.medium}
                  className={classes.listIcon}
                />
              }
              helperLink="https://help.rechat.com/guides/crm/connect-to-realtor"
            />
          )}
          <ConnectedAccounts
            accounts={accounts}
            onClickItems={() => {
              toggleMenu()
            }}
          />
        </div>
      )}
    </DropdownTab>
  )
}

export default AddAccountButton
