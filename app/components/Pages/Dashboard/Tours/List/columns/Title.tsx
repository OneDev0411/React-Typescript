import React from 'react'

import { Link } from '@material-ui/core'

import { TextMiddleTruncate } from '@app/views/components/TextMiddleTruncate'

interface Props {
  title: string
  onClick: (rowDate) => void
}

export default function Title({ title, onClick }: Props) {
  return (
    <Link onClick={onClick}>
      <TextMiddleTruncate text={title} maxLength={100} />
    </Link>
  )
}
