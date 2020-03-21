import styled, { keyframes, css } from 'styled-components'

const infinityLoading = keyframes`
  from {
    left: 0;
  }

  to {
    left: 100%;
  }
`

export const Container = styled.div`
  position: relative;
  display: flex;
  width: 30rem;
  height: 16px;
  border: 1px solid #f3f3f3;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
  margin: 8px 0;
`

export const Bar = styled.div`
  background-color: ${({ theme }) => theme.palette.secondary.main};
  width: ${props => props.percents}%;
  transition: width 0.2s ease-in;
  max-width: 100%;

  ${props =>
    props.indeterminate &&
    css`
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 30%
      animation: ${infinityLoading} 1.5s linear infinite;
    `};
`
