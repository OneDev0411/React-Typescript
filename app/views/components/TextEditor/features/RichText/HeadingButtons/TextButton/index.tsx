import React from 'react'
import { Button } from '@material-ui/core'

interface Props {
  isActive?: boolean
  title: string
  toggleBlockType?: (event: React.MouseEvent) => void
}

export function TextButton({ isActive, title, toggleBlockType }: Props) {
  return (
    <Button
      color={isActive ? 'secondary' : 'inherit'}
      onClick={toggleBlockType}
    >
      {title}
    </Button>
  )
}
