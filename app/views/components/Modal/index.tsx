import React, { ComponentProps, ReactNode } from 'react'
import { IconButton } from '@material-ui/core'
import { mdiClose } from '@mdi/js'
import styled from 'styled-components'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import BareModal from '../BareModal'
import { H3 } from '../Typography/headings'

const HeaderContainer = styled.div`
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1em;
  box-shadow: 0 1px 3px 0 #d4d4d4;
  border-radius: 5px 5px 0 0;
  font-family: Merriweather, sans-serif;
  font-size: 20px;
  font-weight: 900;
  line-height: 3.6;
`

interface ModalHeaderProps {
  title: ReactNode
  closeHandler?(): void
  children?: ReactNode
  className?: string
}

export function ModalHeader({
  title,
  closeHandler,
  children = null,
  className = ''
}: ModalHeaderProps) {
  return (
    <HeaderContainer className={className}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <H3>{title}</H3>
        {closeHandler && (
          <IconButton onClick={closeHandler} data-test="close-modal">
            <SvgIcon path={mdiClose} />
          </IconButton>
        )}
      </div>
      {children}
    </HeaderContainer>
  )
}

export const ModalFooter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  height: 72px;
  padding: 0 1em;
  border-top: 1px solid #d4d4d4;
`
export const ModalContent = styled.div`
  padding: 24px;
`

interface Props extends ComponentProps<typeof BareModal> {
  Header?: ReactNode
  Footer?: ReactNode
  children: ReactNode
}

export function Modal({
  Header = null,
  Footer = null,
  children,
  ...props
}: Props) {
  return (
    <BareModal {...props}>
      {Header}
      {children}
      {Footer}
    </BareModal>
  )
}
