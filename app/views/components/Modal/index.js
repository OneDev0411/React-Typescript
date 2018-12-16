import React from 'react'
import styled from 'styled-components'

import CloseIcon from '../SvgIcons/Close/CloseIcon'
import BareModal from '../BareModal'
import { H3 } from '../Typography/headings'

const HeaderContainer = styled.div`
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1em;
  box-shadow: 0 1px 3px 0 #d4d4d4;
  font-family: Merriweather, sans-serif;
  font-size: 20px;
  font-weight: 900;
  line-height: 3.6;
`

export function ModalHeader({ title, children, closeHandler = () => {} }) {
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
        <CloseIcon onClick={closeHandler} style={{ cursor: 'pointer' }} />
      </div>
      {children}
    </HeaderContainer>
  )
}

export const ModalFooter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 72px;
  padding: 0 1em;
  border-top: 1px solid #d4d4d4;
`

export function Modal({ Header, Footer, children, ...props }) {
  return (
    <BareModal {...props}>
      {Header}
      {children}
      {Footer}
    </BareModal>
  )
}
