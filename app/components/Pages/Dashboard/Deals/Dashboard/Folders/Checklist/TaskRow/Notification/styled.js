import styled from 'styled-components'

import Badge from 'components/Badge'

export const Container = styled.div`
  position: relative;
  margin-right: 1rem;
  padding-top: 5px;
  cursor: pointer;

  svg path {
    fill: #17181a;
  }
`

export const BadgeCounter = styled(Badge)`
  position: absolute;
  font-size: 0.75rem;
  top: -0.5rem;
  right: -0.6rem;
`
