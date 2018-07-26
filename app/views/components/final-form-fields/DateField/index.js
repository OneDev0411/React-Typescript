import React from 'react'
import DayPicker from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import Downshift from 'downshift'
import fecha from 'fecha'
import ClickOutSide from 'react-click-outside'

import Card from '../../../components/Card'
import { Item } from '../../../components/Dropdown/Item'
import { Button, Icon } from '../../../components/Dropdown'
import ActionButton from '../../../components/Button/ActionButton'

const formatDate = date => fecha.format(new Date(date), 'MM/DD/YYYY')

export class DateField extends React.Component {
  state = {
    isOpenMenu: false,
    isOpenDatePicker: false
  }

  changeHandler = selectedItem => {
    this.setState(
      {
        isOpenMenu: false,
        isOpenDatePicker: selectedItem.needsDatePicker
      },
      () => this.props.input.onChange(selectedItem)
    )
  }

  stateChangeHandler = changes => {
    let {
      type,
      selectedItem = this.props.input.value,
      isOpen: isOpenMenu = this.state.isOpenMenu
    } = changes

    if (
      selectedItem.needsDatePicker &&
      (Downshift.stateChangeTypes.keyDownArrowUp === type ||
        Downshift.stateChangeTypes.keyDownArrowDown === type)
    ) {
      return this.setState({
        isOpenMenu: false
      })
    }

    const isOpenDatePicker =
      type === Downshift.stateChangeTypes.clickButton &&
      selectedItem.needsDatePicker

    isOpenMenu = isOpenDatePicker ? false : isOpenMenu

    this.setState(
      {
        isOpenMenu,
        isOpenDatePicker
      },
      () => this.props.input.onChange(selectedItem)
    )
  }

  handleOnFocus = () => {
    if (this.props.input.value.needsDatePicker) {
      this.setState({
        isOpenDatePicker: true
      })
    }
  }

  toggleMenu = () =>
    this.setState(({ isOpenMenu }) => ({ isOpenMenu: !isOpenMenu }))

  handleCloseDatePicker = () => this.setState({ isOpenDatePicker: false })

  handleOpenDatePicker = () => this.setState({ isOpenDatePicker: true })

  handleSelectedDate = date => {
    const title = formatDate(date)
    const value = new Date(date).getTime()

    const selectedItem = {
      title,
      value,
      needsDatePicker: true
    }

    this.setState(
      {
        isOpenDatePicker: false
      },
      () => this.props.input.onChange(selectedItem)
    )
  }

  handleClearCalendar = () => {
    const {
      defaultSelectedItem,
      input: { onChange }
    } = this.props

    this.handleCloseDatePicker()
    onChange(defaultSelectedItem)
  }

  renderDatePicker = initialDate => (
    <ClickOutSide onClickOutside={this.handleCloseDatePicker}>
      <DayPicker
        initialMonth={initialDate}
        selectedDays={initialDate}
        modifiers={this.props.datePickerModifiers}
        onDayClick={this.handleSelectedDate}
      />
      <div style={{ textAlign: 'center', marginBottom: '1em' }}>
        <ActionButton onClick={() => this.handleSelectedDate(new Date())}>
          Today
        </ActionButton>
        <button
          style={{ marginLeft: '1em' }}
          onClick={this.handleClearCalendar}
          className="c-new-address-modal__cancel-btn"
        >
          Clear
        </button>
      </div>
    </ClickOutSide>
  )

  render() {
    const { isOpenDatePicker, isOpenMenu } = this.state
    const { items, input, id: buttonId, datePickerModifiers } = this.props

    if (items.length === 0) {
      return (
        <div style={{ marginRight: '0.5em' }}>
          <Button
            onClick={this.handleOpenDatePicker}
            onFocus={this.handleOnFocus}
          >
            {formatDate(input.value)}
            <Icon isOpen={isOpenDatePicker} />
          </Button>
          {isOpenDatePicker && this.renderDatePicker()}
        </div>
      )
    }

    return (
      <Downshift
        {...input}
        selectedItem={input.value}
        onChange={this.changeHandler}
        itemToString={item => item.title}
        onStateChange={this.stateChangeHandler}
        render={({
          selectedItem,
          getItemProps,
          getButtonProps,
          highlightedIndex
        }) => {
          const initialDate = selectedItem.value
            ? new Date(selectedItem.value)
            : new Date()

          return (
            <div style={{ marginRight: '0.5em' }}>
              <Button
                {...getButtonProps({
                  id: buttonId,
                  name: input.name,
                  onFocus: this.handleOnFocus
                })}
              >
                {selectedItem.title !== 'Custom Date'
                  ? selectedItem.title
                  : formatDate(selectedItem.value)}
                <Icon isOpen={isOpenMenu || isOpenDatePicker} />
              </Button>
              <div style={{ position: 'relative' }}>
                <Card
                  depth={3}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 3,
                    zIndex: 1,
                    overflow: 'hidden'
                  }}
                >
                  {isOpenMenu &&
                    items.map((item, index) => {
                      const props = {
                        item,
                        ...getItemProps({
                          item,
                          isActive: highlightedIndex === index,
                          isSelected: selectedItem === item
                        })
                      }

                      return (
                        <Item {...props} key={item.title}>
                          {item.title}
                        </Item>
                      )
                    })}
                  {isOpenDatePicker && (
                    <ClickOutSide onClickOutside={this.handleCloseDatePicker}>
                      <DayPicker
                        initialMonth={initialDate}
                        selectedDays={initialDate}
                        modifiers={datePickerModifiers}
                        onDayClick={this.handleSelectedDate}
                      />
                      <div style={{ textAlign: 'center', marginBottom: '1em' }}>
                        <ActionButton
                          onClick={() => this.handleSelectedDate(new Date())}
                        >
                          Today
                        </ActionButton>
                        <button
                          style={{ marginLeft: '1em' }}
                          onClick={this.handleClearCalendar}
                          className="c-new-address-modal__cancel-btn"
                        >
                          Clear
                        </button>
                      </div>
                    </ClickOutSide>
                  )}
                </Card>
              </div>
            </div>
          )
        }}
      />
    )
  }
}
