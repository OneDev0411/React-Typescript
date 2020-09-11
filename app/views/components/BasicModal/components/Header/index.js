import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { mdiClose } from '@mdi/js'

import IconButton from 'components/Button/IconButton'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { H3 } from 'components/Typography/headings'

const Container = styled.div`
  position: relative;
  height: 48px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 1em;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`

const propTypes = {
  title: PropTypes.string
}

const Header = ({ title, children, showClose, handleOnClose }) => (
  <Container>
    <H3>{title}</H3>
    {children}

    {showClose && (
      <IconButton
        appearance="icon"
        inverse
        iconSize="large"
        onClick={handleOnClose}
      >
        <SvgIcon path={mdiClose} />
      </IconButton>
    )}
  </Container>
)

Header.propTypes = propTypes

export default Header
