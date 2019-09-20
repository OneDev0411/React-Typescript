import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link as RouterLink } from 'react-router'
import { Link } from '@material-ui/core'

import SplitButton from 'components/SplitButton'
import { MenuItem } from 'components/Menu/MenuItem'
import ALink from 'components/ALink'
import { IAppState } from 'reducers/index'
import { Divider } from 'components/Divider'
import PopOver from 'components/Popover'
import { getUserSettingsInActiveTeam } from 'utils/user-teams'
import { putUserSetting } from 'models/user/put-user-setting'

import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'

import { iconSizes } from 'components/SvgIcons/icon-sizes'

import {
  CsvIcon,
  GoogleIcon,
  GoogleIconWithWhiteBg,
  OutlookIcon
} from './styled'
import { ConnectedAccount } from './ConnectedAccount'
import { IMPORT_TOOLTIP_VISITED_SETTINGS_KEY } from '../constants'
import ConnectGoogleButton from './ConnectGoogleButton'
import ConnectOutlookButton from './ConnectOutlookButton'

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

  return (
    <ConnectGoogleButton>
      {({ connecting, connect }) => (
        <SplitButton
          color="primary"
          variant="contained"
          popperPlacement="bottom-end"
          disabled={connecting || syncing}
          onClick={connect}
          style={{ marginRight: '1rem', zIndex: 2 }}
          renderMenu={() => (
            <>
              <ConnectOutlookButton>
                {({ connect, connecting }) => (
                  <MenuItem noStyle onClick={connect}>
                    <OutlookIcon /> Import Outlook contacts
                  </MenuItem>
                )}
              </ConnectOutlookButton>
              <MenuItem
                as={ALink}
                noStyle
                to="/dashboard/contacts/import/csv"
                style={{
                  height: '2.5rem',
                  display: 'block'
                }}
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
            <div>
              <GoogleIconWithWhiteBg size={iconSizes.small} /> Import Google
              Contacts
            </div>
          </PopOver>
        </SplitButton>
      )}
    </ConnectGoogleButton>
  )
}

function mapStateToProps(state: IAppState) {
  return {
    accounts: selectAllConnectedAccounts(state.contacts.oAuthAccounts),
    user: state.user
  }
}

export default connect(mapStateToProps)(ImportContactsButton)
