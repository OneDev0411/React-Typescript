import { Button } from '@material-ui/core'
import { mdiImageFilterBlackWhite } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { useImageEditor } from '../../../hooks/use-image-editor'

export function Filter() {
  const { editor, setActiveAction } = useImageEditor()

  return (
    <Button
      startIcon={
        <SvgIcon path={mdiImageFilterBlackWhite} size={muiIconSizes.small} />
      }
      variant="outlined"
      onClick={() => {}}
    >
      Filters
    </Button>
  )
}
