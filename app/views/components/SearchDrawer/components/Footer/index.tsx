import React from 'react'

import Drawer from 'components/OverlayDrawer'
import ActionButton from 'components/Button/ActionButton'

interface ButtonPropsType {
  selectedItemsCount: number
  buttonProps: {
    onClick: () => void
    disabled: boolean
  }
}

interface FooterPropsType {
  multipleSelection: boolean
  selectedItemsCount: number
  renderAction: (props: ButtonPropsType) => void
  handleSelectMultipleItems: () => void
}

function Footer(props: FooterPropsType) {
  if (!props.multipleSelection) {
    return null
  }

  let content
  const isButtonDisabled = props.selectedItemsCount === 0
  const buttonProps = {
    onClick: props.handleSelectMultipleItems,
    disabled: isButtonDisabled
  }

  // Detecting and putting proper action button in `content`
  if (props.renderAction) {
    content = props.renderAction({
      selectedItemsCount: props.selectedItemsCount,
      buttonProps
    })
  } else {
    content = (
      <ActionButton {...buttonProps}>
        {`${props.selectedItemsCount} Items Selected`}
      </ActionButton>
    )
  }

  return (
    <Drawer.Footer style={{ flexDirection: 'row-reverse' }}>
      {content}
    </Drawer.Footer>
  )
}

export default Footer
