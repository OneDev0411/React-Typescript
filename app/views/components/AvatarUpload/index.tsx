import { useCallback, useState } from 'react'

import { Avatar, makeStyles, Theme } from '@material-ui/core'
import { ClassNameMap } from '@material-ui/styles'
import cn from 'classnames'
import { useDropzone } from 'dropzone'

const useStyles = makeStyles(
  (theme: Theme) => ({
    avatar: {
      cursor: 'pointer'
    }
  }),
  {
    name: 'AvatarUpload'
  }
)

interface Props {
  classes: ClassNameMap<'avatar'>
  onSelect: (file: File) => void
}

export function AvatarUpload({ classes, onSelect }: Props) {
  const classesList = useStyles()
  const [previewUrl, setPreviewUrl] = useState<Nullable<string>>(null)
  const onDrop = useCallback(
    acceptedFiles => {
      if (acceptedFiles.length === 0) {
        return
      }

      setPreviewUrl(window.URL.createObjectURL(acceptedFiles[0]))

      onSelect(acceptedFiles[0])
    },
    [onSelect]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Avatar
        src={previewUrl ?? ''}
        className={cn(classesList.avatar, classes.avatar)}
      />
    </div>
  )
}
