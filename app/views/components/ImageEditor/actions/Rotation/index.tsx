import { useEffect, useState } from 'react'

import { Button } from '@material-ui/core'
import { mdiRotateLeft } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { useImageEditor } from '../../hooks/use-image-editor'

export function Rotation() {
  const { editor } = useImageEditor()
  const [rotationValue, setRotationValue] = useState(0)

  const handleRotate = () => setRotationValue(val => val + 90)

  useEffect(() => {
    if (!editor) {
      return
    }

    editor.rotation.transform(rotationValue)
  }, [rotationValue, editor])

  return (
    <Button
      startIcon={<SvgIcon path={mdiRotateLeft} size={muiIconSizes.small} />}
      variant="outlined"
      onClick={handleRotate}
    >
      Rotate
    </Button>
  )
}
