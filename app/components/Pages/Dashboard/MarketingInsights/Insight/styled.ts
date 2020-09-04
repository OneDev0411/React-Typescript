import styled from 'styled-components'

import Badge from 'components/Badge'

export const ContactColumn = styled.div`
  display: block;
  padding-right: 1rem;

  .labels-container {
    & > span {
      margin-left: 0.5rem;
    }
  }
`
export const StyledBadge = styled(Badge as any)`
  padding: 0.25rem 0.75rem;
` as typeof Badge
