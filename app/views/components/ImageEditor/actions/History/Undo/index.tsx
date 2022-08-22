import { Button } from '@material-ui/core'
import { mdiUndoVariant } from '@mdi/js'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { useImageEditor } from '../../../hooks/use-image-editor'

export function Undo() {
  const { editor, history } = useImageEditor()

  return (
    <Button
      disabled={history?.canUndo === false}
      startIcon={<SvgIcon path={mdiUndoVariant} size={muiIconSizes.small} />}
      onClick={() => editor?.undo()}
    >
      Undo
    </Button>
  )
}
