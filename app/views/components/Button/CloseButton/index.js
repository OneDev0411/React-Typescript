import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

import { goTo } from '../../../../utils/go-to'

import Button from '../IconButton'
import Icon from '../../SvgIcons/Close/CloseIcon'

export class CloseButton extends React.Component {
  static propTypes = {
    ...Button.propTypes,
    backUrl: PropTypes.string,
    defaultBackUrl: PropTypes.string,
    query: PropTypes.object
  }

  static defaultProps = {
    ...Button.defaultProps,
    backUrl: '',
    defaultBackUrl: '',
    query: {}
  }

  handleOnClick = () => {
    // Redirect using the history
    const currentLocation = browserHistory.getCurrentLocation()

    if (currentLocation.state && currentLocation.state.from) {
      return goTo(currentLocation.state.from)
    }

    // Force redirect
    if (this.props.backUrl) {
      return goTo(this.props.backUrl, null, this.props.query)
    }

    if (currentLocation.key) {
      return browserHistory.goBack()
    }

    // Default
    return goTo(this.props.defaultBackUrl, null, this.props.query)
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
