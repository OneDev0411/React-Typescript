import React, { ReactNode } from 'react'
import ReactModal, { Props as ReactModalProps } from 'react-modal'
import cn from 'classnames'

ReactModal.setAppElement('#app')

interface Props extends ReactModalProps {
  autoHeight: boolean
  children: ReactNode
  className: string
  overlayClassName: string
}

export default function BareModal({
  autoHeight,
  children,
  className,
  overlayClassName,
  ...modalProps
}: Props) {
  const baseClassName = 'c-modal__content'
  const autoHeightClassName = `${baseClassName}--height-auto`
  const classes = cn(baseClassName, className, {
    [autoHeightClassName]: autoHeight
  })

  return (
    <ReactModal
      {...modalProps}
      className={classes}
      overlayClassName={`c-modal__overlay ${overlayClassName || ''}`}
    >
      {children}
    </ReactModal>
  )
}
