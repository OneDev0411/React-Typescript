import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Divider } from '../../Divider'
import BasePageHeader from '../../PageHeader'
import Button from '../../Button/IconButton'
import IconClose from '../../SvgIcons/Close/CloseIcon'

const PageHeader = styled(BasePageHeader)`
  width: 100%;
  height: auto;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  margin: 0;
  padding: 1.5rem;
  & *[data-type='page-title'] {
    color: ${props => props.theme.palette.background.paper};
  }
`

const CloseButtom = styled(Button)`
  & svg {
    fill: ${props => props.theme.palette.background.paper};
  }
`

Header.propTypes = {
  ...PageHeader.propTypes,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  menuRenderer: PropTypes.func
}

Header.propTypes = {
  ...PageHeader.defaultProps,
  menuRenderer() {
    return null
  }
}

export function Header(props) {
  const menuContent = props.menuRenderer()

  return (
    <PageHeader
      title={props.title}
      showBackButton={false}
      className={props.className}
    >
      <PageHeader.Menu>
        {menuContent}
        {menuContent && <Divider width="1px" height="1.5rem" margin="0 1rem" />}
        <CloseButtom isFit inverse iconSize="large" onClick={props.handleClose}>
          <IconClose />
        </CloseButtom>
      </PageHeader.Menu>
    </PageHeader>
  )
}
