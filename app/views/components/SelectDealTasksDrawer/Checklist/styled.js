import styled, { css } from 'styled-components'

export const Container = styled.div`
  margin-bottom: 2.5rem;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`

export const NewChecklistItem = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    font-size: 1rem;
    font-weight: 500;
    color: ${theme.palette.secondary.main};
    cursor: pointer;

    svg {
      fill: ${theme.palette.secondary.main};
      margin-right: 0.5rem;
    }
  `}
`

export const Title = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  letter-spacing: normal;
  color: #000;
`
