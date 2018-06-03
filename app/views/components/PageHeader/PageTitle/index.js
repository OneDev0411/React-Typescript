import React from 'react'
import { browserHistory } from 'react-router'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import IconButton from '../../Button/IconButton'
import BackButton from '../../SvgIcons/KeyboardArrowLeft/IconKeyboardArrowLeft'

const Container = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`

const Title = styled.h1`
  margin: 0;
  font-size: 17px;
  line-height: 1;
`

const defaultProps = {
  backButton: true,
  backUrl: ''
}

const propTypes = {
  backUrl: PropTypes.string,
  backButton: PropTypes.bool,
  title: PropTypes.string.isRequired
}

function PageHeader({ title, backButton, backUrl }) {
  function handleOnBack() {
    if (backUrl) {
      return browserHistory.push(backUrl)
    }

    const currentLocation = browserHistory.getCurrentLocation()

    if (currentLocation.key) {
      browserHistory.goBack()
    }
  }

  return (
    <Container>
      {backButton && (
        <IconButton
          size={32}
          color="#333"
          hoverColor="#2196f3"
          onClick={handleOnBack}
        >
          <BackButton style={{ width: 32, height: 32 }} />
        </IconButton>
      )}
      <Title>{title}</Title>
    </Container>
  )
}

PageHeader.propTypes = propTypes
PageHeader.defaultProps = defaultProps

export default PageHeader
