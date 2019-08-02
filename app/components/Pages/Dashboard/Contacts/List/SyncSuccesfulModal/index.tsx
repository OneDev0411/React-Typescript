import { OAuthProvider } from 'constants/contacts'

import React from 'react'

import BareModal from 'components/BareModal'

import ActionButton from 'components/Button/ActionButton'

import OrganizeSyncedContactsButton from '../OrganizeSyncedContactsButton'

interface Props {
  close: () => void
  provider: OAuthProvider
  handleFilterChange: (filters: IContactAttributeFilter[]) => void
}

export function SyncSuccessfulModal({
  close,
  handleFilterChange,
  provider
}: Props) {
  return (
    <BareModal isOpen autoHeight onRequestClose={close}>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <img src="/static/images/congrats.svg" alt="congratulations" />
        <h2>You’re all set!</h2>
        <p>
          Your Contacts imported successfuly, start tagging them or add them to
          a flow and let Rechat do the rest for you.
        </p>
        <br />
        <OrganizeSyncedContactsButton provider={provider}>
          {({ applyFilters }) => (
            <ActionButton
              onClick={() => {
                const filters = applyFilters()

                // Total hack! Filters are coming from the redux store
                // but reaction to changes in filters are done MANUALLY
                // inside contacts list component which means whenever filters
                // are changed we should manually call this.handleFilterChange.
                handleFilterChange(filters)
              }}
            >
              Manage Synced Contacts
            </ActionButton>
          )}
        </OrganizeSyncedContactsButton>
      </div>
    </BareModal>
  )
}
