import styled from 'styled-components'

export const ProfileContainer = styled.div`
  width: 480px;

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem 1rem 1.5rem;
  }

  .details {
    padding: 0 1.5rem 1rem 1.5rem;

    & > div,
    & .person-more-info > div {
      display: flex;

      & button {
        padding-top: 0;
        padding-bottom: 0;
      }
    }

    & .person-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

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

    .person-socials {
      margin-top: 0.065rem;

      & > a {
        margin-right: 0.5rem;
      }
    }
  }

  .activity {
    padding: 0.75rem 1.5rem;
    background: #f2f2f2;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      & > li {
        display: flex;
        align-items: center;
        margin-bottom: 0.25rem;

        & .icon {
          margin-right: 0.5rem;
          display: flex;
        }
      }
    }
  }
`
