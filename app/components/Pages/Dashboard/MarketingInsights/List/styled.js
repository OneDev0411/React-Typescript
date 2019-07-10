import styled from 'styled-components'

import ALink from 'components/ALink'
import Badge from 'components/Badge'
import { grey } from 'views/utils/colors'

export const InsightContainer = styled.div`
  & .insight-table-container {
    padding: 0 1.5rem;
    opacity: 0;
    transform: translateY(3rem);
    transition: all 0.5s 0.2s;

    &.show {
      opacity: 1;
      transform: translateY(0);
    }
  }

  & .info-title {
    display: flex;
    justify-content: space-between;
  }
`

export const Info = styled.div`
  display: flex;
  align-items: center;

  & .sub-info {
    color: ${grey.A600};
    font-size: 0.875rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    margin-right: 0.5rem;
  }

  & .main-info {
  }
`

export const Link = styled(ALink)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  font-weight: 500;
  margin-top: -4px;
`

export const StyledBadge = styled(Badge)`
  padding: 0.25rem 0.75rem;
  margin-left: 0.25rem;
`
