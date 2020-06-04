import styled, { css } from 'styled-components'

export const Container = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    border-radius: 3px;
    background-color: ${theme.palette.grey[100]};
    border: 1px dashed ${theme.palette.divider};
    margin: 1rem;
    padding: 0 1rem;
    white-space: nowrap;
    overflow: auto;
    ${theme.typography.body1};
  `}
`

export const ItemLink = styled.span`
  ${({ theme }) => css`
    color: ${theme.palette.secondary.main};
    margin: ${theme.spacing(0, 0.5)};
    cursor: pointer;
    white-space: nowrap;
  `}
`
