import styled from 'styled-components'
import { getDashboardHeight } from '../utils/get-dashboard-height'

export const DealTasks = styled.div`
  min-height: ${({ traningAccount }) => getDashboardHeight(traningAccount)};
  max-height: ${({ traningAccount }) => getDashboardHeight(traningAccount)};
`

export const DealContent = DealTasks.extend`
  position: relative;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  will-change: overflow;
  backface-visibility: hidden;

  .column {
    padding: 0;
    height: auto;
  }
`
