import React from 'react'
import ReactModal from 'react-modal'
import cn from 'classnames'

ReactModal.setAppElement('#app')

export default function BareModal({
  autoHeight,
  children,
  className,
  overlayClassName,
  ...modalProps
}) {
  const baseClassName = 'c-modal__content'
  const autoHeightClassName = `${baseClassName}--height-auto`
  const classes = cn(baseClassName, className, {
    [autoHeightClassName]: autoHeight
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
