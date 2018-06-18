import React from 'react'
import Downshift from 'downshift'

import Card from '../Card'
import { Item } from './Item'
import { Button, Icon } from './styled'

export const BasicDropdown = ({
  buttonStyle = {},
  disabled,
  items,
  style,
  onSelect,
  onChange,
  fullWidth,
  itemToString,
  itemRenderer,
  selectedItem
}) => (
  <Downshift
    onChange={onChange}
    onSelect={onSelect}
    itemToString={itemToString}
    selectedItem={selectedItem}
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
            disabled,
            style: {
              width: '100%',
              height: '32px',
              position: 'relative',
              pointerEvents: disabled ? 'none' : 'initial',
              ...buttonStyle,
              backgroundColor: isOpen
                ? '#f8fafb'
                : buttonStyle.backgroundColor || '#fff'
            },
            fullWidth
          })}
        >
          {selectedItem && selectedItem.label}
          <Icon
            isOpen={isOpen}
            style={{ fill: '#506379', width: '24px', height: '24px' }}
          />
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
              {items.map((item, index) => {
                const props = {
                  item,
                  ...getItemProps({
                    item,
                    isActive: highlightedIndex === index,
                    isSelected: selectedItem.label === item.label
                  })
                }

                return itemRenderer ? (
                  itemRenderer(props)
                ) : (
                  <Item {...props} key={item.label}>
                    {item.label}
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
