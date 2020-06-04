import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link as RouterLink } from 'react-router'
import { Link, MenuItem } from '@material-ui/core'
import Flex from 'styled-flex-component'

import { OAuthProvider } from 'constants/contacts'

import SplitButton from 'components/SplitButton'
import { IAppState } from 'reducers'
import { Divider } from 'components/Divider'
import PopOver from 'components/Popover'
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
  const syncing = accounts.some(account => account.sync_status === 'pending')

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

  return (
    <SplitButton
      popperPlacement="bottom-end"
      disabled={google.connecting || syncing}
      onClick={google.connect}
      style={{ zIndex: 2 }}
      size="large"
      renderMenu={() => (
        <>
          <MenuItem onClick={outlook.connect} disabled={outlook.connecting}>
            <OutlookIcon /> Import Outlook contacts
          </MenuItem>
          <MenuItem
            component={RouterLink}
            style={{ color: 'currentColor' }}
            to="/dashboard/contacts/import/csv"
          >
            <CsvIcon /> Import from CSV Spreadsheet
          </MenuItem>
          {accounts.length > 0 && <Divider />}
          {accounts.map(account => (
            <MenuItem key={account.id}>
              <Link
                component={RouterLink}
                to="/dashboard/account/connected-accounts"
                color="inherit"
                underline="none"
              >
                <ConnectedAccount account={account} />
              </Link>
            </MenuItem>
          ))}
        </>
      )}
    >
      {/* PopOver is used here instead of tooltip, because control over showing it initially is required */}
      <PopOver
        placement="bottom"
        show={isTooltipOpen}
        popoverStyles={{ width: '350px', marginTop: '1.5rem' }}
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
          <ButtonText>Sync with: Google</ButtonText>
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
