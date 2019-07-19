import * as React from 'react'
import { ReactNode } from 'react'

import CloseIcon from '../SvgIcons/Close/CloseIcon'
import { CalloutCloseButton, CalloutContainer, CalloutContent } from './styled'

interface Props {
  onClose?: (event: React.MouseEvent) => void
  type?: 'info' | 'warn' | 'success' | 'error'
  children: ReactNode
}

export function Callout({ type = 'info', children, onClose }: Props) {
  return (
    <CalloutContainer type={type}>
      <CalloutContent>{children}</CalloutContent>
      {onClose && (
        <CalloutCloseButton iconSize="small" onClick={onClose}>
          <CloseIcon />
        </CalloutCloseButton>
      )}
    </CalloutContainer>
  )
}
