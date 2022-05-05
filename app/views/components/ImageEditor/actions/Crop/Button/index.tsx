import { Button } from '@material-ui/core'
import { mdiCrop } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { useImageEditor } from '../../../hooks/use-image-editor'

export function Cropper() {
  const { editor, setActiveAction } = useImageEditor()

  const toggleCrop = () => {
    if (editor?.cropper.isActive) {
      editor.cropper.stop()
      setActiveAction(null)

      return
    }

    editor?.cropper.start({
      circular: false,
      fixed: false
    })

    setActiveAction('crop')
  }

  return (
    <Button
      startIcon={<SvgIcon path={mdiCrop} size={muiIconSizes.small} />}
      variant="outlined"
      onClick={toggleCrop}
    >
      Crop
    </Button>
  )
}
