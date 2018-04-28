import React from 'react'
import Downshift from 'downshift'

import Card from '../Card'
import { Item } from './Item'
import ShadowButton from '../Button/ShadowButton'
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
            fullWidth,
            id: buttonId,
            name: input.name
          })}
        >
          {selectedItem.title}
          <Icon isOpen={isOpen} fullWidth />
        </Button>
        <div style={{ position: 'relative' }}>
          {isOpen && (
            <Card
              depth={3}
              style={{
                width: fullWidth ? '100%' : 'auto',
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
