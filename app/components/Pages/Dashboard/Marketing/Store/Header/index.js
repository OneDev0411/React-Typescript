import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { Trigger as MenuTrigger } from 'components/SlideMenu'
import PageHeader from 'components/PageHeader'

Header.propTypes = {
  showMenu: PropTypes.bool
}

Header.defaultProps = {
  showMenu: true
}

export function Header(props) {
  return (
    <PageHeader
      style={{
        margin: 0,
        width: '100%',
        minHeight: '6rem',
        borderBottom: '1px solid #d4d4d4'
      }}
    >
      <Flex>
        <MenuTrigger
          onClick={props.toggleSideMenu}
          isExpended={props.isSideMenuOpen}
          style={{ width: '1.5em', height: '1.5em', marginRight: '0.5em' }}
        />
        <Flex column>
          <PageHeader.Heading style={{ fontSize: '1.5rem', lineHeight: 1 }}>
            Marketing Center
          </PageHeader.Heading>
        </Flex>
      </Flex>
    </PageHeader>
  )
}
