import styled from 'styled-components'

import { grey, primary } from '../../../../../views/utils/colors'

export const GridContainer = styled.div`
  min-height: calc(100vh - 137px);
  max-height: calc(100vh - 137px);
  padding: 1em;
  overflow: auto;
`

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  border-radius: 4px;
  background-color: ${grey.A100};
  padding: 0 16px;
  margin: 15px 0;
  color: ${primary};
  font-size: 17px;
  font-weight: 600;
  position: sticky;
  top: 32px;
  font-weight: ${props => (props.isSelectedDay ? 600 : 400)};
  background-color: ${props => (props.isSelectedDay ? primary : grey.A100)};
  color: ${props => (props.isSelectedDay ? '#fff' : '#000')};
`
