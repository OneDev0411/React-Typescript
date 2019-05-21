import React, { useState } from 'react'
import useDebouncedCallback from 'use-debounce/lib/callback'

import parseAppearanceString from 'deals/FormEdit/utils/appearance'
import { calculateWordWrap } from 'deals/FormEdit/utils/word-wrap'

export default React.memo(props => {
  const [value, setValue] = useState(props.defaultValue)
  const [debouncedSetValue] = useDebouncedCallback(setValue, 500)

  const handleValueChange = e => {
    debouncedSetValue(e.target.value)
    props.onChange(e.target.value)
  }

  const getFontSize = () => {
    let fontSize = appearance.size

    if (appearance.size === 0 && !props.annotation.multiLine) {
      fontSize = calculateWordWrap([props.annotation], value, {
        maxFontSize: appearance.size
      }).fontSize
    }

    return `${fontSize}px`
  }

  const appearance = parseAppearanceString(props.annotation.defaultAppearance)
  const { rect } = props.annotation

  const style = {
    position: 'absolute',
    left: `${rect[0]}px`,
    top: `${rect[1]}px`,
    width: `${Math.floor(rect[2] - rect[0])}px`,
    height: `${Math.floor(rect[3] - rect[1])}px`,
    fontFamily: appearance.font,
    color: appearance.color,
    fontWeight: appearance.bold ? 'bold' : 'normal',
    minWidth: '15px',
    backgroundColor: '#d2e5f2',
    border: '1px solid #ccc',
    transition: '0.1s ease-in all',
    padding: '0 3px',
    lineHeight: 'normal',
    fontSize: getFontSize()
  }

  const sharedProps = {
    style,
    id: props.annotation.fieldName,
    defaultValue: props.defaultValue,
    onInput: handleValueChange
  }

  if (props.annotation.multiLine) {
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

  return <input type="text" {...sharedProps} />
})
