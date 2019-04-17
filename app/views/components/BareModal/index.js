import React from 'react'
import ReactModal from 'react-modal'
import cn from 'classnames'

export default function BareModal({
  autoHeight,
  hasDefaultPadding,
  children,
  className,
  overlayClassName,
  ...modalProps
}) {
  const classes = cn('c-modal__content', className, {
    'modal__content--padding': hasDefaultPadding,
    'modal__content--height-auto': autoHeight
  })

  return (
    <ReactModal
      {...modalProps}
      className={classes}
      overlayClassName={`c-modal__overlay ${overlayClassName}`}
    >
      {children}
    </ReactModal>
  )
}
