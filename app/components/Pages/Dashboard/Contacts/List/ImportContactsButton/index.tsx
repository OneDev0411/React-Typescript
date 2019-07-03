import React, { useEffect, useState } from 'react'

import { connect } from 'react-redux'

import SplitButton from 'components/SplitButton'

import { MenuItem } from 'components/Menu/MenuItem'

import ALink from 'components/ALink'

import { importGoogleContacts } from 'models/contacts/import-google-contacts'

import { IAppState } from 'reducers/index'

import { Divider } from 'components/Divider'

import PopOver from 'components/Popover'

import { getActiveTeamSettings } from 'utils/user-teams'

import { putUserSetting } from 'models/user/put-user-setting'

import { CsvIcon, GoogleIcon } from './styled'
import { ConnectedAccount } from './ConnectedAccount'
import { startImportingGoogleContacts } from './helpers'
import { IMPORT_TOOLTIP_VISITED_SETTINGS_KEY } from '../constants'

interface Props {
  accounts: IGoogleAccount[]
  user: IUser
}

export function ImportContactsButton({ accounts, user }: Props) {
  const [redirecting, setRedirecting] = useState(false)

  const syncing = accounts.some(account => account.sync_status === 'pending')

  const isTooltipOpen = !getActiveTeamSettings(
    user,
    IMPORT_TOOLTIP_VISITED_SETTINGS_KEY
  )

  useEffect(() => {
    if (isTooltipOpen) {
      putUserSetting(IMPORT_TOOLTIP_VISITED_SETTINGS_KEY, '1')
    }
  }, [isTooltipOpen])

  const redirectToGoogle = async () => {
    const url = (await importGoogleContacts()).url

    setRedirecting(true)

    startImportingGoogleContacts(accounts)

    window.location.href = url
  }

  return (
    <SplitButton
      disabled={redirecting || syncing}
      onClick={redirectToGoogle}
      style={{ marginRight: '1rem' }}
      renderMenu={() => (
        <>
          <MenuItem as={ALink} noStyle to="/dashboard/contacts/import/csv">
            <CsvIcon /> Import from CSV spreadsheet
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
                  Sync your contacts with one click.
                </h4>
              </div>
              Don't worry, your data is yours, we are serious about this.
            </div>
          </div>
        }
      >
        <div>
          <GoogleIcon size={{ width: 16, height: 16 }} /> Import Google Contacts
        </div>
      </PopOver>
    </SplitButton>
  )
}

function mapStateToProps(state: IAppState) {
  return {
    accounts: state.contacts.googleAccounts,
    user: state.user
  }
}

export default connect(mapStateToProps)(ImportContactsButton)
