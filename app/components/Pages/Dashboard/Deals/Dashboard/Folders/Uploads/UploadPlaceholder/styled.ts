import styled, { css } from 'styled-components'

import { primary } from 'views/utils/colors'

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
  `}
`

export const ItemLink = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.43;
  margin: 0 0.25rem;
  color: ${primary};
  cursor: pointer;
`
