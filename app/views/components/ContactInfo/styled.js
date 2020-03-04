import styled from 'styled-components'

export const ContactInfoContainer = styled.div`
  display: flex;
  align-items: center;

  & .profile-info {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
    & span {
      font-size: ${props => props.theme.typography.body2.fontSize};
    }
    & span:nth-child(2) {
      color: #ccc;
    }
  }
`
