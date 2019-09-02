import * as React from 'react'
import { Link } from '@material-ui/core'

import { recipientToString } from '../helpers/recipient-to-string'

interface Props {
  recipient: IDenormalizedEmailRecipientInput
  onSelect: (suggestion: IDenormalizedEmailRecipientInput) => void
}

export function RecipientQuickSuggestion({ recipient, onSelect }: Props) {
  const onClick = (event: React.MouseEvent) => {
    event.preventDefault()

    return onSelect(recipient)
  }

  return (
    <Link href="" underline="always" color="textPrimary" onClick={onClick}>
      {recipientToString(recipient)}
    </Link>
  )
}
