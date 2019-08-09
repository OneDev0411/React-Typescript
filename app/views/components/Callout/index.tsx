import * as React from 'react'
import { ReactNode, CSSProperties } from 'react'

import CloseIcon from '../SvgIcons/Close/CloseIcon'
import { CalloutCloseButton, CalloutContainer, CalloutContent } from './styled'

interface Props {
  onClose?: (event: React.MouseEvent) => void
  type?: 'info' | 'warn' | 'success' | 'error'
  children: ReactNode
  style?: CSSProperties
}

export function Callout({ type = 'info', style, children, onClose }: Props) {
  return (
    <CalloutContainer style={style} type={type}>
      <CalloutContent>{children}</CalloutContent>
      {onClose && (
        <CalloutCloseButton iconSize="small" onClick={onClose}>
          <CloseIcon />
        </CalloutCloseButton>
      )}
    </CalloutContainer>
  )
}
