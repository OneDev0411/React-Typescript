import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { borderColor } from '../../../../../../views/utils/colors'

export const MainContainer = styled(Flex)`
  height: calc(100vh - 10rem - 2px);
  overflow: hidden;
`

export const MapContainer = styled.div`
  width: calc(100% - 26em - 1px);
  position: relative;
`

export const TableContainer = styled.div`
  width: 26em;
  padding: 1em;
  overflow-y: scroll;
  border-left: 1px solid ${borderColor};
`
