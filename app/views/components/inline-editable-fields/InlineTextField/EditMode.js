import React from 'react'

import { Label, Input } from '../styled'

export function EditMode(props) {
  return (
    <React.Fragment>
      <Label>{props.label}</Label>
      <Input type="text" onChange={props.onChange} value={props.value} />
    </React.Fragment>
  )
}
