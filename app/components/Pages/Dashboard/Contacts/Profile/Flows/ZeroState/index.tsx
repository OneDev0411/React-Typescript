import React from 'react'

import AddToFlowButton from 'components/AddToFlowButton'

import { grey } from 'views/utils/colors'

interface Props {
  contactId: UUID
  addCallback: () => void
}

export default function ZeroState({ addCallback, contactId }: Props) {
  return (
    <div>
      <div style={{ color: grey.A900 }}>
        No Flows yet,{' '}
        {
          <AddToFlowButton
            activeFlows={[]}
            contacts={{
              ids: [contactId]
            }}
            callback={addCallback}
            buttonRenderer={props => (
              <a {...props} style={{ cursor: 'pointer' }}>
                add to a Flow
              </a>
            )}
          />
        }
        .
      </div>
    </div>
  )
}
