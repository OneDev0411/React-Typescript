import React, { ReactNode, CSSProperties } from 'react'

import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

import RenderWithTooltip from './RenderWithTooltip'
import { CalloutCloseButton, CalloutContainer, CalloutContent } from './styled'

interface Props {
  onClose?: (event: React.MouseEvent) => void
  type?: 'info' | 'warn' | 'success' | 'error' | 'default'
  children: ReactNode
  style?: CSSProperties
  dense?: boolean
  closeButtonTooltip?: string
}

export function Callout({
  type = 'default',
  style,
  dense = false,
  children,
  onClose,
  closeButtonTooltip
}: Props) {
  return (
    <CalloutContainer style={style} type={type} dense={dense}>
      <CalloutContent>{children}</CalloutContent>
      {onClose && (
        <RenderWithTooltip title={closeButtonTooltip}>
          <CalloutCloseButton iconSize="small" onClick={onClose}>
            <CloseIcon />
          </CalloutCloseButton>
        </RenderWithTooltip>
      )}
    </CalloutContainer>
  )
}
