import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import Flex from 'styled-flex-component'

import IconButton from '../../Button/IconButton'
import BackButton from '../../SvgIcons/KeyboardArrowLeft/IconKeyboardArrowLeft'
import { Title } from './styled'
import { goTo } from '../../../../utils/go-to'

PageTitle.propTypes = {
  backUrl: PropTypes.string,
  backButton: PropTypes.bool,
  title: PropTypes.string
}

PageTitle.defaultProps = {
  backButton: true,
  backUrl: '',
  title: ''
}

export function PageTitle(props) {
  const { title, backUrl } = props

  function handleOnBack() {
    if (backUrl) {
      return goTo(backUrl)
    }

    const currentLocation = browserHistory.getCurrentLocation()

    if (currentLocation.key) {
      browserHistory.goBack()
    }
  }

  return (
    <Flex alignCenter>
      <Flex alignCenter>
        {props.backButton && (
          <IconButton color="#333" hoverColor="#2196f3" onClick={handleOnBack}>
            <BackButton style={{ width: 32, height: 32 }} />
          </IconButton>
        )}
        {title && <Title>{title}</Title>}
      </Flex>
      {props.children}
    </Flex>
  )
}
