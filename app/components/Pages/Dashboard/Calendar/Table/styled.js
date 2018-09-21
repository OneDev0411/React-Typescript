import styled from 'styled-components'

import { grey, primary } from '../../../../../views/utils/colors'
import ALink from '../../../../../views/components/ALink'

export const GridContainer = styled.div`
  height: calc(100vh - 121px);
  padding: 0 1em 0 1.5em;
  overflow: auto;
`

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  border-radius: 3px;
  background-color: ${grey.A100};
  padding: 0 1em;
  color: ${primary};
  font-weight: 600;
  position: sticky;
  top: 0.5em;
  font-weight: ${props => (props.isSelectedDay ? 600 : 400)};
  background-color: ${props => (props.isSelectedDay ? '#000000' : grey.A100)};
  color: ${props => (props.isSelectedDay ? '#ffffff' : '#000')};
`

export const Title = ALink.extend`
  font-size: 1.25rem;
  font-weight: 500;
  cursor: pointer;
`
export const Label = styled.span`
  color: ${grey.A900};
`

export const Indicator = styled.div`
  color: ${grey.A300};
  margin: 0 0.5em;
`
