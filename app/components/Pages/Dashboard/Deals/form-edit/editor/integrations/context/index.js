import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { updateContext } from '../../../../../../../../store_actions/deals'

import Deal from '../../../../../../../../models/Deal'
import DealContext from '../../../../../../../../models/DealContext'

import DateContext from './date-context'
import NormalContext from './string-context'

class Context extends React.Component {
  state = {
    isSaving: false,
    value: null,
    formattedValue: null
  }

  onContextChange = (value, formattedValue) => {
    this.setState({
      value,
      formattedValue
    })
  }

  handleSave = async () => {
    const { contextName, annotations } = this.props.data

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

    this.props.onValueUpdate(
      annotations[0].fieldName,
      this.state.formattedValue
    )

    this.setState({
      isSaving: false,
      value: null,
      formattedValue: null
    })

    this.props.onClose()
  }

  render() {
    const { data } = this.props

    if (!data) {
      return false
    }

    const defaultValue = Deal.get.field(this.props.deal, data.contextName)
    const isDateContext = data.context && data.context.data_type === 'Date'

    const sharedProps = {
      isOpen: this.props.isOpen,
      onClose: this.props.onClose,
      isSaving: this.state.isSaving,
      handleSave: this.handleSave,
      onContextChange: this.onContextChange,
      value: this.state.value,
      context: DealContext.searchContext(data.contextName),
      defaultValue
    }

    return (
      <Fragment>
        {isDateContext && <DateContext {...sharedProps} />}

        {!isDateContext && (
          <NormalContext {...sharedProps} bounds={data.bounds} />
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
