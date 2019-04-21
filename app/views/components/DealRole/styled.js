import styled from 'styled-components'

export const Container = styled.div`
  position: absolute;
  top: 40px;
  left: 0;
  z-index: 1;
  max-width: 100vw;
  width: 35rem;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 1.5px 6px rgba(0, 0, 0, 0.12), 0 1.5px 6px rgba(0, 0, 0, 0.24);
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  background-color: #f2f2f2;
  padding: 1rem 0.5rem;
`

export const Body = styled.div`
  padding: 1rem 0.5rem;
`

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0.5rem;
  background-color: #f2f2f2;
`
