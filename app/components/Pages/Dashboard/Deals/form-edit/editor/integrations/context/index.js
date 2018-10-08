import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ClickOutside from 'react-click-outside'

import { updateContext } from '../../../../../../../../store_actions/deals'

import Deal from '../../../../../../../../models/Deal'
import DealContext from '../../../../../../../../models/DealContext'

import ActionButton from 'components/Button/ActionButton'
import CancelButton from 'components/Button/CancelButton'

import { Container, ActionsContainer } from './styled'

import StringContext from './string-context'
import DateContext from './date-context'

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

  saveDefaultValue = value => {
    const { annotations } = this.props.data

    const contextName = annotations[0].fieldName

    this.props.onValueUpdate(contextName, value, true)
    this.props.onClose()
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

  getValue() {
    const { value } = this.props

    return value !== null ? value : ''
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

    if (!data || !this.props.isOpen) {
      return false
    }

    const defaultValue = Deal.get.field(this.props.deal, data.contextName)
    const isDateContext = data.context && data.context.data_type === 'Date'
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
        <Container position={position} isDateContext={isDateContext}>
          {isDateContext ? (
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
              {this.props.isSaving ? 'Saving...' : 'Save Value'}
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
