import { ChangeEvent, useState } from 'react'

import { Box, Button, Checkbox, FormControlLabel } from '@material-ui/core'
import { mdiCancel, mdiCheckOutline } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { useImageEditor } from '../../../hooks/use-image-editor'

interface Props {
  options?: {
    circular?: boolean
  }
}

export function CropMenu({ options }: Props) {
  const { editor, setActiveAction } = useImageEditor()
  const [keepAspectRatio, setKeepAspectRatio] = useState(true)

  const handleCrop = () => {
    editor?.cropper.crop()
    setActiveAction(null)
  }

  const handleCancel = () => {
    editor?.cropper.stop()
    setActiveAction(null)
  }

  const handleChangeKeepAspectRatio = (
    _: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setKeepAspectRatio(checked)

    editor?.cropper.stop()
    editor?.cropper.start({
      ...options,
      fixed: false,
      keepRatio: checked,
      transformer: {
        enabledAnchors: [
          'top-left',
          'top-right',
          'bottom-left',
          'bottom-right',
          'top-center',
          'bottom-center'
        ]
      }
    })
  }

  return (
    <Box display="flex" alignItems="center">
      <Button
        variant="outlined"
        startIcon={<SvgIcon path={mdiCheckOutline} size={muiIconSizes.small} />}
        onClick={handleCrop}
      >
        Apply
      </Button>

      <Box ml={1}>
        <Button
          variant="outlined"
          startIcon={<SvgIcon path={mdiCancel} size={muiIconSizes.small} />}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Box>

      <Box ml={3}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={keepAspectRatio}
              onChange={handleChangeKeepAspectRatio}
              color="primary"
            />
          }
          label="Keep Aspect Ratio"
        />
      </Box>
    </Box>
  )
}
