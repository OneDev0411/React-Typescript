import React from 'react'
import DayPicker from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import Downshift from 'downshift'
import fecha from 'fecha'
import ClickOutSide from 'react-click-outside'

import Card from '../../../../../../../../components/Card'
import { Item } from '../../../DropdownItem'
import { Button, Icon } from '../../../../../../../../components/Dropdown'
import ActionButton from '../../../../../../../../components/Button/ActionButton'

const formatDate = date => fecha.format(new Date(date), 'MM/DD/YYYY')

class Dropdown extends React.Component {
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

    // console.log(changes)

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

  toggleMenu = () => {
    this.setState(({ isOpenMenu }) => ({ isOpenMenu: !isOpenMenu }))
  }

  handleOnCloseDatePicker = () => {
    this.setState({
      isOpenDatePicker: false
    })
  }

  handleOnOpenDatePicker = () => {
    this.setState({
      isOpenDatePicker: true
    })
  }

  handleOnSelectDate = date => {
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
    const { defaultSelectedItem, input: { onChange } } = this.props

    this.handleOnCloseDatePicker()
    onChange(defaultSelectedItem)
  }

  render() {
    const { isOpenDatePicker, isOpenMenu } = this.state
    const { items, input, id: buttonId, datePickerModifiers } = this.props

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
                    <ClickOutSide onClickOutside={this.handleOnCloseDatePicker}>
                      <DayPicker
                        initialMonth={initialDate}
                        selectedDays={initialDate}
                        modifiers={datePickerModifiers}
                        onDayClick={this.handleOnSelectDate}
                      />
                      <div style={{ textAlign: 'center', marginBottom: '1em' }}>
                        <ActionButton
                          onClick={() => this.handleOnSelectDate(new Date())}
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

export default Dropdown

function getInitialMonth(item) {
  let date = new Date()

  if (item.value) {
    date = new Date(item.value)
  }

  let month = date.getMonth() + 1
  const year = date.getFullYear().toString()

  month = month < 10 ? `0${month}` : month

  return new Date(`${year}, ${month}`)
}
