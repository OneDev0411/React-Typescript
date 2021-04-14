import React, { useEffect, Fragment } from 'react'
import { connect, useDispatch } from 'react-redux'

import { Link as RouterLink } from 'react-router'
import { Link, MenuItem, Box } from '@material-ui/core'
import Flex from 'styled-flex-component'
import { mdiFileDelimitedOutline } from '@mdi/js'

import { addNotification as notify } from 'components/notification'

import { OAuthProvider } from 'constants/contacts'

import SplitButton from 'components/SplitButton'
import { IAppState } from 'reducers'
import { Divider } from 'components/Divider'
import PopOver from 'components/Popover'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { getUserSettingsInActiveTeam } from 'utils/user-teams'
import { putUserSetting } from 'models/user/put-user-setting'

import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'

import { iconSizes } from 'components/SvgIcons/icon-sizes'

import { useConnectOAuthAccount } from 'hooks/use-connect-oauth-account'

import { ConnectedAccount } from './ConnectedAccount'
import { IMPORT_TOOLTIP_VISITED_SETTINGS_KEY } from '../constants'
import { CsvIcon, GoogleIcon, ButtonText, OutlookIcon } from './styled'

interface Props {
  accounts: IOAuthAccount[]
  user: IUser
}

/**
 * Import split button, used in contacts list header
 * @param accounts
 * @param user
 * @constructor
 */
export function ImportContactsButton({ accounts, user }: Props) {
  const dispatch = useDispatch()

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
          message:
            'a sync process has already been requested, please wait till getting finishes.',
          status: 'info'
        })
      )
    }

    google.connect()
  }

  return (
    <SplitButton
      popperPlacement="bottom-end"
      onClick={handleGoogleConnect}
      style={{ zIndex: 2 }}
      size="large"
      RenderMenu={() => (
        <>
          <MenuItem onClick={outlook.connect} disabled={outlook.connecting}>
            <Box paddingTop={1} paddingBottom={0.5}>
              <OutlookIcon />
              Import Outlook Contacts
            </Box>
          </MenuItem>
          <MenuItem
            component={RouterLink}
            style={{ color: 'currentColor' }}
            to="/dashboard/contacts/import/csv"
          >
            <Box paddingTop={0.5} paddingBottom={1}>
              <SvgIcon
                path={mdiFileDelimitedOutline}
                style={{ verticalAlign: 'middle', marginRight: '1rem' }}
              />
              Import CSV Spreadsheet
            </Box>
          </MenuItem>
          {accounts.length > 0 && <Divider />}
          {accounts.map((account, index) => (
            <Fragment key={account.id}>
              <MenuItem>
                <Link
                  component={RouterLink}
                  to="/dashboard/account/connected-accounts"
                  color="inherit"
                  underline="none"
                  style={{ width: '100%' }}
                >
                  <ConnectedAccount account={account} />
                </Link>
              </MenuItem>
              {index !== accounts.length - 1 && <Divider />}
            </Fragment>
          ))}
        </>
      )}
    >
      {/* PopOver is used here instead of tooltip, because control over showing it initially is required */}
      <PopOver
        placement="bottom"
        show={isTooltipOpen}
        width={350}
        caption={
          <div>
            <div style={{ marginTop: '0.5rem' }}>
              <GoogleIcon style={{ margin: '0 1rem 0 0' }} />
              <OutlookIcon style={{ margin: '0 1rem 0 0' }} />
              <CsvIcon />
            </div>
            <div>
              <div>
                <h4 style={{ marginBottom: 0 }}>
                  Sync your contacts with a simple click.
                </h4>
              </div>
              Never worry, your data is always yours
            </div>
          </div>
        }
      >
        <Flex alignCenter>
          <GoogleIcon size={iconSizes.small} />
          <ButtonText>
            {google.connecting
              ? 'Syncing with Google ...'
              : 'Sync with: Google'}
          </ButtonText>
        </Flex>
      </PopOver>
    </SplitButton>
  )
}

function mapStateToProps(state: IAppState) {
  return {
    accounts: selectAllConnectedAccounts(state.contacts.oAuthAccounts),
    user: state.user
  }
}

export default connect(mapStateToProps)(ImportContactsButton)
