import { Button } from '@material-ui/core'
import { mdiFormatTextbox } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { useImageEditor } from '../../../hooks/use-image-editor'

export function Text() {
  const { editor, setActiveAction } = useImageEditor()

  return (
    <Button
      startIcon={<SvgIcon path={mdiFormatTextbox} size={muiIconSizes.small} />}
      variant="outlined"
      onClick={() => {}}
    >
      Text
    </Button>
  )
}
