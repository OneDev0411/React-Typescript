import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import ShadowButton from '../../../Button/ShadowButton'
import CloseIcon from '../../../SvgIcons/Close/CloseIcon'

const Container = styled.div`
  position: relative;
  height: 56px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1em;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`

const Title = styled.h1`
  margin: 0;
  font-size: 1.5em;
  line-height: 1;
  font-weight: 500;
  color: #1e364b;
`

const CloseButton = ShadowButton.extend`
  font-size: 0;
`

const Icon = CloseIcon.extend`
  fill: #7b91a6;

  &:hover: {
    fill: #1e364b;
  }
`

const propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
}

function Header(props) {
  return (
    <Container>
      <Title>{props.title}</Title>
      <CloseButton onClick={props.onClose}>
        <Icon />
      </CloseButton>
    </Container>
  )
}

Header.propTypes = propTypes

export default Header
