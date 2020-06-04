import styled from 'styled-components'

import { styled as muiStyled } from '@material-ui/styles'
import BaseDivider from '@material-ui/core/Divider'

export const Container = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: ${props => props.theme.zIndex.modal};
  background-color: #fff;

  ${props =>
    props.hideBlocks &&
    `
    .gjs-blocks-cs {
      display: none
    }
  `}
`

export const TemplatesContainer = styled.div`
  width: 21rem;
  border-right: 1px solid #d4d4d4;
  background-color: #f2f2f2;

  ${props =>
    props.isInvisible &&
    `
    display: none;
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
  height: 4rem;
  border-bottom: 1px solid #d4d4d4;
  padding: 0 0.5rem;
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: flex-end;
`

export const Divider = muiStyled(BaseDivider)({
  height: '60%',
  margin: '0 1rem'
})
