import * as React from 'react'
import { ReactNode, CSSProperties } from 'react'

import CloseIcon from '../SvgIcons/Close/CloseIcon'
import { CalloutCloseButton, CalloutContainer, CalloutContent } from './styled'

interface Props {
  onClose?: (event: React.MouseEvent) => void
  type?: 'info' | 'warn' | 'success' | 'error' | 'default'
  children: ReactNode
  style?: CSSProperties
  dense?: boolean
}

export function Callout({
  type = 'default',
  style,
  dense = false,
  children,
  onClose
}: Props) {
  return (
    <CalloutContainer style={style} type={type} dense={dense}>
      <CalloutContent>{children}</CalloutContent>
      {onClose && (
        <CalloutCloseButton iconSize="small" onClick={onClose}>
          <CloseIcon />
        </CalloutCloseButton>
      )}
    </CalloutContainer>
  )
}
