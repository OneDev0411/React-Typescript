import React from 'react'
import Downshift from 'downshift'

import Card from '../Card'
import { Item } from '../Dropdown/Item'
import DropButton from '../Button/DropButton'

export class BasicDropdown extends React.Component {
  state = {
    isOpen: false
  }

  toggleOpenMenu = () =>
    this.setState(
      state => ({
        isOpen: !state.isOpen
      }),
      () => {
        const cb = this.state.isOpen ? this.props.onOpen : this.props.onClose

        if (cb) {
          cb()
        }
      }
    )

  render() {
    const {
      buttonIcon,
      buttonIconSize = 'large',
      buttonSize,
      buttonStyle = {},
      buttonText,
      buttonAppearance,
      buttonRenderer,
      disabled,
      items,
      style,
      pullTo,
      onSelect,
      onChange,
      fullWidth = false,
      fullHeight = false,
      itemRenderer,
      defaultSelectedItem,
      selectedItem,
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
        onOuterClick={this.toggleOpenMenu}
        isOpen={this.state.isOpen}
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
        selectedItem={selectedItem}
        render={downshift => (
          <div style={{ position: 'relative', ...style }}>
            {buttonRenderer ? (
              buttonRenderer({
                onClick: this.toggleOpenMenu,
                disabled,
                isBlock: fullWidth,
                noBorder,
                isOpen: downshift.isOpen,
                selectedItem: downshift.selectedItem,
                text:
                  buttonText ||
                  (downshift.selectedItem && downshift.selectedItem.label)
              })
            ) : (
              <DropButton
                onClick={this.toggleOpenMenu}
                disabled={disabled}
                iconLeft={buttonIcon}
                iconSize={buttonIconSize}
                isBlock={isBlock}
                isOpen={downshift.isOpen}
                size={buttonSize}
                noBorder={noBorder}
                appearance={buttonAppearance || 'outline'}
                style={buttonStyle}
                text={
                  buttonText ||
                  (downshift.selectedItem && downshift.selectedItem.label)
                }
              />
            )}
            {downshift.isOpen && (
              <Card
                depth={3}
                style={{
                  minWidth: fullWidth ? '100%' : 'auto',
                  maxHeight: fullHeight ? 'auto' : maxHeight,
                  overflowY: fullHeight ? 'auto' : 'scroll',
                  position: 'absolute',
                  left: pullTo !== 'right' ? 0 : 'auto',
                  right: pullTo === 'right' ? 0 : 'auto',
                  top: upsideDown ? 'auto' : 'calc(100% + 8px)',
                  bottom: upsideDown ? 'calc(100% + 0.5em)' : 'auto',
                  zIndex: 6,
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
                      onClick: this.toggleOpenMenu,
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
                      ref={ref =>
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
