import styled from 'styled-components'
import Badge from 'components/Badge'

export const Container = styled.div`
  position: relative;
  margin-left: 1rem;
`

export const BadgeCounter = styled(Badge)`
  position: absolute;
  font-size: 0.75rem;
  top: -0.5rem;
  right: -0.6rem;
`
