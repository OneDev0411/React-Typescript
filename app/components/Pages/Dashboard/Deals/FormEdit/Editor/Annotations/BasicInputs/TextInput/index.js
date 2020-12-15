import React, { useState } from 'react'
import useDebouncedCallback from 'use-debounce/lib/callback'

import parseAppearanceString from 'deals/FormEdit/utils/appearance'
import { calculateWordWrap } from 'deals/FormEdit/utils/word-wrap'

import { Types } from 'deals/FormEdit/utils/types'
import { EditTemplateButton } from 'deals/FormEdit/components/EditTemplateButton'

import { MaskedInput } from './MaskedInput'

export default React.memo(props => {
  const [value, setValue] = useState(props.defaultValue)
  const [debouncedSetValue] = useDebouncedCallback(setValue, 500)

  const onChange = value => {
    debouncedSetValue(value)

    props.onChange({
      [props.annotation.fieldName]: value
    })
  }

  const getFontSize = () => {
    let fontSize = appearance.size

    if (appearance.size === 0) {
      fontSize = calculateWordWrap([props.annotation], value, {
        maxFontSize: appearance.size
      }).fontSize
    }

    return `${fontSize}px`
  }

  const appearance = parseAppearanceString(props.annotation.defaultAppearance)
  const { rect } = props.annotation

  const bounds = {
    top: rect[1],
    left: rect[0],
    right: rect[2],
    bottom: rect[3]
  }

  const box = {
    top: bounds.top,
    left: bounds.left,
    width: Math.floor(bounds.right - bounds.left),
    height: Math.floor(bounds.bottom - bounds.top)
  }

  const style = {
    position: 'absolute',
    left: `${box.left}px`,
    top: `${box.top}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
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

  return (
    <>
      <MaskedInput
        id={props.annotation.fieldName}
        isMultiLine={props.annotation.multiLine}
        type={props.type}
        bounds={bounds}
        format={props.format}
        defaultValue={props.defaultValue}
        style={style}
        onChange={onChange}
      />

      <EditTemplateButton
        style={{
          left: `${box.left + box.width - 16}px`,
          top: `${box.top + box.height / 10}px`
        }}
        annotation={props.annotation}
        type={Types.TEXT_ANNOTATION}
      />
    </>
  )
})
