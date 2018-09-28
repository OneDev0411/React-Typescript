import React from 'react'
import Downshift from 'downshift'
import matchSorter from 'match-sorter'

import Card from '../Card'
import { Item } from './Item'
import { SearchInput } from './SearchInput'
import ArrowDropDown from '../SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'
import ActionButton from '../Button/ActionButton'
import { grey } from '../../utils/colors'

export const Button = ActionButton.extend`
  position: relative;
  width: ${props => (props.fullWidth ? '100%' : 'auto')};
  display: flex;
  align-items: center;
  justify-content: ${props => (props.fullWidth ? 'space-between' : 'initial')};
  font-weight: normal;

  &:focus {
    background-color: ${grey.A100};
  }
`

export const Icon = ArrowDropDown.extend`
  fill: #000;
  transform: ${({ isOpen }) => (isOpen ? 'rotateX(180deg)' : 'none')};
`

export const Dropdown = ({
  items,
  input,
  style,
  icons = {},
  onSelect,
  fullWidth,
  fullHeight,
  hasSearch,
  id: buttonId,
  itemToString = item => item.title,
  itemRenderer,
  defaultSelectedItem,
  buttonRenderer,
  pullRight = false
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
      if (inputValue === selectedItem && selectedItem.title) {
        inputValue = ''
      }

      const hasIcon = Object.keys(icons).length > 0

      return (
        <div style={style}>
          {buttonRenderer ? (
            buttonRenderer(
              getButtonProps({
                isBlock: fullWidth,
                id: buttonId,
                isOpen,
                name: input.name,
                value: selectedItem && selectedItem.title,
                icon:
                  hasIcon &&
                  icons[selectedItem.title] &&
                  icons[selectedItem.title].icon
                    ? icons[selectedItem.title].icon
                    : null,
                iconColor:
                  hasIcon &&
                  icons[selectedItem.title] &&
                  icons[selectedItem.title].color
                    ? icons[selectedItem.title].color
                    : '#000'
              })
            )
          ) : (
            <Button
              appearance="outline"
              noBorder
              {...getButtonProps({
                fullWidth,
                id: buttonId,
                name: input.name
              })}
            >
              {selectedItem &&
                selectedItem.icon && (
                  <selectedItem.icon
                    style={{
                      marginRight: '0.5em',
                      fill: selectedItem.iconColor
                    }}
                  />
                )}
              {selectedItem && selectedItem.title}
              <Icon isOpen={isOpen} />
            </Button>
          )}
          <div style={{ position: 'relative' }}>
            {isOpen && (
              <Card
                depth={3}
                style={{
                  maxHeight: fullHeight ? 'auto' : '200px',
                  width: fullWidth ? '100%' : 'auto',
                  position: 'absolute',
                  left: pullRight ? 'auto' : 0,
                  right: pullRight ? 0 : 'auto',
                  top: 3,
                  zIndex: 2,
                  overflowY: fullHeight ? 'initial' : 'scroll'
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
                  let icon = null
                  let iconColor = '#000'
                  const { title } = item

                  if (hasIcon && icons[title] && icons[title].icon) {
                    icon = icons[title].icon

                    if (icons[title].color) {
                      iconColor = icons[title].color
                    }
                  }

                  item = {
                    ...item,
                    icon,
                    iconColor
                  }

                  const props = {
                    item,
                    ...getItemProps({
                      item,
                      isActive: highlightedIndex === index,
                      isSelected: selectedItem.title === title
                    })
                  }

                  return itemRenderer ? (
                    itemRenderer(props)
                  ) : (
                    <Item {...props} key={item.value}>
                      {item.icon && <item.icon />}
                      {`${title}${item.hint ? ` (${item.hint})` : ''}`}
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
