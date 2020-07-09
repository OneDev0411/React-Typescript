import React from 'react'
import { mdiCheck } from '@mdi/js'
import { useTheme } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { Container, Button } from './styled'

export function Status(props) {
  const theme = useTheme()

  return (
    <Container alignCenter>
      <Button isFit {...props}>
        {props.checked && (
          <SvgIcon path={mdiCheck} color={theme.palette.common.white} />
        )}
      </Button>
    </Container>
  )
}
