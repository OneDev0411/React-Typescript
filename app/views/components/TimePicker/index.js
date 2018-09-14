import React from 'react'
import PropTypes from 'prop-types'
import ReactTimePicker from 'react-time-picker'

import { Container } from './styled'

export class TimePicker extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    defaultTime: PropTypes.instanceOf(Date)
  }

  static defaultProps = {
    defaultTime: new Date()
  }

  state = {
    time: this.props.defaultTime
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
          value={this.state.time}
          onChange={this.onChangeHandler}
        />
      </Container>
    )
  }
}
