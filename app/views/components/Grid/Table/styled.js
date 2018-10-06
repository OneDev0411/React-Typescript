import styled from 'styled-components'

import { borderColor, grey, primary } from '../../../utils/colors'

const border = `1px solid ${borderColor}`

export const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 1.5em;
`

export const ActionsBar = styled.div`
  display: flex;
  flex: 1;
  margin-left: 0.5em;
`

export const TBody = styled.div`
  ${props => props.css};
`

export const Row = styled.div`
  display: flex;
  justify-items: center;
  min-height: 4em;
  padding: 1em 0;
  border-top: ${border};

  ${props =>
    `
    :hover {
      ${
        props.hoverStyle
          ? props.hoverStyle
          : `
     
        background-color: ${grey.A000};

        a, .primaryHover {
          color: ${primary}
        }
        .blackHover{
          color: #000000;
        }
      
    `
      }
    }
  `};

  ${props =>
    props.multiple &&
    `
    :first-child {
      border-top: none !important;
    }
  `};

  ${props => props.css};
`

export const Cell = styled.div`
  align-self: ${props => props.verticalAlign || 'flex-start'};
  text-align: left;
  padding: 0 0.5em;

  &:first-of-type {
    padding-left: 0;
  }

  &:last-of-type {
    padding-right: 0;
  }

  ${props =>
    props.width &&
    `
    width: ${props.width}
  `};

  ${props =>
    props.hoverStyle &&
    `
    :hover {
      ${props.hoverStyle}
    }
  `};

  ${props => props.css};
`
