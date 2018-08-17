import styled from 'styled-components'

const border = '1px solid #d4d4d4'

export const Container = styled.div`
  width: 100%;
  font-family: 'Barlow', sans-serif;
  font-size: 16px;
  line-height: 24px;
`

export const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`

export const ActionsBar = styled.div`
  display: flex;
  flex-direction: row;
`

export const TBody = styled.div``

export const Row = styled.div`
  display: flex;
  justify-items: center;
`

export const BodyRow = Row.extend`
  display: flex;
  height: 64px;
  align-items: center;
  padding: 12px 0;
  border-top: ${border};

  ${props =>
    props.hoverStyle &&
    `
    :hover {
      ${props.hoverStyle}
    }
  `};
`

export const Cell = styled.div`
  align-self: ${props => props.verticalAlign || 'flex-start'};
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

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

  > :first-child {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
