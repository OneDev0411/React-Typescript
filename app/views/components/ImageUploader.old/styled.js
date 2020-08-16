import styled from 'styled-components'

export const ModalContentContainer = styled.div`
  width: 100%;
  height: calc(100% - 145px);
  display: flex;

  canvas {
    width: auto !important;
    height: auto !important;
    max-width: 100%;
    max-height: 100%;
  }
`
