import styled from 'styled-components'

import { primary } from 'views/utils/colors'

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  border-radius: 3px;
  background-color: #ededed;
  border: 1px dashed #b2b2b2;
  margin-bottom: 1.5rem;
  padding: 0 1rem;
`

export const ItemLink = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.43;
  margin: 0 0.25rem;
  color: ${primary};
  cursor: pointer;
`
