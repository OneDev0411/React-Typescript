import { useEffect, useState } from 'react'

import { TextField } from '@material-ui/core'
import { useDebounce, useEffectOnce } from 'react-use'

import { useCanvasTextContext } from './hooks/get-canvas-text-context'

export function TextEditor() {
  const { setTextProperty, preview } = useCanvasTextContext()
  const [textValue, setTextValue] = useState('Untitled Text')

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
      onChange={e => setTextValue(e.target.value)}
    />
  )
}
