import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import Flex from 'styled-flex-component'

import IconButton from '../../Button/IconButton'

import BackIcon from '../../SvgIcons/KeyboardArrowLeft/IconKeyboardArrowLeft'
import CloseIcon from '../../SvgIcons/Close/CloseIcon'

import { H1 } from '../../Typography/headings'
import { goTo } from '../../../../utils/go-to'

PageTitle.propTypes = {
  backUrl: PropTypes.string,
  showBackButton: PropTypes.bool,
  onClickBackButton: PropTypes.func,
  onClickCloseButton: PropTypes.func,
  title: PropTypes.string
}

PageTitle.defaultProps = {
  showBackButton: true,
  backUrl: '',
  title: ''
}

export function PageTitle(props) {
  const { title, backUrl, onClickCloseButton } = props

  function handleOnBack() {
    if (backUrl) {
      return goTo(backUrl)
    }

    const currentLocation = browserHistory.getCurrentLocation()

    if (currentLocation.key) {
      browserHistory.goBack()
    }
  }

  if (typeof onClickCloseButton === 'function') {
    return (
      <Flex justifyBetween style={{ width: '100%' }}>
        <Flex alignCenter>
          {title && <H1>{title}</H1>}
          {!title && props.children}
        </Flex>

        <Flex alignCenter>
          <IconButton
            size="32px"
            color="#333"
            hoverColor="#2196f3"
            onClick={onClickCloseButton}
          >
            <CloseIcon style={{ width: 32, height: 32 }} />
          </IconButton>
        </Flex>
      </Flex>
    )
  }

  return (
    <Flex alignCenter>
      <Flex alignCenter>
        {props.showBackButton && (
          <IconButton
            size="32px"
            color="#333"
            hoverColor="#2196f3"
            onClick={props.onClickBackButton || handleOnBack}
          >
            <BackIcon style={{ width: 32, height: 32 }} />
          </IconButton>
        )}
        {title && <H1>{title}</H1>}
      </Flex>
      {props.children}
    </Flex>
  )
}
