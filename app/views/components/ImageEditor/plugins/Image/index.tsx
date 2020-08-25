import React from 'react'
import Icon from '@mdi/react'
import { mdiImageOutline } from '@mdi/js'

import { Button, useTheme, Theme } from '@material-ui/core'

import { readFileAsDataUrl } from 'utils/file-utils/read-file-as-data-url'

import { ImageEditor } from '../../types'

interface Props {
  editor: ImageEditor
}

export function Image({ editor }: Props) {
  const theme = useTheme<Theme>()

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (!files) {
      return
    }

    const url = await readFileAsDataUrl(files[0])

    editor.addImageObject(url)
  }

  return (
    <>
      <input
        id="editor-add-image"
        accept="image/*"
        style={{
          display: 'none'
        }}
        multiple={false}
        type="file"
        onChange={handleAddImage}
      />

      <label
        htmlFor="editor-add-image"
        style={{
          margin: theme.spacing(0, 1, 0, 0)
        }}
      >
        <Button
          startIcon={<Icon path={mdiImageOutline} size={1} />}
          variant="outlined"
          // typescript complains when adding component="span" as a normal prop
          {...{
            component: 'span'
          }}
        >
          Add Image
        </Button>
      </label>
    </>
  )
}
