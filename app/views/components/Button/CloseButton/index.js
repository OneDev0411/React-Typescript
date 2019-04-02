import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

import getDefaultHomePage from 'utils/get-default-home-page'

import { goTo } from '../../../../utils/go-to'

import Button from '../IconButton'
import Icon from '../../SvgIcons/Close/CloseIcon'

export class CloseButton extends React.Component {
  static propTypes = {
    ...Button.propTypes,
    backUrl: PropTypes.string,
    fallbackUrl: PropTypes.string
  }

  static defaultProps = {
    ...Button.defaultProps,
    backUrl: '',
    fallbackUrl: ''
  }

  handleOnClick = () => {
    if (this.props.backUrl) {
      return goTo(this.props.backUrl)
    }

    const currentLocation = browserHistory.getCurrentLocation()

    if (currentLocation.key) {
      return browserHistory.goBack()
    }

    return goTo(this.props.fallbackUrl || getDefaultHomePage())
  }

  render() {
    return (
      <Button isFit iconSize="large" inverse onClick={this.handleOnClick}>
        <Icon />
      </Button>
    )
  }
}

// todo - refactor its name to PageCloseButton
