import React from 'react'
import PropTypes from 'prop-types'
import { Box } from '@material-ui/core'
import styled from 'styled-components'

import { Trigger as MenuTrigger } from 'components/SlideMenu'
import { LatoFamilyStyle } from 'components/Typography/styles'

export const Title = styled.h1`
  ${LatoFamilyStyle}
  font-size: 1rem;
  font-weight: 900;
  margin: 0;
`

Header.propTypes = {
  title: PropTypes.string.isRequired,
  showMenu: PropTypes.bool
}

Header.defaultProps = {
  showMenu: true
}

export function Header(props) {
  return (
    <Box
      paddingY={2}
      paddingX={3}
      display="flex"
      alignItems="center"
      isSideMenuOpen={props.isSideMenuOpen}
      data-test="mc-store-page-header"
    >
      <MenuTrigger
        onClick={props.toggleSideMenu}
        isExpended={props.isSideMenuOpen}
      />
      <Title>{props.title}</Title>
    </Box>
  )
}
