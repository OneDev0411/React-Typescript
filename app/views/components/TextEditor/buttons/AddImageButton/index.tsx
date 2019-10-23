import * as React from 'react'

import { Tooltip } from '@material-ui/core'

import ImageFileIcon from 'components/SvgIcons/ImageFile/ImageFileIcon'

import { ToolbarIconButton } from '../ToolbarIconButton'
import { FilePicker } from '../../../FilePicker'

interface Props {
  onImageSelected: (file: File) => void
}

/**
 * When clicked, opens a dialog which lets user select an image and finally
 * calls `onImageSelected` prop with the dataURl of the selected image.
 * @param props
 * @constructor
 */
export function AddImageButton(props: Props) {
  const selectImage = async files => {
    props.onImageSelected(files[0])
  }

  return (
    <FilePicker onFilePicked={selectImage}>
      {({ pickFiles }) => (
        <Tooltip title="Insert Image">
          <ToolbarIconButton onClick={pickFiles} data-test="add-image-button">
            <ImageFileIcon />
          </ToolbarIconButton>
        </Tooltip>
      )}
    </FilePicker>
  )
}
