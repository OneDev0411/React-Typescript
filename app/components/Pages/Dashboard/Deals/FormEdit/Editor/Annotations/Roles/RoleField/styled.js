import styled from 'styled-components'

export const RoleItem = styled.span`
  background-color: ${props => (props.isActive ? '#fee533' : 'transparent')};

  :hover {
    cursor: pointer;
    background-color: #fee533;
    color: #262626;
  }
`
