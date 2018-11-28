import styled from 'styled-components'

import Link from 'components/ALink'

export const FileNameLink = styled(Link)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 1em;
  font-size: 1rem;
  font-weight: 500;
  padding: 0;
  margin: 0;
  cursor: pointer;
`

export const Details = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 0.875rem;
  font-weight: normal;
  color: gray;
`

export const FileDate = styled.div``
