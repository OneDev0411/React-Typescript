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
  itemToString = item => item.label,
  itemRenderer,
  defaultSelectedItem
}) => (
  <Downshift
    onChange={onChange}
    onSelect={onSelect}
    itemToString={itemToString}
    defaultSelectedItem={defaultSelectedItem}
    render={downshift => (
      <div style={{ position: 'relative', ...style }}>
        <Button
          {...downshift.getButtonProps({
            disabled,
            style: {
              width: '100%',
              height: '32px',
              pointerEvents: disabled ? 'none' : 'initial',
              ...buttonStyle,
              backgroundColor: downshift.isOpen
                ? '#f8fafb'
                : buttonStyle.backgroundColor || '#fff'
            },
            fullWidth
          })}
        >
          {downshift.selectedItem && downshift.selectedItem.label}
          <Icon
            isOpen={downshift.isOpen}
            style={{
              width: '20px',
              height: '20px',
              fill: '#000',
              marginTop: '3px',
              marginLeft: '8px'
            }}
          />
        </Button>
        {downshift.isOpen && (
          <Card
            depth={3}
            style={{
              maxHeight: 200,
              minWidth: fullWidth ? '100%' : 'auto',
              position: 'absolute',
              left: 0,
              top: '105%',
              zIndex: 1,
              overflowY: 'auto'
            }}
            className="u-scrollbar--thinner--self"
          >
            {items.map((item, index) => {
              const props = {
                item,
                ...downshift.getItemProps({
                  item,
                  isActive: downshift.highlightedIndex === index,
                  isSelected: downshift.selectedItem.label === item.label
                })
              }

              return itemRenderer ? (
                itemRenderer(props)
              ) : (
                <Item {...props} key={item.value}>
                  {item.label}
                </Item>
              )
            })}
          </Card>
        )}
      </div>
    )}
  />
)
