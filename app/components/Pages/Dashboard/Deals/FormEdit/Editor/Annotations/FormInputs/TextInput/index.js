import React from 'react'

import parseAppearanceString from '../../../../utils/appearance'

export default React.memo(props => {
  const appearance = parseAppearanceString(props.annotation.defaultAppearance)
  const { rect } = props.annotation

  const isTextArea = props.annotation.multiLine === true

  const sharedProps = {
    id: props.annotation.fieldName,
    onInput: e => props.onValueUpdate(e.target.value),
    defaultValue: props.value
  }

  const style = {
    position: 'absolute',
    left: `${rect[0]}px`,
    top: `${rect[1]}px`,
    width: `${Math.floor(rect[2] - rect[0])}px`,
    height: `${Math.floor(rect[3] - rect[1])}px`,
    fontSize: `${props.fontSize || 16}px`,
    fontFamily: appearance.font,
    color: appearance.color,
    fontWeight: appearance.bold ? 'bold' : 'normal',
    minWidth: '15px',
    backgroundColor: '#d2e5f2',
    border: '1px solid #ccc',
    transition: '0.1s ease-in all',
    padding: '0 3px',
    lineHeight: 'normal'
  }

  if (isTextArea) {
    return (
      <textarea
        {...sharedProps}
        style={{
          ...style,
          resize: 'none'
        }}
      />
    )
  }

  return <input type="text" {...sharedProps} style={style} />
})
