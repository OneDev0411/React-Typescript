import React, { useEffect } from 'react'

import { connect } from 'react-redux'

import { browserHistory } from 'react-router'

import SplitButton from 'components/SplitButton'

import { MenuItem } from 'components/Menu/MenuItem'

import ALink from 'components/ALink'

import { IAppState } from 'reducers/index'

import { Divider } from 'components/Divider'
import Tooltip from 'components/tooltip'

import PopOver from 'components/Popover'

import { getUserSettingsInActiveTeam } from 'utils/user-teams'

import { putUserSetting } from 'models/user/put-user-setting'

import Acl from 'components/Acl'
import ActionButton from 'components/Button/ActionButton'

import { CsvIcon, GoogleIcon, OutlookIcon } from './styled'
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
    <Acl
      access="BetaFeatures"
      fallback={
        <Tooltip caption="From CSV Spreadsheet" placement="bottom">
          <ActionButton
            appearance="outline"
            style={{ marginRight: '1em' }}
            onClick={() =>
              browserHistory.push('/dashboard/contacts/import/csv')
            }
          >
            Import Contacts
          </ActionButton>
        </Tooltip>
      }
    >
      <ConnectGoogleButton>
        {({ connecting, connect }) => (
          <SplitButton
            disabled={connecting || syncing}
            onClick={connect}
            style={{ marginRight: '1rem' }}
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
                >
                  <CsvIcon /> Import from CSV Spreadsheet
                </MenuItem>
                {accounts.length > 0 && <Divider />}
                {accounts.map(account => (
                  <MenuItem key={account.id}>
                    <ConnectedAccount account={account} />
                  </MenuItem>
                ))}
              </>
            )}
          >
            {/* PopOver is used here instead of tooltip, because control over showing it initially is required */}
            <PopOver
              placement="bottom"
              show={isTooltipOpen}
              dark
              popoverStyles={{ width: '350px', marginTop: '1.5rem' }}
              caption={
                <div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <GoogleIcon style={{ margin: '0 1rem 0 0' }} />
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
                <GoogleIcon size={{ width: 16, height: 16 }} /> Import Google
                Contacts
              </div>
            </PopOver>
          </SplitButton>
        )}
      </ConnectGoogleButton>
    </Acl>
  )
}

function mapStateToProps(state: IAppState) {
  return {
    accounts: Object.values(state.contacts.oAuthAccounts).flat(),
    user: state.user
  }
}

export default connect(mapStateToProps)(ImportContactsButton)
