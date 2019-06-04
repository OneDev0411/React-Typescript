import styled from 'styled-components'

export const ProfileContainer = styled.div`
  min-width: 480px;

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem 1rem 1.5rem;
  }

  .details {
    padding: 0 1.5rem 1rem 1.5rem;

    & > div:first-child {
      font-size: 1.375rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    & > div:nth-child(2) {
      margin-bottom: 1px;
    }

    .person-more-info {
      margin-top: 1rem;
    }
  }

  .activity {
    padding: 1.5rem;
    background: #f2f2f2;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      & > li {
        display: flex;
        align-items: center;

        & .icon {
          margin-right: 0.25rem;
        }
      }
    }
  }
`
