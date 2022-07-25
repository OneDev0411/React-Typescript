import React, { ReactNode } from 'react'

import cn from 'classnames'
import ReactModal, { Props as ReactModalProps } from 'react-modal'

if (document.body.querySelector('#app')) {
  ReactModal.setAppElement('#app')
}

interface Props extends ReactModalProps {
  autoHeight?: boolean
  offOverflow?: boolean
  large?: boolean
  xLarge?: boolean
  children: ReactNode
  className?: string
  overlayClassName?: string
}

export default function BareModal({
  offOverflow,
  autoHeight,
  children,
  className,
  overlayClassName,
  large,
  xLarge,
  ...modalProps
}: Props) {
  if (process.env.DISABLE_MODAL) {
    return <>{children}</>
  }

  const baseClassName = 'c-modal__content'
  const autoHeightClassName = `${baseClassName}--height-auto`
  const offOverflowClassName = `${baseClassName}--off-overflow`
  const largeClassName = `${baseClassName}--large`
  const xLargeClassName = `${baseClassName}--xLarge`
  const classes = cn(baseClassName, className, {
    [offOverflowClassName]: offOverflow,
    [autoHeightClassName]: autoHeight,
    [largeClassName]: large,
    [xLargeClassName]: xLarge
  })

  return (
    <ReactModal
      {...modalProps}
      className={classes}
      overlayClassName={`c-modal__overlay ${overlayClassName || ''}`}
      data-test="dialog"
    >
      {children}
    </ReactModal>
  )
}
