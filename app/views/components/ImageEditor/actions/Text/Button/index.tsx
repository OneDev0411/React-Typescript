import { Button } from '@material-ui/core'
import { mdiFormatTextbox } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { useImageEditor } from '../../../hooks/use-image-editor'

export function Text() {
  const { activeAction, setActiveAction } = useImageEditor()

  const toggleDrawing = () => {
    if (activeAction === 'text') {
      setActiveAction(null)

      return
    }

    setActiveAction('text')
  }

  return (
    <Button
      startIcon={<SvgIcon path={mdiFormatTextbox} size={muiIconSizes.small} />}
      variant="outlined"
      onClick={toggleDrawing}
    >
      Text
    </Button>
  )
}
