import * as React from 'react'
import { ChangeEvent, ReactNode, useRef } from 'react'

import { Portal } from '@material-ui/core'

import { setVisuallyHidden } from 'views/utils/visually-hidden'

interface RenderProps {
  pickFiles: () => void
}
interface Props {
  children: (renderProps: RenderProps) => ReactNode
  onFilePicked: (files: FileList) => void
}

/**
 * render prop component for opening file picker.
 * IMPORTANT: we can replace it with getInputProps from useDropzone
 * when updating react-dropzone
 */

export const Input = setVisuallyHidden('input')

export function FilePicker({ onFilePicked, children }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.files) {
      onFilePicked(event.target && event.target.files)
    }

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const openFilePicker = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <>
      <Portal>
        <Input ref={inputRef} type="file" onChange={handleOnChange} />
      </Portal>
      {children({ pickFiles: openFilePicker })}
    </>
  )
}
