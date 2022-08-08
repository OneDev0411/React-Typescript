import { Button } from '@material-ui/core'
import { mdiRedoVariant } from '@mdi/js'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { useImageEditor } from '../../../hooks/use-image-editor'

export function Redo() {
  const { editor, history } = useImageEditor()

  return (
    <Button
      disabled={history?.canRedo === false}
      startIcon={<SvgIcon path={mdiRedoVariant} size={muiIconSizes.small} />}
      onClick={() => editor?.redo()}
    >
      Redo
    </Button>
  )
}
