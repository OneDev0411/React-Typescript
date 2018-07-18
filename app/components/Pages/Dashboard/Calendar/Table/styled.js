import styled from 'styled-components'

export const GridContainer = styled.div`
  min-height: calc(100vh - 106px);
  max-height: calc(100vh - 106px);
  padding: 15px;
  overflow: auto;
`

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  border-radius: 4px;
  background-color: #eff5fa;
  padding: 0 16px;
  margin: 15px 0;
  color: #2196f3;
  font-size: 17px;
  font-weight: 600;
  position: sticky;
  top: 32px;
  font-weight: ${props => (props.isSelectedDay ? 500 : 400)};
  background-color: ${props => (props.isSelectedDay ? '#eff5fa' : '#dce5eb')};
  color: ${props => (props.isSelectedDay ? '#2196f3' : '#1d364b')};
`
