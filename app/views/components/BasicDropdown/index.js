import React from 'react'
import Downshift from 'downshift'

import Card from '../Card'
import { Item } from './Item'
import DropButton from '../Button/DropButton'

export const BasicDropdown = ({
  buttonSize,
  buttonText,
  buttonRenderer,
  disabled,
  items,
  style,
  onSelect,
  onChange,
  fullWidth,
  buttonIcon,
  itemToString = item => item.label,
  itemRenderer,
  defaultSelectedItem
}) => (
  <Downshift
    onChange={onChange}
    onSelect={onSelect}
    itemToString={() => (buttonText ? () => '' : itemToString)}
    defaultSelectedItem={defaultSelectedItem}
    render={downshift => (
      <div style={{ position: 'relative', ...style }}>
        {buttonRenderer ? (
          buttonRenderer(
            ...downshift.getButtonProps({
              disabled,
              isOpen: downshift.isOpen
            })
          )
        ) : (
          <DropButton
            {...downshift.getButtonProps({
              disabled,
              iconLeft: buttonIcon,
              isBlock: true,
              isOpen: downshift.isOpen,
              size: buttonSize,
              text:
                buttonText ||
                (downshift.selectedItem && downshift.selectedItem.label)
            })}
          />
        )}
        {downshift.isOpen && (
          <Card
            depth={3}
            style={{
              maxHeight: 200,
              minWidth: fullWidth ? '100%' : 'auto',
              position: 'absolute',
              left: 0,
              top: 'calc(100% + 8px)',
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
                  isSelected:
                    downshift.selectedItem &&
                    downshift.selectedItem.label === item.label
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
