import React, { ReactNode, CSSProperties } from 'react'

import { closeIcon } from 'components/SvgIcons/icons'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import RenderWithTooltip from './RenderWithTooltip'
import { CalloutCloseButton, CalloutContainer, CalloutContent } from './styled'

interface Props {
  onClose?: (event: React.MouseEvent) => void
  type?: 'info' | 'warn' | 'success' | 'error' | 'default'
  children: ReactNode
  style?: CSSProperties
  className?: string
  dense?: boolean
  closeButtonTooltip?: string
}

export function Callout({
  type = 'default',
  className = '',
  style,
  dense = false,
  children,
  onClose,
  closeButtonTooltip
}: Props) {
  return (
    <CalloutContainer
      style={style}
      type={type}
      dense={dense}
      className={className}
    >
      <CalloutContent>{children}</CalloutContent>
      {onClose && (
        <RenderWithTooltip title={closeButtonTooltip}>
          <CalloutCloseButton iconSize="small" onClick={onClose}>
            <SvgIcon path={closeIcon} />
          </CalloutCloseButton>
        </RenderWithTooltip>
      )}
    </CalloutContainer>
  )
}
