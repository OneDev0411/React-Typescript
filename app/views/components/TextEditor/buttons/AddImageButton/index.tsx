import * as React from 'react'
import { useState } from 'react'

import { Tooltip } from '@material-ui/core'

import ImageFileIcon from 'components/SvgIcons/ImageFile/ImageFileIcon'

import { ImagePickerModal } from './ImagePickerModal'
import { ToolbarIconButton } from '../ToolbarIconButton'

interface Props {
  onImageSelected: (file: File) => void
}

/**
 * When clicked, opens a dialog which lets user select an image and finally
 * calls `onImageSelected` prop with the dataURl of the selected image.
 * For now, it uses {@link ImageUploader} for selecting image, but it can
 * be replaced with a more advanced component which lets image selection
 * from listings for example or from Dropbox. It's not necessarily good to
 * use the component which is used for selecting Avatar
 * (which requires features like crop) here too.
 * @param props
 * @constructor
 */
export function AddImageButton(props: Props) {
  const [open, setOpen] = useState(false)
  const handleClick = () => {
    setOpen(true)
  }

  const close = () => setOpen(false)

  const selectImage = async files => {
    props.onImageSelected(files[0])
    close()
  }

  return (
    <>
      <Tooltip title="Insert Image">
        <ToolbarIconButton onClick={handleClick} data-test="add-image-button">
          <ImageFileIcon />
        </ToolbarIconButton>
      </Tooltip>
      <ImagePickerModal
        isOpen={open}
        onFileSelected={selectImage}
        onClose={close}
      />
    </>
  )
}
