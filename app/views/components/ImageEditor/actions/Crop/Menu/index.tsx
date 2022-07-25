import { Button } from '@material-ui/core'
import { mdiCancel, mdiCheckOutline } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { useImageEditor } from '../../../hooks/use-image-editor'

export function CropMenu() {
  const { editor, setActiveAction } = useImageEditor()

  const handleCrop = () => {
    editor?.cropper.crop()
    setActiveAction(null)
  }

  const handleCancel = () => {
    editor?.cropper.stop()
    setActiveAction(null)
  }

  return (
    <div>
      <Button
        startIcon={<SvgIcon path={mdiCheckOutline} size={muiIconSizes.small} />}
        onClick={handleCrop}
      >
        Apply
      </Button>

      <Button
        startIcon={<SvgIcon path={mdiCancel} size={muiIconSizes.small} />}
        onClick={handleCancel}
      >
        Cancel
      </Button>
    </div>
  )
}
