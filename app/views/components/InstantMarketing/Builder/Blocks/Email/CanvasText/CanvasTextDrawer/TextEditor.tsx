import { useEffect, useState } from 'react'

import { TextField } from '@material-ui/core'
import { useDebounce, useEffectOnce } from 'react-use'

import { DefaultCanvasTextProperties } from './constants'
import { useCanvasTextContext } from './hooks/get-canvas-text-context'

export function TextEditor() {
  const { label, setTextProperty, preview } = useCanvasTextContext()
  const [textValue, setTextValue] = useState(
    label?.textNode.text() || DefaultCanvasTextProperties.text.text!
  )

  const [debouncedTextValue, setDebouncedTextValue] = useState(textValue)

  useDebounce(
    () => {
      setDebouncedTextValue(textValue)
    },
    300,
    [textValue]
  )

  useEffect(() => {
    setTextProperty('text', debouncedTextValue)
    preview()
  }, [debouncedTextValue, setTextProperty, preview])

  useEffectOnce(() => {
    setTimeout(() => {
      preview()
    }, 1000)
  })

  return (
    <TextField
      autoFocus
      multiline
      fullWidth
      rows={5}
      variant="outlined"
      value={textValue}
      inputProps={{
        maxLength: '100'
      }}
      onChange={e => setTextValue(e.target.value)}
    />
  )
}
