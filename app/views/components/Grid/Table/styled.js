import styled from 'styled-components'

import { borderColor } from '../../../utils/colors'

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
    props.hoverStyle &&
    `
    :hover {
      ${props.hoverStyle}
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
  padding: 0 1em;

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
