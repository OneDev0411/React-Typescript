import React from 'react'

import IconCheck from '../../../../../../../../views/components/SvgIcons/Checkmark/IconCheckmark'

import { Container, Button } from './styled'

export function Status(props) {
  return (
    <Container alignCenter>
      <Button isFit {...props}>
        {props.checked && <IconCheck style={{ fill: '#fff' }} />}
      </Button>
    </Container>
  )
}
