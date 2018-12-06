import React from 'react'
import PropTypes from 'prop-types'

import { Divider } from '../../Divider'
import PageHeader from '../../PageHeader'
import Button from '../../Button/IconButton'
import IconClose from '../../SvgIcons/Close/CloseIcon'

Header.propTypes = {
  ...PageHeader.propTypes,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

Header.propTypes = PageHeader.defaultProps

export function Header(props) {
  const menuContent = props.menuRenderer()

  return (
    <PageHeader
      title={props.title}
      showBackButton={false}
      className={props.className}
      style={{
        width: '100%',
        height: 'auto',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1,
        margin: 0,
        padding: '1.5rem',
        backgroundColor: '#FFF'
      }}
    >
      <PageHeader.Menu>
        {menuContent}
        {menuContent && <Divider width="1px" height="1.5rem" margin="0 1rem" />}
        <Button isFit inverse iconSize="large" onClick={props.handleClose}>
          <IconClose />
        </Button>
      </PageHeader.Menu>
    </PageHeader>
  )
}
