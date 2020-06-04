import React from 'react'
import { ReactNode } from 'react'
import { Link } from '@material-ui/core'

interface Props {
  children: ReactNode
  recipient: IDenormalizedEmailRecipientInput
  onSelect: (suggestion: IDenormalizedEmailRecipientInput) => void
}

export default function RecipientQuickSuggestion({
  children,
  recipient,
  onSelect
}: Props) {
  return (
    <Link
      href=""
      underline="always"
      color="textPrimary"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault()
        onSelect(recipient)
      }}
    >
      {children}
    </Link>
  )
}
