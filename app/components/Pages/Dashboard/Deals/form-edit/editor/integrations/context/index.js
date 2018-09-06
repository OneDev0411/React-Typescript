import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { updateContext } from '../../../../../../../../store_actions/deals'

import Deal from '../../../../../../../../models/Deal'

import DateContext from './date-context'
import NormalContext from './string-context'

class Context extends React.Component {
  state = {
    isSaving: false,
    value: null
  }

  onContextChange = value => {
    this.setState({
      value
    })
  }

  handleSave = async () => {
    const contextName = this.props.data.name

    const context = {
      [contextName]: {
        value: this.state.value,
        approved: false
      }
    }

    this.setState({
      isSaving: true
    })

    try {
      await this.props.updateContext(this.props.deal.id, context)
    } catch (e) {
      console.log(e)
    }

    this.setState({
      isSaving: false
    })

    this.props.onClose()
  }

  render() {
    const { data } = this.props

    if (!data) {
      return false
    }

    const defaultValue = Deal.get.field(this.props.deal, data.name)
    const isDateContext = data.context && data.context.data_type === 'Date'

    return (
      <Fragment>
        {isDateContext && (
          <DateContext
            onClose={this.props.onClose}
            isOpen={this.props.isOpen}
            isSaving={this.state.isSaving}
            value={this.state.value}
            defaultValue={defaultValue}
            handleSave={this.handleSave}
            onContextChange={this.onContextChange}
          />
        )}

        {!isDateContext && (
          <NormalContext
            isOpen={this.props.isOpen}
            isSaving={this.state.isSaving}
            value={this.state.value}
            defaultValue={defaultValue}
            handleSave={this.handleSave}
            onContextChange={this.onContextChange}
            bounds={data.bounds}
          />
        )}
      </Fragment>
    )
  }
}

Context.propTypes = {
  data: PropTypes.object
}

Context.defaultProps = {
  data: {}
}

export default connect(
  null,
  { updateContext }
)(Context)
