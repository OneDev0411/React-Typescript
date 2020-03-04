import styled from 'styled-components'

import ALink from 'components/ALink'
import Badge from 'components/Badge'
import { grey } from 'views/utils/colors'

export const InsightContainer = styled.div`
  & .info-title {
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
    &:hover {
      color: ${props => props.theme.palette.secondary.main};
    }
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
`

export const StyledLink = styled(ALink)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  font-weight: 500;
  margin-top: -4px;
  cursor: pointer;
  &:hover {
    text-decoration-color: ${props => props.theme.palette.secondary.main};
  }
`

export const StyledBadge = styled(Badge)`
  padding: 0.25rem 0.75rem;
  margin-left: 0.25rem;
`
