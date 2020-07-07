import React from 'react'
import { mdiCommentOutline } from '@mdi/js'
import { useTheme } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { Container } from './styled'

export function EmptyState() {
  const theme = useTheme()

  return (
    <Container>
      <SvgIcon
        path={mdiCommentOutline}
        color={theme.palette.grey.A100}
        size={muiIconSizes.xlarge}
      />
      Add some comment to this Checklist or Notify Office
    </Container>
  )
}
