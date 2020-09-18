import React, { useState } from 'react'
import useDebouncedCallback from 'use-debounce/lib/callback'

import { mdiFileDocumentEdit } from '@mdi/js'

import { ButtonBase } from '@material-ui/core'

import parseAppearanceString from 'deals/FormEdit/utils/appearance'
import { calculateWordWrap } from 'deals/FormEdit/utils/word-wrap'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { useDefaultValueContext } from 'deals/FormEdit/Editor/DefaultValues/use-default-value-content'
import { Types } from 'deals/FormEdit/utils/types'

export default React.memo(props => {
  const [value, setValue] = useState(props.defaultValue)
  const [debouncedSetValue] = useDebouncedCallback(setValue, 500)
  const defaultValueContext = useDefaultValueContext()

  const handleValueChange = e => {
    debouncedSetValue(e.target.value)

    props.onChange({
      [props.annotation.fieldName]: e.target.value
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

  const box = {
    top: rect[1],
    left: rect[0],
    width: Math.floor(rect[2] - rect[0]),
    height: Math.floor(rect[3] - rect[1])
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

  return (
    <>
      <input type="text" {...sharedProps} />

      <ButtonBase
        className="button-default-value"
        style={{
          position: 'absolute',
          left: `${box.left + box.width - 16}px`,
          top: `${box.top + box.height / 10}px`,
          cursor: 'pointer'
        }}
        onClick={() =>
          defaultValueContext.setAnnotation(
            props.annotation,
            Types.TEXT_ANNOTATION
          )
        }
      >
        <SvgIcon size={10 / box.height} path={mdiFileDocumentEdit} />
      </ButtonBase>
    </>
  )
})
