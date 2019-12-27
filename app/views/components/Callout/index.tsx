import * as React from 'react'
import { ReactNode, CSSProperties } from 'react'
import { Tooltip } from '@material-ui/core'

import CloseIcon from '../SvgIcons/Close/CloseIcon'

import { CalloutCloseButton, CalloutContainer, CalloutContent } from './styled'

interface RenderWithTooltipProps {
  children: ReactNode
  title?: string
}

function RenderWithTooltip({ children, title }: RenderWithTooltipProps) {
  if (title) {
    return <Tooltip title={title}>{children}</Tooltip>
  }

  return <>{children}</>
}

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
