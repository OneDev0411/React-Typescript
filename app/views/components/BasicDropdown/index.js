import React from 'react'
import Downshift from 'downshift'

import Card from '../Card'
import { Item } from '../Dropdown/Item'
import DropButton from '../Button/DropButton'

export class BasicDropdown extends React.Component {
  render() {
    const {
      buttonIcon,
      buttonSize,
      buttonStyle = {},
      buttonText,
      buttonRenderer,
      disabled,
      items,
      style,
      pullTo,
      onSelect,
      onChange,
      fullWidth = false,
      itemRenderer,
      defaultSelectedItem,
      menuStyle = {},
      isBlock = true,
      noBorder = false,
      maxHeight = 200,
      itemToString = item => item.label,
      upsideDown = false,
      centerSelected = false
    } = this.props

    return (
      <Downshift
        onChange={onChange}
        onSelect={onSelect}
        onStateChange={(changes, downshift) => {
          changes.isOpen &&
            centerSelected &&
            this.refs[downshift.selectedItem.value].scrollIntoView({
              behavior: 'instant',
              block: 'center'
            })
        }}
        itemToString={() => (buttonText ? () => '' : itemToString)}
        defaultSelectedItem={defaultSelectedItem}
        render={downshift => (
          <div style={{ position: 'relative', ...style }}>
            {buttonRenderer ? (
              buttonRenderer({
                ...downshift.getButtonProps({
                  disabled,
                  isBlock: fullWidth,
                  noBorder,
                  isOpen: downshift.isOpen,
                  selectedItem: downshift.selectedItem
                })
              })
            ) : (
              <DropButton
                {...downshift.getButtonProps({
                  disabled,
                  iconLeft: buttonIcon,
                  isBlock,
                  isOpen: downshift.isOpen,
                  size: buttonSize,
                  noBorder,
                  style: buttonStyle,
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
                  maxHeight,
                  minWidth: fullWidth ? '100%' : 'auto',
                  position: 'absolute',
                  left: pullTo !== 'right' ? 0 : 'auto',
                  right: pullTo === 'right' ? 0 : 'auto',
                  top: upsideDown ? 'auto' : 'calc(100% + 8px)',
                  bottom: upsideDown ? 'calc(100% + 0.5em)' : 'auto',
                  zIndex: 2,
                  overflowY: 'auto',
                  ...menuStyle
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
                    <Item
                      {...props}
                      key={item.value}
                      innerRef={ref =>
                        (this.refs = {
                          ...this.refs,
                          [item.value]: ref
                        })
                      }
                    >
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
  }
}
