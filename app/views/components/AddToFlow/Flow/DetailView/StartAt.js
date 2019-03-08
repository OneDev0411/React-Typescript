import React from 'react'
import fecha from 'fecha'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
import ClickOutSide from 'react-click-outside'

import DatePicker from 'components/DatePicker'
import Icon from 'components/SvgIcons/Calendar2/IconCalendar'

import { borderColor, grey } from 'views/utils/colors'

import { StartAtButton, CalendarWrapper } from './styled'

export class StartAt extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired
  }

  state = {
    isOpen: false,
    selectedDate: new Date()
  }

  open = () => this.setState({ isOpen: true })

  close = () => this.setState({ isOpen: false })

  onChange = selectedDate => {
    this.setState({ selectedDate }, () => {
      this.close()
      this.props.onChange(new Date(selectedDate).getTime() / 1000)
    })
  }

  render() {
    return (
      <div
        style={{
          position: 'relative',
          paddingBottom: '0.5em',
          borderBottom: `1px solid ${borderColor}`
        }}
      >
        <div
          style={{
            color: grey.A900,
            fontSize: '0.875rem',
            marginBottom: '0.5em'
          }}
        >
          Starting on:
        </div>
        <Flex alignCenter>
          <Icon style={{ width: '1em', height: '1em' }} />
          <StartAtButton onClick={this.open}>
            {fecha.format(this.state.selectedDate, 'mediumDate')}
          </StartAtButton>
        </Flex>
        {this.state.isOpen && (
          <CalendarWrapper depth={2}>
            <ClickOutSide onClickOutside={this.close}>
              <DatePicker
                onChange={this.onChange}
                selectedDate={this.state.selectedDate}
              />
            </ClickOutSide>
          </CalendarWrapper>
        )}
      </div>
    )
  }
}
