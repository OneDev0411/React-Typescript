import React from 'react'
import Flex from 'styled-flex-component'

import { Title, Container } from './styled'
import IconButton from '../../Button/IconButton'
import CloseIcon from '../../SvgIcons/Close/CloseIcon'

const Header = ({ title, renderMenu, onClose, style, render }) => {
  if (render && typeof render === 'function') {
    return <Container style={style}>{render()}</Container>
  }

  const hasMenu = renderMenu && typeof renderMenu === 'function'

  return (
    <Container style={style}>
      <div className="header-row">
        <Flex alignCenter>{title && <Title>{title}</Title>}</Flex>
        <Flex alignCenter>
          {hasMenu && renderMenu()}
          <IconButton
            type="button"
            isFit
            iconSize="large"
            inverse
            onClick={onClose}
            style={{ marginLeft: hasMenu ? '1rem' : 0 }}
          >
            <CloseIcon />
          </IconButton>
        </Flex>
      </div>
    </Container>
  )
}

export default Header
