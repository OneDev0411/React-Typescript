import React from 'react'

import { primary } from 'views/utils/colors'

import { Button } from './styled'

export function TextButton(props) {
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
