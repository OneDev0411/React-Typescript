import React, { CSSProperties, ReactElement } from 'react'
import Flex from 'styled-flex-component'
import { IconButton } from '@material-ui/core'

import { mdiClose } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { Title, Container } from './styled'
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
            onClick={event => onClose(event, 'closeButtonClick')}
            style={{ marginLeft: menu ? '1rem' : 0 }}
          >
            <SvgIcon path={mdiClose} />
          </IconButton>
        </Flex>
      </div>
    </Container>
  )
}

export default Header
