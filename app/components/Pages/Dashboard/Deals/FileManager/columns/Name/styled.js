import styled from 'styled-components'

import Link from 'components/ALink'

export const FileIcon = styled.img`
  max-width: 20px;
  max-height: 50px;
`

export const FileNameLink = styled(Link)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 1em;
  font-size: 1rem;
  font-weight: 500;
`

export const FileDate = styled.div`
  font-size: 0.875rem;
  color: #999;
  font-weight: normal;
`
