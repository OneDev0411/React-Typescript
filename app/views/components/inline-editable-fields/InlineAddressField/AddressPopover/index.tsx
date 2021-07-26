import React, { useRef, useEffect } from 'react'

import { Popover } from '@material-ui/core'
import { PopoverActions, PopoverProps } from '@material-ui/core/Popover'

import { InlineAddressForm } from '../InlineAddressForm'

interface Props {
  isOpen: boolean
  address: string | object
  formStyle?: React.CSSProperties
  showDeleteButton?: boolean
  PopoverProps?: Partial<PopoverProps>
  preSaveFormat?: (values: object, originalValues: object) => void
  postLoadFormat?: (values: object) => void
  onDelete?: () => void
  onSubmit: () => void
  onClose: () => void
}

export function AddressPopover({
  isOpen,
  address,
  formStyle,
  PopoverProps,
  showDeleteButton = false,
  preSaveFormat,
  postLoadFormat,
  onDelete,
  onSubmit,
  onClose
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const popoverAction = useRef<PopoverActions | null>(null)

  useEffect(() => {
    if (isOpen) {
      popoverAction.current && popoverAction.current.updatePosition()
    }
  }, [isOpen])

  return (
    <div ref={containerRef}>
      <Popover
        action={popoverAction}
        id={isOpen ? 'inline-address-popover' : undefined}
        open={isOpen}
        anchorEl={isOpen ? containerRef && containerRef.current : null}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        style={{
          zIndex: 1004,
          ...formStyle
        }}
        {...PopoverProps}
      >
        <InlineAddressForm
          address={address}
          preSaveFormat={preSaveFormat}
          postLoadFormat={postLoadFormat}
          showDeleteButton={showDeleteButton}
          handleCancel={onClose}
          handleDelete={onDelete}
          handleSubmit={onSubmit}
        />
      </Popover>
    </div>
  )
}
