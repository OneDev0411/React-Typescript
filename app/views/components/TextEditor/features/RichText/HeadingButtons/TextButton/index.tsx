import React from 'react'

import { primary } from '../../../../../../utils/colors'

import { Button } from './styled'

interface Props {
  isActive?: boolean
  title: string
  toggleBlockType?: (event: React.MouseEvent) => void
}

export function TextButton(props: Props) {
  return (
    <Button
      onClick={props.toggleBlockType}
      style={{
        color: props.isActive ? primary : '#262626'
      }}
    >
      {props.title}
    </Button>
  )
}
