import React, { ReactNode } from 'react'
import ReactModal, { Props as ReactModalProps } from 'react-modal'
import cn from 'classnames'

if (document.body.querySelector('#app')) {
  ReactModal.setAppElement('#app')
}

interface Props extends ReactModalProps {
  autoHeight?: boolean
  large?: boolean
  children: ReactNode
  className?: string
  overlayClassName?: string
}

export default function BareModal({
  autoHeight,
  children,
  className,
  overlayClassName,
  large,
  ...modalProps
}: Props) {
  if (process.env.DISABLE_MODAL) {
    return <>{children}</>
  }

  const baseClassName = 'c-modal__content'
  const autoHeightClassName = `${baseClassName}--height-auto`
  const largeClassName = `${baseClassName}--large`
  const classes = cn(baseClassName, className, {
    [autoHeightClassName]: autoHeight,
    [largeClassName]: large
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
