import styled, { css } from 'styled-components'

interface ContainerProps {
  hasBorder: boolean
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  ${props =>
    props.hasBorder &&
    css`
      border-bottom: 1px solid rgba(219, 230, 253, 0.5);
    `}
`

export const Time = styled.div`
  width: 8.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.25px;
  color: #536280;
`

export const Title = styled.div``

export const SubTitle = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.25px;

  color: #6a7589;
`
