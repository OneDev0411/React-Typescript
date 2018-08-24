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
  width: 320px;
  border-right: 1px solid #d4d4d4;
  background-color: #f2f2f2;
`

export const BuilderContainer = styled.div`
  display: flex;
  background: red;

  #grapesjs-canvas {
    height: 90vh !important;
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 10vh;
  border-bottom: 1px solid #d4d4d4;
  padding: 0 20px;

  h1 {
    font-size: 32px;
    font-weight: bold;
    margin: 0 !important;
  }
`
