import styled, { css } from 'styled-components'

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

  ${({ highlight, theme }) =>
    highlight &&
    css`
      background-color: ${theme.palette.grey[50]};
    `}
`

export const ItemsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;

  > div {
    padding: 0;
    display: flex;
    align-items: center;
  }
`

export const RowTitle = styled.h6`
  color: ${({ theme }) => theme.palette.grey[600]};
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
  color: ${({ disabled, theme }) =>
    disabled ? theme.palette.grey[600] : theme.palette.primary.main};
`

export const TextInputPrefix = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  margin-left: 0.75rem;
`
