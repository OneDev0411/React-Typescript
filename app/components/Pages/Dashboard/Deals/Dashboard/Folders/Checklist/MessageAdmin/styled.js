import styled, { css } from 'styled-components'

export const Container = styled.div`
  position: relative;
`

export const BadgeCounter = styled.div`
  ${({ theme }) => css`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${theme.palette.error.main};
    top: -11px;
    right: 0px;
    font-size: 13px;
    color: #fff;
    border-radius: 100%;
    padding: 0 3px;
    min-width: 1.3rem;
    min-height: 1.3rem;

    svg {
      width: 12px;
      height: 12px;
    }

    ${props =>
      props.isRectangle &&
      `
    
      border-radius: 3px;
      padding: 0 5px;
    `}
  `}
`
