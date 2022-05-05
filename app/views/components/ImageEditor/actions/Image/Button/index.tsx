import { Button } from '@material-ui/core'
import { mdiImageOutline } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { useImageEditor } from '../../../hooks/use-image-editor'

export function Image() {
  const { editor, setActiveAction } = useImageEditor()

  return (
    <Button
      startIcon={<SvgIcon path={mdiImageOutline} size={muiIconSizes.small} />}
      variant="outlined"
      onClick={() => {}}
    >
      Image
    </Button>
  )
}
