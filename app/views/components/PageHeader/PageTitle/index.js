import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import Flex from 'styled-flex-component'

import IconButton from '../../Button/IconButton'

import BackIcon from '../../SvgIcons/KeyboardArrowLeft/IconKeyboardArrowLeft'
import CloseIcon from '../../SvgIcons/Close/CloseIcon'

import { H1 } from '../../Typography/headings'
import { goTo } from '../../../../utils/go-to'

import { Subtitle } from './Subtitle'

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
  const { title, subtitle, backUrl, onClickCloseButton } = props

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
          {title ? (
            <Flex column>
              <H1>{title}</H1>
              {subtitle && <Subtitle>subtitle</Subtitle>}
            </Flex>
          ) : (
            props.children
          )}
        </Flex>

        <Flex alignCenter>
          <IconButton
            iconSize="XLarge"
            inverse
            isFit
            onClick={onClickCloseButton}
          >
            <CloseIcon />
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
            iconSize="XLarge"
            inverse
            isFit
            onClick={props.onClickBackButton || handleOnBack}
          >
            <BackIcon />
          </IconButton>
        )}
        <Flex column>
          {title && <H1>{title}</H1>}
          {subtitle && <Subtitle>subtitle</Subtitle>}
        </Flex>
      </Flex>
      {props.children}
    </Flex>
  )
}
