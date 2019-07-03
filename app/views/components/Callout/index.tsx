import * as React from 'react'
import { ReactNode } from 'react'

import CloseIcon from '../SvgIcons/Close/CloseIcon'
import { CalloutCloseButton, CalloutContainer, CalloutContent } from './styled'

interface Props {
  onClose?: (event: React.MouseEvent) => void
  type?: 'info' | 'warn' | 'success' | 'error'
  children: ReactNode
}

export function Callout(props: Props) {
  return (
    <CalloutContainer type={props.type || 'info'}>
      <CalloutContent>{props.children}</CalloutContent>
      {props.onClose && (
        <CalloutCloseButton iconSize="small" onClick={props.onClose}>
          <CloseIcon />
        </CalloutCloseButton>
      )}
    </CalloutContainer>
  )
}
