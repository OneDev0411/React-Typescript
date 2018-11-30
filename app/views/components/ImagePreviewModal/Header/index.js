import React from 'react'
import PropTypes from 'prop-types'

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
        <Button isFit inverse iconSize="XLarge" onClick={props.handleClose}>
          <IconClose />
        </Button>
      </PageHeader.Menu>
    </PageHeader>
  )
}
