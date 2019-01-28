import styled from 'styled-components'

import { primary } from 'views/utils/colors'

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #d4d4d4;
  padding: 0.875rem 0;
`

export const NameContainer = styled.div`
  flex: 0.9;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const Title = styled.div`
  font-size: 1rem;

  :hover {
    color: ${primary};
    text-decoration: underline;
    cursor: pointer;
  }
`

export const DateTime = styled.div`
  font-size: 0.875rem;
  color: #999;
`
