import React from 'react'
import { Typography } from '@material-ui/core'

import ActionButton from 'components/Button/ActionButton'

interface Props {
  name: string
  description: string
  onClick: () => void
}

export default function Name({ name, description, onClick }: Props) {
  return (
    <>
      <ActionButton
        appearance="link"
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
        {description}
      </Typography>
    </>
  )
}
