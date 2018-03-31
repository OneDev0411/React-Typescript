import React from 'react'
import styled from 'styled-components'
import Downshift from 'downshift'

import Card from '../Card'
import { Item } from './Item'
import ArrowDropDown from '../SvgIcons/ArrowDropDown/IconArrowDropDown'

export const Button = styled.button`
  display: flex;
  align-items: center;
  padding: 0;
  color: #2196f3;
  border-width: 0;

  &:focus {
    outline-width: 2px;
  }
`

export const Icon = ArrowDropDown.extend`
  position: relative;
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
  id: buttonId,
  itemToString,
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
      selectedItem,
      getItemProps,
      getButtonProps,
      highlightedIndex
    }) => (
      <div style={style}>
        <Button
          {...getButtonProps({
            id: buttonId,
            name: input.name
          })}
        >
          {selectedItem.title}
          <Icon isOpen={isOpen} />
        </Button>
        <div style={{ position: 'relative' }}>
          {isOpen && (
            <Card
              depth={3}
              style={{
                maxHeight: 200,
                position: 'absolute',
                left: 0,
                top: 3,
                zIndex: 1,
                overflowY: 'scroll'
              }}
              className="u-scrollbar--thinner--self"
            >
              {items.map((item, index) => {
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
    )}
  />
)
