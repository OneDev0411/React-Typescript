import styled from 'styled-components'

export const Label = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
  border-radius: 0.75rem;
  background: transparent;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 5rem;
  margin-right: 0.5rem;
  max-height: 1.5rem;

  svg {
    margin-right: 0.3125rem;
    width: 0.6rem;
    height: 0.6rem;
  }

  &.Incomplete {
    display: none;
  }

  &.Pending,
  &.ATTENTION,
  &.Submitted,
  &.Notified {
    background-color: #f6a623;
  }

  &.Declined {
    background-color: #d0011b;
  }

  &.Approved {
    background-color: #35b863;
  }

  &.Required {
    background-color: #fff;
    border: 1px solid ${props => props.theme.palette.common.black};
    color: ${props => props.theme.palette.common.black};
  }
`
