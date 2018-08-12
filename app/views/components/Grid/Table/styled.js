import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  margin-top: 16px;
`

export const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`

export const ActionsBar = styled.div`
  display: flex;
  flex-direction: row;
`

export const Body = styled.div``

export const Row = styled.div`
  display: flex;
`

export const BodyRow = Row.extend`
  display: flex;
  min-height: 48px;
  align-items: center;
  border-bottom: 1px solid #dce5eb;
  padding: 8px 0;

  ${props =>
    props.hoverStyle &&
    `
    :hover {
      ${props.hoverStyle}
    }
  `};
`

export const Cell = styled.div`
  text-align: left;

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
`

export const BodyCell = Cell.extend`
  font-size: 14px;
  font-weight: 400;
  color: #1d364b;
  padding: 0 4px;
`
