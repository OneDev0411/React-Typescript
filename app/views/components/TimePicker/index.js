import React from 'react'
import PropTypes from 'prop-types'
import ReactTimePicker from 'react-time-picker'

import { Container } from './styled'

export class TimePicker extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    defaultSelectedDate: PropTypes.instanceOf(Date),
    datePickerModifiers: PropTypes.shape()
  }

  state = {
    time: this.props.defaultTime || new Date()
  }

  onChangeHandler = time => {
    this.setState(() => ({ time }), () => this.props.onChange(this.state.time))
  }

  render() {
    return (
      <Container>
        <ReactTimePicker
          disableClock
          clearIcon={null}
          onChange={this.onChangeHandler}
          value={this.state.time}
        />
      </Container>
    )
  }
}
