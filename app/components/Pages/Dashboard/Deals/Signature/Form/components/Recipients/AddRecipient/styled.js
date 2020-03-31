import styled from 'styled-components'

export const Container = styled.div`
  position: relative;

  button {
    svg {
      fill: ${({ theme }) => theme.palette.secondary.main};
    }
  }
`

export const Menu = styled.div`
  position: absolute;
  z-index: 1;
  top: 2.5rem;
  left: 0;
  right: 0;
  padding: 0.875rem 0;
  border-radius: 3px;
  background-color: #fff;
  box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.15),
    0 8px 10px 0 rgba(0, 0, 0, 0.16);
`
