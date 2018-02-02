import React, { Component } from 'react'
import Downshift from 'downshift'
import styled from 'styled-components'
import matchSorter from 'match-sorter'

const ErrorMessage = styled.span`
  color: red;
  margin-left: 2rem;
`

const Container = styled.div`
  position: relative;
  border-bottom: 1px solid ${({ isInvalid }) => (isInvalid ? 'red' : '#dce5eb')};
`

const Options = styled.div`
  position: absolute;
  top: 90%;
  left: 0.75rem;
  z-index: 1;
  max-height: 100px;
  overflow-y: scroll;
  border-radius: 3px;
  background: #fff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
`

const Item = styled.div`
  display: block;
  padding: 0.8rem 1.1rem;
  line-height: 1em;
  font-size: 1.5rem;
  font-weight: ${props => (props.isSelected ? '500' : 'normal')};
  text-transform: none;
  white-space: normal;
  word-wrap: normal;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.87);
  background-color: ${props => (props.isActive ? 'lightgrey' : 'white')};
`

class InputWithSelect extends Component {
  constructor(props) {
    super(props)

    const { items } = this.props

    this.state = {
      items,
      selectedItem: items[0]
    }
  }

  handleInputChange = value => {
    const nextState = { selectedItem: value }

    this.setState(nextState)
    this.props.onChangeHandler(value)
  }

  changeHandler = selectedItem => {
    this.setState({ selectedItem })
  }

  handleItemToString = item => (typeof item !== 'string' ? '' : item)

  render() {
    const {
      isRequired, isInvalid, title, errorText, placeholder
    } = this.props
    const { items, selectedItem } = this.state

    return (
      <Downshift
        selectedItem={selectedItem}
        onChange={this.changeHandler}
        itemToString={this.handleItemToString}
        onStateChange={this.stateChangeHandler}
        onInputValueChange={this.handleInputChange}
        render={({
          getInputProps,
          getItemProps,
          getLabelProps,
          highlightedIndex,
          inputValue,
          isOpen,
          selectedItem
        }) => (
          <div style={{ width: '100%' }}>
            <Container>
              <div>
                <label
                  {...getLabelProps({
                    style: { cursor: 'pointer' }
                  })}
                >
                  {title}
                </label>
                {isRequired && (
                  <sup
                    style={{
                      color: 'red',
                      fontSize: '1.5rem',
                      verticalAlign: 'sub'
                    }}
                  >
                    *
                  </sup>
                )}
                {isInvalid && <ErrorMessage>{errorText}</ErrorMessage>}
              </div>
              <input
                {...getInputProps({
                  placeholder,
                  style: { width: '100%' }
                })}
              />
              {isOpen &&
                items && (
                  <Options>
                    {(inputValue ? matchSorter(items, inputValue) : items).map((item, index) => (
                      <Item
                        key={item}
                        {...getItemProps({
                            item,
                            isSelected: selectedItem === item,
                            isActive: highlightedIndex === index
                          })}
                      >
                        {item}
                      </Item>
                      ))}
                  </Options>
                )}
            </Container>
          </div>
        )}
      />
    )
  }
}

export default InputWithSelect
