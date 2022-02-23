import styled from 'styled-components'

export const Container = styled.span`
  margin-left: 0.25rem;
  position: relative;
  display: flex;
  align-items: center;
`

export const RolesList = styled.div`
  position: absolute;
  min-width: 16rem;
  top: ${props => props.top + 5}px;
  left: 0;
  background: #fff;
  z-index: 9;
  padding: 1rem 0;
  border-radius: 4px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
`
