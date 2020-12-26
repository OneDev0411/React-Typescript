import React from 'react'
import Downshift from 'downshift'
import matchSorter from 'match-sorter'
import { mdiChevronDown } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import Card from '../Card'
import { Item } from './Item'
import { SearchInput } from './SearchInput'
import { Button } from './styles'

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
  pullRight = false,
  noBorder = true,
  buttonStyle = {},
  ...props
}) => (
  <Downshift
    {...input}
    onChange={item => {
      input.onChange(item)
    }}
    onSelect={onSelect}
    itemToString={itemToString}
    selectedItem={defaultSelectedItem || input.value}
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
              data-test={`${input.name}-select`}
              noBorder={noBorder}
              {...getButtonProps({
                fullWidth,
                style: buttonStyle,
                id: buttonId,
                name: input.name
              })}
            >
              {selectedItem && selectedItem.icon && (
                <selectedItem.icon
                  style={{
                    marginRight: '0.5em',
                    fill: selectedItem.iconColor
                  }}
                />
              )}
              {selectedItem && selectedItem.title}
              <SvgIcon path={mdiChevronDown} rotate={isOpen ? 180 : 0} />
            </Button>
          )}
          <div style={{ position: 'relative' }} {...props}>
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
                    itemRenderer(props, item)
                  ) : (
                    <Item
                      {...props}
                      key={item.value}
                      data-test={`${input.name}-select-option-${item.value}`}
                    >
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

export { Button } from './styles'
