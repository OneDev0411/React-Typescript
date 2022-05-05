import { Button } from '@material-ui/core'
import { mdiFlipHorizontal } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { useImageEditor } from '../../hooks/use-image-editor'

export function Flip() {
  const { editor } = useImageEditor()

  return (
    <Button
      startIcon={<SvgIcon path={mdiFlipHorizontal} size={muiIconSizes.small} />}
      variant="outlined"
      onClick={() => editor?.flip.horizontal()}
    >
      Flip
    </Button>
  )
}
