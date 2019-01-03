import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ClickOutside from 'react-click-outside'

import { updateContext } from '../../../../../../../../store_actions/deals'

import Deal from '../../../../../../../../models/Deal'
import DealContext from '../../../../../../../../models/Deal/helpers/dynamic-context'

import ActionButton from 'components/Button/ActionButton'
import CancelButton from 'components/Button/CancelButton'

import { Container, ActionsContainer } from './styled'

import StringContext from './string-context'
import DateContext from './date-context'

class Context extends React.Component {
  state = {
    isSaving: false,
    value: this.getDefaultValue(true),
    formattedValue: this.getDefaultValue()
  }

  getDefaultValue(rawValue = false) {
    const { context } = this.props.data

    if (this.IsDateContext) {
      return ''
    }

    let value = this.props.data.annotations.reduce(
      (acc, ann) => `${acc}${this.props.formValues[ann.fieldName] || ''}`,
      ''
    )

    if (rawValue && context && context.format === 'Currency') {
      value = Number(value.replace(/[^0-9.-]+/g, ''))
    }

    return value
  }

  onContextChange = (value, formattedValue) => {
    this.setState({
      value,
      formattedValue
    })
  }

  saveDefaultValue = value => {
    const { annotations } = this.props.data

    const contextName = annotations[0].fieldName

    this.props.onValueUpdate(contextName, value, true)
    this.props.onClose()
  }

  handleSave = async () => {
    const { contextName, annotations } = this.props.data
    const contextValue = this.state.value === '' ? null : this.state.value

    const context = {
      [contextName]: {
        value: contextValue,
        approved: false
      }
    }

    this.setState({
      isSaving: true
    })

    this.props.onValueUpdate(
      annotations[0].fieldName,
      this.state.formattedValue || '',
      true
    )

    try {
      this.props.updateContext(this.props.deal.id, context)
    } catch (e) {
      console.log(e)
    }

    this.setState({
      isSaving: false,
      value: null,
      formattedValue: null
    })

    this.props.onClose()
  }

  get IsDateContext() {
    return (
      this.props.data.context && this.props.data.context.data_type === 'Date'
    )
  }

  onKeyPress(e) {
    if (e.which === 13 || e.keyCode === 13) {
      this.props.handleSave()
    }
  }

  onClose = () => {
    if (this.props.isSaving) {
      return false
    }

    this.position = null
    this.props.onClose()
  }

  onChange = (e, data = {}) => {
    const value =
      _.isUndefined(data.value) === false ? data.value : e.target.value

    this.props.onContextChange(value, data.maskedValue)
  }

  get Position() {
    if (this.position) {
      return this.position
    }

    // get bounds
    const { bounds } = this.props.data

    const position = {
      left: bounds.left + window.scrollX,
      top: bounds.top + window.scrollY
    }

    this.position = position

    return this.position
  }

  render() {
    const { data } = this.props

    const defaultValue = Deal.get.field(this.props.deal, data.contextName)
    const position = this.Position

    const sharedProps = {
      onClose: this.props.onClose,
      isSaving: this.state.isSaving,
      onContextChange: this.onContextChange,
      saveDefaultValue: this.saveDefaultValue,
      value: this.state.value,
      context: DealContext.searchContext(data.contextName),
      defaultValue
    }

    return (
      <ClickOutside onClickOutside={this.onClose}>
        <Container position={position} isDateContext={this.IsDateContext}>
          {this.IsDateContext ? (
            <DateContext {...sharedProps} />
          ) : (
            <StringContext {...sharedProps} />
          )}

          <ActionsContainer>
            <ActionButton
              size="small"
              onClick={this.handleSave}
              disabled={this.state.isSaving}
            >
              {this.props.isSaving ? 'Saving...' : 'Save'}
            </ActionButton>

            <CancelButton
              size="small"
              onClick={() => this.saveDefaultValue('TBD')}
            >
              TBD
            </CancelButton>
            <CancelButton
              size="small"
              onClick={() => this.saveDefaultValue('N/A')}
            >
              N/A
            </CancelButton>
          </ActionsContainer>
        </Container>
      </ClickOutside>
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
