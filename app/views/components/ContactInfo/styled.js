import styled from 'styled-components'

export const ContactInfoContainer = styled.div`
  display: flex;
  align-items: center;

  & .profile-info {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;

    & span:first-child {
      font-size: 1rem;
    }
    & span:nth-child(2) {
      font-size: 0.875rem;
      color: #ccc;
    }
  }
`
