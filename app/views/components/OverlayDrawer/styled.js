import styled from 'styled-components'

function getWidth(base = 60, scale = 0) {
  return base - scale * 15
}

export const Content = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: ${props => (props.isOpen ? 0 : '-100%')};
  width: 100%;
  background-color: #fff;
  transition: 0.2s ease-in all;
  z-index: 1001;
  padding: 58px 1.5rem 0;

  ${props =>
    props.isOpen &&
    `
    box-shadow: -10px 0 20px 0 rgba(79, 99, 121, 0.19),
    6px 0 6px 0 rgba(22, 40, 59, 0.26);
  `};

  @media (min-width: 48em) {
    width: ${props => getWidth(props.width)}%;
    right: -${props => (props.isOpen ? 0 : getWidth(props.width))}%;
  }

  @media (min-width: 75em) {
    width: ${props => getWidth(props.width, 1)}%;
    right: -${props => (props.isOpen ? 0 : getWidth(props.width, 1))}%;
  }

  @media (min-width: 100em) {
    width: ${props => getWidth(props.width, 2)}%;
    right: -${props => (props.isOpen ? 0 : getWidth(props.width, 2))}%;
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
