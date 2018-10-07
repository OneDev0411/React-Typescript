import styled from 'styled-components'

export const Container = styled.div`
  .messages {
    height: auto !important;
    margin: 0 !important;

    .loading {
      width: 90%;
    }

    .messages-list {
      margin-top: 10px !important;
      margin-bottom: 2rem !important;
      min-height: auto !important;
      max-height: none !important;
      width: 100%;
    }

    .messages-list .activity {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      color: #62778c;
      font-size: 0.875;
      height: 2rem;
      border-radius: 3px;
      background-color: #f7f7f7;
      margin: 0.5rem 0;

      .name {
        color: #000;
        max-width: 20rem;
        font-weight: 600;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
`
