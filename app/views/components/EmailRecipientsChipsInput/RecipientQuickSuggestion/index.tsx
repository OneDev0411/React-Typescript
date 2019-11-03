import * as React from 'react'
import { ReactNode } from 'react'
import { Link } from '@material-ui/core'

interface Props {
  recipient: IDenormalizedEmailRecipientInput
  children: ReactNode
  onSelect: (suggestion: IDenormalizedEmailRecipientInput) => void
}

export function RecipientQuickSuggestion({
  recipient,
  children,
  onSelect
}: Props) {
  const onClick = (event: React.MouseEvent) => {
    event.preventDefault()

    return onSelect(recipient)
  }

  return (
    <Link href="" underline="always" color="textPrimary" onClick={onClick}>
      {children}
    </Link>
  )
}
