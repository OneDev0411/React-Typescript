import React from 'react'
import PropTypes from 'prop-types'

import Drawer from '../OverlayDrawer'
import EditEvent from '../../CRM/Tasks/components/NewTask'

const propTypes = {
  ...Drawer.propTypes,
  event: PropTypes.shape().isRequired,
  onSubmit: PropTypes.func.isRequired
}

const defaultProps = Drawer.defaultProps

export class EventDrawer extends React.Component {
  onSubmit = async event => {
    this.props.onSubmit(event)
    console.log(event)
    this.props.onClose()
  }

  render() {
    return (
      <Drawer
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        showFooter={false}
      >
        <Drawer.Header title={this.props.title} />
        <Drawer.Body>
          <EditEvent
            taskId={this.props.eventId}
            submitCallback={this.onSubmit}
          />
        </Drawer.Body>
      </Drawer>
    )
  }
}

EventDrawer.propTypes = propTypes
EventDrawer.defaultProps = defaultProps
