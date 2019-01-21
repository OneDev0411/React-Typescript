import styled from 'styled-components'

export const Label = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  min-width: 3rem;
  border-radius: 2px;
  background: transparent;
  padding: 0 0.75rem;
  font-size: 0.825rem;
  max-height: 1.5rem;

  &.Incomplete {
    display: none;
  }

  &.Pending,
  &.ATTENTION {
    background-color: #f6a623;
  }

  &.Declined {
    background-color: #d0011b;
  }

  &.Approved {
    background-color: #35b863;
  }

  &.Submitted,
  &.Notified {
    background-color: #f6a623;
  }
`
