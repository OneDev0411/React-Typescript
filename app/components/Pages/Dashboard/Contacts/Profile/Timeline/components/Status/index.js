import styled from "styled-components"
import React from 'react'
import Flex from 'styled-flex-component'

import {
  primary,
  borderColor
} from '../../../../../../../../views/utils/colors'
import IconButton from '../../../../../../../../views/components/Button/IconButton'
import IconCheck from '../../../../../../../../views/components/SvgIcons/Checkmark/IconCheckmark'

const Container = styled(Flex)`
  width: 2.5rem;
  height: 2.25rem;
`

const Button = styled(IconButton)`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 8px;
  justify-content: center;
  background-color: ${props => (props.checked ? primary : '#fff')};
  border: solid 1px ${props => (props.checked ? primary : borderColor)};
`

export function Status(props) {
  return (
    <Container alignCenter>
      <Button isFit {...props}>
        {props.checked && <IconCheck style={{ fill: '#fff' }} />}
      </Button>
    </Container>
  )
}
