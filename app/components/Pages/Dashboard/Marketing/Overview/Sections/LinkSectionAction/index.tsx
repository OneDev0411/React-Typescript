import { Button } from '@material-ui/core'
import { mdiArrowRight } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import Link from 'components/ALink'

interface Props {
  title: string
  url: string
}

export default function LinkSectionAction({ title, url }: Props) {
  return (
    <Link noStyle to={url}>
      <Button
        variant="text"
        color="primary"
        endIcon={<SvgIcon path={mdiArrowRight} size={muiIconSizes.small} />}
      >
        {title}
      </Button>
    </Link>
  )
}
