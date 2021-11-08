import React from 'react'

import { mdiClose } from '@mdi/js'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import IconButton from 'components/Button/IconButton'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { H3 } from 'components/Typography/headings'

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  padding: ${props => props.theme.spacing(2, 2)};
  border: 1px solid rgba(0, 0, 0, 0.1);
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
