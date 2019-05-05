import React from 'react'

import parseAppearanceString from '../../../../utils/appearance'

import { TextArea, TextInput } from './styled'

export default React.memo(props => {
  const appearance = parseAppearanceString(props.annotation.defaultAppearance)

  const isTextArea = props.annotation.multiLine === true

  const sharedProps = {
    id: props.annotation.fieldName,
    appearance,
    fontSize: props.fontSize,
    rect: props.annotation.rect,
    onInput: e => props.onValueUpdate(e.target.value),
    defaultValue: props.value
  }

  if (isTextArea) {
    return <TextArea {...sharedProps} />
  }

  return <TextInput {...sharedProps} />
})
