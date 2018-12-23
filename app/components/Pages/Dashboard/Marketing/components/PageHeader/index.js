import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { Trigger as MenuTrigger } from 'components/SlideMenu'
import PageHeader from 'components/PageHeader'

Header.propTypes = {
  title: PropTypes.string.isRequired,
  showMenu: PropTypes.bool,
  style: PropTypes.shape()
}

Header.defaultProps = {
  showMenu: true,
  style: {}
}

export function Header(props) {
  return (
    <PageHeader
      style={{
        margin: 0,
        width: '100%',
        minHeight: '6rem',
        borderBottom: '1px solid #d4d4d4',
        ...props.style
      }}
    >
      <Flex alignCenter>
        <MenuTrigger
          onClick={props.toggleSideMenu}
          isExpended={props.isSideMenuOpen}
          style={{ width: '1.5em', height: '1.5em', marginRight: '0.5em' }}
        />
        <Flex column>
          <PageHeader.Heading>{props.title}</PageHeader.Heading>
        </Flex>
      </Flex>
    </PageHeader>
  )
}
