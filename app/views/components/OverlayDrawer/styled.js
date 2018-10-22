import styled from 'styled-components'

export const Content = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: ${props => (props.isOpen ? 0 : '-100%')};
  width: 100%;
  background-color: #fff;
  transition: 0.2s ease-in all;
  z-index: 1001;

  ${props =>
    props.isOpen &&
    `
    box-shadow: -10px 0 20px 0 rgba(79, 99, 121, 0.19),
    6px 0 6px 0 rgba(22, 40, 59, 0.26);
  `};

  @media (min-width: 48em) {
    width: 37rem;
    right: ${props => (props.isOpen ? 0 : '-37rem')};
  }
`

export const Backdrop = styled.div`
  display: ${props => (props.show ? 'block' : 'none')};
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
`
