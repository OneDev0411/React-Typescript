import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  margin-right: 0.25rem;
  cursor: pointer;
`

export const BadgeCounter = styled.div`
  position: absolute;
  background: ${({ theme }) => theme.palette.error.main};
  top: -3px;
  right: -3px;
  font-size: 10px;
  color: #fff;
  border-radius: 4px;
  padding: 0 3px;
  border: 2px solid #fff;
`
