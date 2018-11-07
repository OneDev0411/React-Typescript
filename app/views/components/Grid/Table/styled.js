import styled, { css } from 'styled-components'

import { borderColor, grey, primary } from '../../../utils/colors'

const importantBlack = '#000 !important'
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
  padding: 0.5em;
  border-top: ${border};

  ${props =>
    css`
      :hover {
        ${props.hoverStyle
          ? props.hoverStyle
          : css`
              background-color: ${grey.A000};

              a,
              .primaryHover {
                color: ${primary};
              }
              .hover-color--black {
                color: ${importantBlack};
                fill: ${importantBlack};

                svg {
                  fill: ${importantBlack};
                }
              }
            `};
      }
    `};

  ${props =>
    props.multiple &&
    css`
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
    css`
      width: ${props.width};
    `};

  ${props =>
    props.hoverStyle &&
    css`
      :hover {
        ${props.hoverStyle};
      }
    `};

  ${props => props.css};
`
