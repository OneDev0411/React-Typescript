import React, { CSSProperties, ReactElement } from 'react'
import Flex from 'styled-flex-component'

import { Title, Container } from './styled'
import IconButton from '../../Button/IconButton'
import CloseIcon from '../../SvgIcons/Close/CloseIcon'
import { useDrawerContext } from '../drawer-context'

interface Props {
  title?: string
  children?: ReactElement<any>
  menu?: ReactElement<any>
  style?: CSSProperties
}

const throwMissingDrawerContextError = () => {
  throw new Error('Drawer.Header must be used inside drawer')
}

const Header = ({ title, menu, style, children }: Props) => {
  const { onClose } = useDrawerContext() || {
    onClose: throwMissingDrawerContextError
  }

  if (children) {
    return <Container style={style}>{children}</Container>
  }

  return (
    <Container style={style}>
      <div className="header-row">
        <Flex alignCenter>{title && <Title>{title}</Title>}</Flex>
        <Flex alignCenter>
          {menu}
          <IconButton
            type="button"
            isFit
            iconSize="large"
            inverse
            onClick={event => onClose(event, 'closeButtonClick')}
            style={{ marginLeft: menu ? '1rem' : 0 }}
          >
            <CloseIcon />
          </IconButton>
        </Flex>
      </div>
    </Container>
  )
}

export default Header
