import React, { ComponentProps, ReactNode } from 'react'
import styled from 'styled-components'

import CloseIcon from '../SvgIcons/Close/CloseIcon'
import BareModal from '../BareModal'
import { H3 } from '../Typography/headings'
import IconButton from '../Button/IconButton'

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

export function ModalHeader({
  title,
  children = null,
  closeHandler = () => {}
}) {
  return (
    <HeaderContainer>
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
        <IconButton iconSize="large" isFit inverse onClick={closeHandler}>
          <CloseIcon />
        </IconButton>
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
