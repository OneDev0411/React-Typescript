import React from 'react'
import PropTypes from 'prop-types'

import { mdiClose } from '@mdi/js'

import Icon from '@mdi/react'

import { IconButton } from '@material-ui/core'

import { Divider } from '../../Divider'
import PageHeader from '../../PageHeader'

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
      style={{
        width: '100%',
        height: '5rem',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1,
        margin: 0,
        padding: '0 1.5rem',
        backgroundColor: '#FFF'
      }}
    >
      <PageHeader.Menu>
        {menuContent}
        {menuContent && <Divider width="1px" height="1.5rem" margin="0 1rem" />}
        <IconButton onClick={props.handleClose}>
          <Icon path={mdiClose} size="2rem" />
        </IconButton>
      </PageHeader.Menu>
    </PageHeader>
  )
}
