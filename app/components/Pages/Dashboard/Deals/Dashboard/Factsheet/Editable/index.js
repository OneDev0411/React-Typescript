import React from 'react'
import ClickOutside from 'react-click-outside'
import _ from 'underscore'

import Input from 'components/Input'
import { getField } from 'models/Deal/helpers/context'

import DatePicker from '../../../components/DatePicker'

import { Editable as Container, ActionButton } from '../styled'

export default class Editable extends React.Component {
  state = {
    value: this.props.defaultValue
  }

  onKeyPress = e => {
    if (e.which === 13 || e.keyCode === 13) {
      this.onClickSave()
    }
  }

  onChangeDate = date => this.props.onSave(this.props.field, date)

  onClickSave = () => this.props.onSave(this.props.field, this.state.value)

  get InitialCriticalDate() {
    const timestamp = getField(this.props.deal, this.props.field.key)

    if (!timestamp) {
      return new Date()
    }

    return new Date(timestamp * 1000)
  }

  render() {
    const { field } = this.props

    if (this.props.isDateContext) {
      return (
        <DatePicker
          show
          containerStyle={{
            right: '0',
            left: 'inherit'
          }}
          saveText="Save Date"
          initialDate={this.InitialCriticalDate}
          onClose={this.props.onCancel}
          onSelectDate={this.onChangeDate}
        />
      )
    }

    return (
      <ClickOutside
        onClickOutside={this.props.onCancel}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <Container>
          <Input
            data-type={field.format || field.data_type}
            {...field.properties}
            autoFocus
            maxLength={15}
            value={this.state.value}
            placeholder={field.label}
            onKeyPress={this.onKeyPress}
            onChange={(e, data = {}) =>
              this.setState({
                value: !_.isUndefined(data.value) ? data.value : e.target.value
              })
            }
          />

          <ActionButton onClick={this.onClickSave}>Save</ActionButton>
        </Container>
      </ClickOutside>
    )
  }
}
