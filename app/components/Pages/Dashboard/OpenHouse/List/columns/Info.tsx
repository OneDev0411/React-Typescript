import React from 'react'
import fecha from 'fecha'
import { Typography } from '@material-ui/core'

import ActionButton from 'components/Button/ActionButton'

interface Props {
  name: string
  description: string
  dueDate: number
  onClick: () => void
}

export default function Info({ name, description, dueDate, onClick }: Props) {
  const date = fecha.format(
    new Date(dueDate * 1000),
    'dddd, MM DD YYYY hh:mm A'
  )

  return (
    <>
      <ActionButton
        appearance="link"
        inverse
        onClick={onClick}
        style={{
          height: 'auto',
          padding: 0,
          fontWeight: 'bold',
          lineHeight: 1
        }}
      >
        {name}
      </ActionButton>
      <Typography variant="body2" color="textSecondary">
        {date}&nbsp;&nbsp;|&nbsp;&nbsp;{description}
      </Typography>
    </>
  )
}
