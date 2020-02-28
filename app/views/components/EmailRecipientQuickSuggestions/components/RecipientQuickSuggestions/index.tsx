import React, { Fragment } from 'react'

import { QuickSuggestion } from 'components/EmailRecipientsChipsInput/types'
import { recipientToString } from 'components/EmailRecipientsChipsInput/helpers/recipient-to-string'

import RecipientQuickSuggestion from './components/RecipientQuickSuggestion'

interface Props {
  quickSuggestions: QuickSuggestion[]
  onSelect: (quickSuggestion: QuickSuggestion) => void
}

export default function RecipientQuickSuggestions({
  quickSuggestions,
  onSelect
}: Props) {
  return (
    <>
      {quickSuggestions.map((quickSuggestion, index) => (
        <Fragment key={index}>
          <RecipientQuickSuggestion
            recipient={quickSuggestion.recipient}
            onSelect={() => onSelect(quickSuggestion)}
          >
            {quickSuggestion.text ||
              recipientToString(quickSuggestion.recipient)}
          </RecipientQuickSuggestion>
          {index < quickSuggestions.length - 1 ? ', ' : ''}
        </Fragment>
      ))}
    </>
  )
}
