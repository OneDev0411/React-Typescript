import React, { useState } from 'react'

import { connect } from 'react-redux'

import Flex from 'styled-flex-component'

import SplitButton from 'components/SplitButton'

import { MenuItem } from 'components/Menu/MenuItem'

import ALink from 'components/ALink'

import { importGoogleContacts } from 'models/contacts/import-google-contacts'

import { AppState } from 'reducers/index'
import Avatar from 'components/Avatar'

import { Divider } from 'components/Divider'

import PopOver from 'components/Popover'

import { CsvIcon, GoogleIcon } from './styled'
import { ConnectedAccount } from './ConnectedAccount'

interface Props {
  accounts: IGoogleAccount[]
}

export function ImportContactsButton({ accounts }: Props) {
  const [loading, setLoading] = useState(false)

  const redirectToGoogle = async () => {
    window.location.href = (await importGoogleContacts()).url
    setLoading(true)
  }

  return (
    <SplitButton
      disabled={loading}
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
        show /* TODO: decide about when to show initially */
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

function mapStateToProps(state: AppState) {
  return {
    accounts: state.contacts.googleAccounts
  }
}

export default connect(mapStateToProps)(ImportContactsButton)
