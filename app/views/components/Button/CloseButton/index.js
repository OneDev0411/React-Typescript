import React from 'react'

import { IconButton } from '@material-ui/core'
import { mdiClose } from '@mdi/js'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

import { goTo } from '../../../../utils/go-to'
import { SvgIcon } from '../../SvgIcons/SvgIcon'

export class CloseButton extends React.Component {
  static propTypes = {
    backUrl: PropTypes.string,
    defaultBackUrl: PropTypes.string,
    query: PropTypes.object,
    buttonProps: PropTypes.object,
    iconProps: PropTypes.object
  }

  static defaultProps = {
    backUrl: '',
    defaultBackUrl: '',
    query: {},
    buttonProps: {},
    iconProps: {}
  }

  componentDidMount() {
    /**
     * We capture the **from** value from current navigation when the component
     * is rendered. So that if subsequent navigations happen in the page we are
     * already in (the page that contains the close button), we don't lose
     * track of where we were previously.
     * We don't need to use state, as it has nothing to do with rendering
     */
    this.initialFrom = getFrom()
  }

  handleOnClick = () => {
    // Redirect using the history

    const from = getFrom() || this.initialFrom

    if (from) {
      return goTo(from)
    }

    // Force redirect
    if (this.props.backUrl) {
      return goTo(this.props.backUrl, null, this.props.query)
    }

    const currentLocation = browserHistory.getCurrentLocation()

    if (currentLocation.key) {
      return browserHistory.goBack()
    }

    // Default
    return goTo(this.props.defaultBackUrl, null, this.props.query)
  }

  render() {
    return (
      <IconButton {...this.props.buttonProps} onClick={this.handleOnClick}>
        <SvgIcon path={mdiClose} {...this.props.iconProps} />
      </IconButton>
    )
  }
}

function getFrom() {
  const currentLocation = browserHistory.getCurrentLocation()

  return currentLocation.state && currentLocation.state.from
}

// todo - refactor its name to PageCloseButton
