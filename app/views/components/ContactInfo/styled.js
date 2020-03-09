import styled from 'styled-components'

export const ContactInfoContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;

  & .profile-info {
    max-width: 100%;
    margin-left: 1rem;
    & span {
      display: block;
      font-size: ${props => props.theme.typography.body2.fontSize};
    }
    & span:nth-child(2) {
      color: #ccc;
    }
  }
`
