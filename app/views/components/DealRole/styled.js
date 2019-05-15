import styled from 'styled-components'

import { grey } from 'views/utils/colors'

export const Container = styled.div`
  position: absolute;
  top: ${props => (props.position && props.position.top) || 0};
  left: ${props => (props.position && props.position.left) || 0};
  z-index: 101;
  max-width: 100vw;
  width: 35rem;
  border-radius: 3px;
  background-color: #fff;
  box-shadow: 0 1.5px 6px rgba(0, 0, 0, 0.12), 0 1.5px 6px rgba(0, 0, 0, 0.24);
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${grey.A100};
  padding: 0 0.5rem;
`

export const Body = styled.div`
  padding: 0.5rem;
`

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.5rem;
  background-color: ${grey.A100};
`

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.1);
`
