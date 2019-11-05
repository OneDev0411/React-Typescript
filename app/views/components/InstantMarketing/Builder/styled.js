import styled from 'styled-components'

export const Container = styled.div`
  position: fixed;
  display: block;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: #fff;
`

export const TemplatesContainer = styled.div`
  width: 340px;
  border-right: 1px solid #d4d4d4;
  background-color: #f2f2f2;

  ${props =>
    props.isInvisible &&
    `
    visibility: hidden;
  `};
`

export const BuilderContainer = styled.div`
  display: flex;
  background: #f2f2f2;

  #grapesjs-canvas {
    height: 90vh !important;
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 3rem;
  border-bottom: 1px solid #d4d4d4;
  padding: 0 0.5rem;

  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin: 0 1rem !important;
  }
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: flex-end;
`
