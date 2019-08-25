import styled, { css } from 'styled-components'

import { borderColor, grey, primary } from '../../../utils/colors'

const importantBlack = '#000 !important'
const border = `1px solid ${borderColor}`

export const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 1.5rem 0;

  ${props =>
    props.isToolbarSticky &&
    `
      position: sticky;
      top: 0;
      background: #fff;
      z-index: 1;
  `}
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
                border-color: ${primary};

                svg {
                  fill: ${primary};
                }
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
  align-self: flex-start;
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
