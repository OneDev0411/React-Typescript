import React from 'react'
import ClickOutside from 'react-click-outside'
import _ from 'underscore'

import DatePicker from '../../../components/DatePicker'

import Input from 'components/Input'

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

  render() {
    const { field } = this.props

    if (this.props.isDateContext) {
      return (
        <DatePicker
          show
          saveText="Save Date"
          initialDate={new Date()}
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
