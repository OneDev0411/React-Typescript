import styled from 'styled-components'

import { grey, primary } from 'views/utils/colors'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`

export const Description = styled.h2`
  font-size: 1rem;
  font-weight: normal;
  color: #4a4a4a;
  margin: 0 1.5rem;
`

export const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.5rem 0;
  transition: background-color 1s ease-in;
`

export const ItemsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  > div {
    padding: 0;
    display: flex;
    align-items: center;
  }
`

export const RowTitle = styled.h6`
  color: ${grey.A900};
  font-size: 1rem;
  line-height: 1.5rem;
  margin: auto 1.5rem;
  min-width: 1.3125rem;
`

export const TextInputSuffix = styled.button`
  outline: none;
  border: none;
  background: transparent;
  font-size: 1rem;
  padding: 0 1rem;
  margin: auto;
  color: ${({ disabled }) => (disabled ? grey.A900 : primary)};
`

export const TextInputPrefix = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  margin-left: 0.75rem;
`
