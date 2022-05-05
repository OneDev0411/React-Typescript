import { Button } from '@material-ui/core'
import { mdiDraw } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { useImageEditor } from '../../../hooks/use-image-editor'

export function Draw() {
  const { activeAction, setActiveAction } = useImageEditor()

  const toggleDrawing = () => {
    if (activeAction === 'draw') {
      setActiveAction(null)

      return
    }

    setActiveAction('draw')
  }

  return (
    <Button
      startIcon={<SvgIcon path={mdiDraw} size={muiIconSizes.small} />}
      variant="outlined"
      onClick={toggleDrawing}
    >
      Draw
    </Button>
  )
}
