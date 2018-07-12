import React from 'react'
import Downshift from 'downshift'
import matchSorter from 'match-sorter'

import Card from '../Card'
import { Item } from './Item'
import ShadowButton from '../Button/ShadowButton'
import { SearchInput } from './SearchInput'
import ArrowDropDown from '../SvgIcons/ArrowDropDown/IconArrowDropDown'

export const Button = ShadowButton.extend`
  position: relative;
  width: ${props => (props.fullWidth ? '100%' : 'auto')};
  display: flex;
  align-items: center;
  justify-content: ${props => (props.fullWidth ? 'space-between' : 'initial')};
  font-weight: normal;

  &:focus {
    outline-width: 2px;
  }
`

export const Icon = ArrowDropDown.extend`
  position: relative;
  align-self: flex-end;
  display: flex;
  width: 2em;
  height: 2em;
  fill: #8da2b5;
  transform: ${({ isOpen }) => (isOpen ? 'rotateX(180deg)' : 'none')};
`

export const Dropdown = ({
  items,
  input,
  style,
  onSelect,
  fullWidth,
  hasSearch,
  id: buttonId,
  itemToString = item => item.title,
  itemRenderer,
  defaultSelectedItem
}) => (
  <Downshift
    {...input}
    onChange={item => {
      input.onChange(item)
    }}
    onSelect={onSelect}
    itemToString={itemToString}
    selectedItem={input.value || defaultSelectedItem}
    render={({
      isOpen,
      inputValue,
      selectedItem,
      getItemProps,
      getInputProps,
      getButtonProps,
      highlightedIndex
    }) => {
      if (inputValue === selectedItem.title) {
        inputValue = ''
      }

      return (
        <div style={style}>
          <Button
            {...getButtonProps({
              fullWidth,
              id: buttonId,
              name: input.name
            })}
          >
            {selectedItem && selectedItem.title}
            <Icon isOpen={isOpen} />
          </Button>
          <div style={{ position: 'relative' }}>
            {isOpen && (
              <Card
                depth={3}
                style={{
                  maxHeight: 200,
                  width: fullWidth ? '100%' : 'auto',
                  position: 'absolute',
                  left: 0,
                  top: 3,
                  zIndex: 1,
                  overflowY: 'scroll'
                }}
                className="u-scrollbar--thinner--self"
              >
                {hasSearch && (
                  <div style={{ padding: '1em 1em 0.5em' }}>
                    <SearchInput
                      {...getInputProps({
                        value: inputValue,
                        placeholder: 'Enter a keyword'
                      })}
                    />
                  </div>
                )}
                {(hasSearch && inputValue
                  ? matchSorter(items, inputValue, { keys: ['title'] })
                  : items
                ).map((item, index) => {
                  const props = {
                    item,
                    ...getItemProps({
                      item,
                      isActive: highlightedIndex === index,
                      isSelected: selectedItem === item
                    })
                  }

                  return itemRenderer ? (
                    itemRenderer(props)
                  ) : (
                    <Item {...props} key={item.title}>
                      {item.title}
                    </Item>
                  )
                })}
              </Card>
            )}
          </div>
        </div>
      )
    }}
  />
)
